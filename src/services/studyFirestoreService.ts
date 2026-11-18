import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { WordTokenData } from '../components/InteractiveSentence';

export type StudyLevel = 'simples' | 'intermediario' | 'avancado';

export interface FullSentenceData {
  id?: string;
  groupNumber: number;
  level: StudyLevel;
  sentence: string;
  translationPt: string;
  contextNote: string;
  tokens: WordTokenData[];
  createdAtMs?: number;
}

export interface ThreeWordStoryItemData {
  targetLemma: string;
  sentence: string;
  translationPt: string;
  connectionNote: string;
  tokens: WordTokenData[];
}

export interface ThreeWordStoryData {
  id?: string;
  groupNumber: number;
  level: StudyLevel;
  storyTitlePt: string;
  storySummaryPt: string;
  items: ThreeWordStoryItemData[];
  createdAtMs?: number;
}

export interface SundayAiQuestionData {
  sentenceWithBlank: string;
  translationPt: string;
  options: string[];
  correctWord: string;
  groupNumber: number;
  explanationPt: string;
}

export interface SundayAiQuizData {
  id?: string;
  weekNumber: number;
  weekGroups: number[];
  questions: SundayAiQuestionData[];
  createdAtMs?: number;
}

export interface StudyPreferencesData {
  currentGroup: number;
  startDateIso: string;
  fullSentenceLevel: StudyLevel;
  threeWordLevel: StudyLevel;
}

export interface SundayScoreRecord {
  weekNumber: number;
  bestScorePct: number;
  lastScorePct: number;
  attemptsCount: number;
  lastMode: 'flash-quiz' | 'ai-contextual';
}

function clampStr(value: unknown, maxLen: number, fallback = ''): string {
  const s = typeof value === 'string' ? value.trim() : fallback;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;
  return Math.max(min, Math.min(max, n));
}

function sanitizeLevel(value: unknown): StudyLevel {
  if (value === 'simples' || value === 'intermediario' || value === 'avancado') {
    return value;
  }
  return 'simples';
}

function sanitizeDateIso(value: unknown): string {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  now.setDate(now.getDate() + diff);
  return now.toISOString().split('T')[0];
}

function sanitizeTokens(tokens: unknown): WordTokenData[] {
  if (!Array.isArray(tokens)) return [];
  return tokens.slice(0, 100).map((t: any) => ({
    word: clampStr(t?.word ?? t?.text, 100, ''),
    cleanWord: clampStr(t?.cleanWord, 100, ''),
    pt: clampStr(t?.pt, 250, ''),
    pos: clampStr(t?.pos, 80, ''),
    isTargetWord: Boolean(t?.isTargetWord ?? t?.isTarget),
    targetLemma: clampStr(t?.targetLemma ?? t?.lemma, 100, ''),
  }));
}

function toMillis(ts: unknown): number {
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts && typeof (ts as any).toMillis === 'function') return (ts as any).toMillis();
  return Date.now();
}

export async function ensureUserWorkspace(
  user: User,
  localSeed: {
    preferences: StudyPreferencesData;
    completedGroups: number[];
    sundayScores: Record<number, number>;
    fullSentences: Record<string, Omit<FullSentenceData, 'id' | 'groupNumber' | 'level'>>;
    threeWordStories: Record<string, Omit<ThreeWordStoryData, 'id' | 'groupNumber' | 'level'>>;
  }
): Promise<void> {
  const uid = user.uid;
  const userRootRef = doc(db, 'users', uid);

  // 1. Ensure root anchor document exists FIRST (Master Gate requirement)
  try {
    const rootSnap = await getDoc(userRootRef);
    if (!rootSnap.exists()) {
      await setDoc(userRootRef, {
        ownerId: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }

  // 2. Ensure isolated private profile (PII)
  const profilePath = `users/${uid}/private/profile`;
  const profileRef = doc(db, 'users', uid, 'private', 'profile');
  try {
    const profileSnap = await getDoc(profileRef);
    const email = clampStr(user.email, 320, 'user@example.com');
    const displayName = clampStr(user.displayName || user.email?.split('@')[0], 160, 'Estudante');
    if (!profileSnap.exists()) {
      await setDoc(profileRef, {
        ownerId: uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(profileRef, {
        email,
        displayName,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, profilePath);
  }

  // 3. Ensure preferences exist; if newly initialized, migrate local progress
  const prefPath = `users/${uid}/settings/preferences`;
  const prefRef = doc(db, 'users', uid, 'settings', 'preferences');
  let isFirstCloudSetup = false;
  try {
    const prefSnap = await getDoc(prefRef);
    if (!prefSnap.exists()) {
      isFirstCloudSetup = true;
      await setDoc(prefRef, {
        ownerId: uid,
        currentGroup: clampInt(localSeed.preferences.currentGroup, 1, 352, 1),
        startDateIso: sanitizeDateIso(localSeed.preferences.startDateIso),
        fullSentenceLevel: sanitizeLevel(localSeed.preferences.fullSentenceLevel),
        threeWordLevel: sanitizeLevel(localSeed.preferences.threeWordLevel),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, prefPath);
  }

  // Migrate localStorage progress if user had prior local state and hasn't synced yet
  if (isFirstCloudSetup) {
    // Migrate completed groups
    for (const gNum of localSeed.completedGroups) {
      if (gNum >= 1 && gNum <= 352) {
        const gRef = doc(db, 'users', uid, 'groupProgress', String(gNum));
        try {
          const existing = await getDoc(gRef);
          if (!existing.exists()) {
            await setDoc(gRef, {
              ownerId: uid,
              groupNumber: gNum,
              completed: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `users/${uid}/groupProgress/${gNum}`);
        }
      }
    }

    // Migrate Sunday scores
    for (const [weekStr, scorePct] of Object.entries(localSeed.sundayScores)) {
      const weekNum = Number(weekStr);
      if (weekNum >= 1 && weekNum <= 59) {
        const wRef = doc(db, 'users', uid, 'sundayScores', String(weekNum));
        try {
          const existing = await getDoc(wRef);
          if (!existing.exists()) {
            const pct = clampInt(scorePct, 0, 100, 0);
            await setDoc(wRef, {
              ownerId: uid,
              weekNumber: weekNum,
              bestScorePct: pct,
              lastScorePct: pct,
              attemptsCount: 1,
              lastMode: 'flash-quiz',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `users/${uid}/sundayScores/${weekNum}`);
        }
      }
    }

    // Migrate locally cached AI full sentences if Firestore collection is empty
    try {
      const existingFs = await getDocs(
        query(collection(db, 'users', uid, 'fullSentences'), where('ownerId', '==', uid))
      );
      if (existingFs.empty) {
        for (const [key, item] of Object.entries(localSeed.fullSentences)) {
          const [gStr, lvl] = key.split('_');
          const gNum = Number(gStr);
          if (gNum >= 1 && gNum <= 352 && item?.sentence) {
            await saveGeneratedFullSentence(uid, {
              groupNumber: gNum,
              level: sanitizeLevel(lvl),
              sentence: item.sentence,
              translationPt: item.translationPt,
              contextNote: item.contextNote || '',
              tokens: item.tokens || [],
            });
          }
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${uid}/fullSentences`);
    }

    // Migrate locally cached AI 3-word stories if Firestore collection is empty
    try {
      const existingStories = await getDocs(
        query(collection(db, 'users', uid, 'threeWordStories'), where('ownerId', '==', uid))
      );
      if (existingStories.empty) {
        for (const [key, story] of Object.entries(localSeed.threeWordStories)) {
          const [gStr, lvl] = key.split('_');
          const gNum = Number(gStr);
          if (gNum >= 1 && gNum <= 352 && Array.isArray(story?.items) && story.items.length > 0) {
            await saveGeneratedThreeWordStory(uid, {
              groupNumber: gNum,
              level: sanitizeLevel(lvl),
              storyTitlePt: story.storyTitlePt || `História Grupo ${gNum}`,
              storySummaryPt: story.storySummaryPt || '',
              items: story.items,
            });
          }
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${uid}/threeWordStories`);
    }
  }
}

export async function savePreferencesPatch(
  uid: string,
  patch: Partial<StudyPreferencesData>
): Promise<void> {
  const path = `users/${uid}/settings/preferences`;
  const ref = doc(db, 'users', uid, 'settings', 'preferences');
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (patch.currentGroup !== undefined) {
    payload.currentGroup = clampInt(patch.currentGroup, 1, 352, 1);
  }
  if (patch.startDateIso !== undefined) {
    payload.startDateIso = sanitizeDateIso(patch.startDateIso);
  }
  if (patch.fullSentenceLevel !== undefined) {
    payload.fullSentenceLevel = sanitizeLevel(patch.fullSentenceLevel);
  }
  if (patch.threeWordLevel !== undefined) {
    payload.threeWordLevel = sanitizeLevel(patch.threeWordLevel);
  }

  try {
    await updateDoc(ref, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function setGroupCompletionInFirestore(
  uid: string,
  groupNumber: number,
  completed: boolean
): Promise<void> {
  const safeGroup = clampInt(groupNumber, 1, 352, 1);
  const path = `users/${uid}/groupProgress/${safeGroup}`;
  const ref = doc(db, 'users', uid, 'groupProgress', String(safeGroup));

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ownerId: uid,
        groupNumber: safeGroup,
        completed: Boolean(completed),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        completed: Boolean(completed),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveGeneratedFullSentence(
  uid: string,
  data: Omit<FullSentenceData, 'id' | 'createdAtMs'>
): Promise<string> {
  const safeGroup = clampInt(data.groupNumber, 1, 352, 1);
  const safeLevel = sanitizeLevel(data.level);
  const docId = `fs_${safeGroup}_${safeLevel}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const path = `users/${uid}/fullSentences/${docId}`;
  const ref = doc(db, 'users', uid, 'fullSentences', docId);

  try {
    await setDoc(ref, {
      ownerId: uid,
      groupNumber: safeGroup,
      level: safeLevel,
      sentence: clampStr(data.sentence, 1500, 'Sentence'),
      translationPt: clampStr(data.translationPt, 1500, 'Tradução'),
      contextNote: clampStr(data.contextNote, 1000, ''),
      tokens: sanitizeTokens(data.tokens),
      createdAt: serverTimestamp(),
    });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteGeneratedFullSentence(uid: string, docId: string): Promise<void> {
  const path = `users/${uid}/fullSentences/${docId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'fullSentences', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveGeneratedThreeWordStory(
  uid: string,
  data: Omit<ThreeWordStoryData, 'id' | 'createdAtMs'>
): Promise<string> {
  const safeGroup = clampInt(data.groupNumber, 1, 352, 1);
  const safeLevel = sanitizeLevel(data.level);
  const docId = `tws_${safeGroup}_${safeLevel}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const path = `users/${uid}/threeWordStories/${docId}`;
  const ref = doc(db, 'users', uid, 'threeWordStories', docId);

  const rawItems = Array.isArray(data.items) ? data.items.slice(0, 12) : [];
  const safeItems = rawItems.map((it) => ({
    targetLemma: clampStr(it?.targetLemma, 80, ''),
    sentence: clampStr(it?.sentence, 200, 'Word in context.'),
    translationPt: clampStr(it?.translationPt, 400, ''),
    connectionNote: clampStr(it?.connectionNote, 300, ''),
    tokens: sanitizeTokens(it?.tokens),
  }));

  if (safeItems.length === 0) {
    safeItems.push({
      targetLemma: 'word',
      sentence: 'Words connect well.',
      translationPt: 'Palavras conectam bem.',
      connectionNote: '',
      tokens: [],
    });
  }

  try {
    await setDoc(ref, {
      ownerId: uid,
      groupNumber: safeGroup,
      level: safeLevel,
      storyTitlePt: clampStr(data.storyTitlePt, 250, `História do Grupo ${safeGroup}`),
      storySummaryPt: clampStr(data.storySummaryPt, 1000, ''),
      items: safeItems,
      createdAt: serverTimestamp(),
    });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteGeneratedThreeWordStory(uid: string, docId: string): Promise<void> {
  const path = `users/${uid}/threeWordStories/${docId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'threeWordStories', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveSundayReviewScoreInFirestore(
  uid: string,
  weekNumber: number,
  scorePct: number,
  mode: 'flash-quiz' | 'ai-contextual'
): Promise<void> {
  const safeWeek = clampInt(weekNumber, 1, 59, 1);
  const safePct = clampInt(scorePct, 0, 100, 0);
  const safeMode = mode === 'ai-contextual' ? 'ai-contextual' : 'flash-quiz';
  const path = `users/${uid}/sundayScores/${safeWeek}`;
  const ref = doc(db, 'users', uid, 'sundayScores', String(safeWeek));

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ownerId: uid,
        weekNumber: safeWeek,
        bestScorePct: safePct,
        lastScorePct: safePct,
        attemptsCount: 1,
        lastMode: safeMode,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const prev = snap.data();
      const prevBest = clampInt(prev.bestScorePct, 0, 100, 0);
      const prevAttempts = clampInt(prev.attemptsCount, 1, 9999, 1);
      await updateDoc(ref, {
        bestScorePct: Math.max(prevBest, safePct),
        lastScorePct: safePct,
        attemptsCount: Math.min(10000, prevAttempts + 1),
        lastMode: safeMode,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveSundayAiQuizInFirestore(
  uid: string,
  weekNumber: number,
  weekGroups: number[],
  questions: SundayAiQuestionData[]
): Promise<string> {
  const safeWeek = clampInt(weekNumber, 1, 59, 1);
  const docId = `sq_${safeWeek}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const path = `users/${uid}/sundayAiQuizzes/${docId}`;
  const ref = doc(db, 'users', uid, 'sundayAiQuizzes', docId);

  const safeGroups = (Array.isArray(weekGroups) ? weekGroups : [1])
    .slice(0, 6)
    .map((g) => clampInt(g, 1, 352, 1));
  if (safeGroups.length === 0) safeGroups.push(1);

  const safeQuestions = (Array.isArray(questions) ? questions : [])
    .slice(0, 15)
    .map((q) => ({
      sentenceWithBlank: clampStr(q?.sentenceWithBlank, 500, 'Complete the _____ sentence.'),
      translationPt: clampStr(q?.translationPt, 500, ''),
      options: (Array.isArray(q?.options) ? q.options : [])
        .slice(0, 4)
        .map((opt) => clampStr(opt, 80, '')),
      correctWord: clampStr(q?.correctWord, 80, ''),
      groupNumber: clampInt(q?.groupNumber, 1, 352, safeGroups[0]),
      explanationPt: clampStr(q?.explanationPt, 500, ''),
    }));

  if (safeQuestions.length === 0) {
    throw new Error('Nenhuma questão válida para salvar no Firebase.');
  }

  try {
    await setDoc(ref, {
      ownerId: uid,
      weekNumber: safeWeek,
      weekGroups: safeGroups,
      questions: safeQuestions,
      createdAt: serverTimestamp(),
    });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeUserStudyData(
  uid: string,
  callbacks: {
    onPreferences: (prefs: StudyPreferencesData) => void;
    onGroupProgress: (completedGroups: number[]) => void;
    onFullSentences: (items: FullSentenceData[]) => void;
    onThreeWordStories: (items: ThreeWordStoryData[]) => void;
    onSundayScores: (scores: Record<number, SundayScoreRecord>) => void;
    onSundayAiQuizzes: (quizzes: SundayAiQuizData[]) => void;
    onError: (err: Error) => void;
  }
): Unsubscribe {
  const prefPath = `users/${uid}/settings/preferences`;
  const unsubPrefs = onSnapshot(
    doc(db, 'users', uid, 'settings', 'preferences'),
    (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        callbacks.onPreferences({
          currentGroup: clampInt(d.currentGroup, 1, 352, 1),
          startDateIso: sanitizeDateIso(d.startDateIso),
          fullSentenceLevel: sanitizeLevel(d.fullSentenceLevel),
          threeWordLevel: sanitizeLevel(d.threeWordLevel),
        });
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, prefPath);
      } catch (e: any) {
        callbacks.onError(e);
      }
    }
  );

  const gpPath = `users/${uid}/groupProgress`;
  const unsubGroups = onSnapshot(
    query(collection(db, 'users', uid, 'groupProgress'), where('ownerId', '==', uid)),
    (snap) => {
      const done: number[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        if (d.completed === true && typeof d.groupNumber === 'number') {
          done.push(d.groupNumber);
        }
      });
      done.sort((a, b) => a - b);
      callbacks.onGroupProgress(done);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, gpPath);
      } catch (e: any) {
        callbacks.onError(e);
      }
    }
  );

  const fsPath = `users/${uid}/fullSentences`;
  const unsubFullSentences = onSnapshot(
    query(collection(db, 'users', uid, 'fullSentences'), where('ownerId', '==', uid)),
    (snap) => {
      const list: FullSentenceData[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          groupNumber: d.groupNumber,
          level: sanitizeLevel(d.level),
          sentence: d.sentence || '',
          translationPt: d.translationPt || '',
          contextNote: d.contextNote || '',
          tokens: Array.isArray(d.tokens) ? d.tokens : [],
          createdAtMs: toMillis(d.createdAt),
        });
      });
      list.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
      callbacks.onFullSentences(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, fsPath);
      } catch (e: any) {
        callbacks.onError(e);
      }
    }
  );

  const twsPath = `users/${uid}/threeWordStories`;
  const unsubThreeWord = onSnapshot(
    query(collection(db, 'users', uid, 'threeWordStories'), where('ownerId', '==', uid)),
    (snap) => {
      const list: ThreeWordStoryData[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          groupNumber: d.groupNumber,
          level: sanitizeLevel(d.level),
          storyTitlePt: d.storyTitlePt || '',
          storySummaryPt: d.storySummaryPt || '',
          items: Array.isArray(d.items) ? d.items : [],
          createdAtMs: toMillis(d.createdAt),
        });
      });
      list.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
      callbacks.onThreeWordStories(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, twsPath);
      } catch (e: any) {
        callbacks.onError(e);
      }
    }
  );

  const ssPath = `users/${uid}/sundayScores`;
  const unsubScores = onSnapshot(
    query(collection(db, 'users', uid, 'sundayScores'), where('ownerId', '==', uid)),
    (snap) => {
      const map: Record<number, SundayScoreRecord> = {};
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        if (typeof d.weekNumber === 'number') {
          map[d.weekNumber] = {
            weekNumber: d.weekNumber,
            bestScorePct: d.bestScorePct ?? 0,
            lastScorePct: d.lastScorePct ?? 0,
            attemptsCount: d.attemptsCount ?? 1,
            lastMode: d.lastMode === 'ai-contextual' ? 'ai-contextual' : 'flash-quiz',
          };
        }
      });
      callbacks.onSundayScores(map);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, ssPath);
      } catch (e: any) {
        callbacks.onError(e);
      }
    }
  );

  const sqPath = `users/${uid}/sundayAiQuizzes`;
  const unsubQuizzes = onSnapshot(
    query(collection(db, 'users', uid, 'sundayAiQuizzes'), where('ownerId', '==', uid)),
    (snap) => {
      const list: SundayAiQuizData[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          weekNumber: d.weekNumber,
          weekGroups: Array.isArray(d.weekGroups) ? d.weekGroups : [],
          questions: Array.isArray(d.questions) ? d.questions : [],
          createdAtMs: toMillis(d.createdAt),
        });
      });
      list.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
      callbacks.onSundayAiQuizzes(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, sqPath);
      } catch (e: any) {
        callbacks.onError(e);
      }
    }
  );

  return () => {
    unsubPrefs();
    unsubGroups();
    unsubFullSentences();
    unsubThreeWord();
    unsubScores();
    unsubQuizzes();
  };
}
