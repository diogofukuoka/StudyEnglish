/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Link2,
  Layers,
  Play,
  CloudCheck,
  CloudOff,
  LogIn,
  LogOut,
  Trash2,
} from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  NGSL_GROUPS,
  TOTAL_GROUPS,
  TOTAL_WORDS,
  NgslWord,
} from './data/ngslData';
import { speakEnglishText } from './utils/speech';
import { postGeminiApi } from './utils/api';
import { InteractiveSentence, WordTokenData } from './components/InteractiveSentence';
import { SmartCalendarPanel } from './components/SmartCalendarPanel';
import { SundayReviewPanel, AiContextualQuestion } from './components/SundayReviewPanel';
import { NgslExplorerPanel } from './components/NgslExplorerPanel';
import { auth, googleProvider } from './firebase';
import {
  ensureUserWorkspace,
  savePreferencesPatch,
  setGroupCompletionInFirestore,
  saveGeneratedFullSentence,
  deleteGeneratedFullSentence,
  saveGeneratedThreeWordStory,
  deleteGeneratedThreeWordStory,
  saveSundayReviewScoreInFirestore,
  saveSundayAiQuizInFirestore,
  subscribeUserStudyData,
  FullSentenceData,
  ThreeWordStoryData,
  SundayAiQuizData,
  StudyLevel,
} from './services/studyFirestoreService';

type ActiveView = 'estudo' | 'calendario' | 'revisao' | 'explorador';

interface FullSentenceResponse {
  sentence: string;
  translationPt: string;
  contextNote: string;
  tokens: WordTokenData[];
}

interface ThreeWordStoryItem {
  targetLemma: string;
  sentence: string;
  translationPt: string;
  connectionNote: string;
  tokens: WordTokenData[];
}

interface ThreeWordStoryResponse {
  storyTitlePt: string;
  storySummaryPt: string;
  items: ThreeWordStoryItem[];
}

const STORAGE_KEY_COMPLETED = 'ngsl_completed_groups_v1';
const STORAGE_KEY_START_DATE = 'ngsl_start_date_v1';
const STORAGE_KEY_SUNDAY_SCORES = 'ngsl_sunday_scores_v1';
const STORAGE_KEY_CURRENT_GROUP = 'ngsl_current_group_v1';
const STORAGE_KEY_AI_CACHE = 'ngsl_ai_cache_v1';

function safeGetStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or restricted storage errors
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('estudo');

  // Firebase Auth & Sync State
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  // Cloud-synced collections
  const [cloudFullSentences, setCloudFullSentences] = useState<FullSentenceData[]>([]);
  const [cloudThreeWordStories, setCloudThreeWordStories] = useState<ThreeWordStoryData[]>([]);
  const [cloudSundayQuizzes, setCloudSundayQuizzes] = useState<SundayAiQuizData[]>([]);

  // Selected saved version indices inside Studio 1 & Studio 2
  const [selectedFullVersionIdx, setSelectedFullVersionIdx] = useState(0);
  const [selectedThreeWordVersionIdx, setSelectedThreeWordVersionIdx] = useState(0);

  // Persisted user study state (initialized from localStorage, seamlessly synced to Firestore when signed in)
  const [currentGroup, setCurrentGroup] = useState<number>(() => {
    const saved = safeGetStorage(STORAGE_KEY_CURRENT_GROUP);
    const parsed = saved ? parseInt(saved, 10) : 1;
    return parsed >= 1 && parsed <= TOTAL_GROUPS ? parsed : 1;
  });

  const [completedGroups, setCompletedGroups] = useState<number[]>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEY_COMPLETED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [startDateIso, setStartDateIso] = useState<string>(() => {
    const saved = safeGetStorage(STORAGE_KEY_START_DATE);
    if (saved) return saved;
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    now.setDate(now.getDate() + diff);
    return now.toISOString().split('T')[0];
  });

  const [sundayScores, setSundayScores] = useState<Record<number, number>>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEY_SUNDAY_SCORES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Level selector for Full Sentence & 3-Word Connected Story
  const [fullSentenceLevel, setFullSentenceLevel] = useState<StudyLevel>('simples');
  const [threeWordLevel, setThreeWordLevel] = useState<StudyLevel>('simples');

  // Local fallback cache when unauthenticated
  const [aiCache, setAiCache] = useState<{
    fullSentences: Record<string, FullSentenceResponse>;
    threeWordStories: Record<string, ThreeWordStoryResponse>;
  }>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEY_AI_CACHE);
      return saved ? JSON.parse(saved) : { fullSentences: {}, threeWordStories: {} };
    } catch {
      return { fullSentences: {}, threeWordStories: {} };
    }
  });

  const [loadingFull, setLoadingFull] = useState(false);
  const [errorFull, setErrorFull] = useState<string | null>(null);

  const [loadingThreeWord, setLoadingThreeWord] = useState(false);
  const [errorThreeWord, setErrorThreeWord] = useState<string | null>(null);

  // Selected word for tooltip balloon inside the left vocabulary deck
  const [activeDeckWordRank, setActiveDeckWordRank] = useState<number | null>(null);

  // Sunday review week state
  const [reviewWeekNumber, setReviewWeekNumber] = useState<number>(() =>
    Math.ceil(currentGroup / 6)
  );

  // Keep a ref of current local seed for first-time migration when signing in
  const localSeedRef = useRef({
    currentGroup,
    startDateIso,
    fullSentenceLevel,
    threeWordLevel,
    completedGroups,
    sundayScores,
    aiCache,
  });
  localSeedRef.current = {
    currentGroup,
    startDateIso,
    fullSentenceLevel,
    threeWordLevel,
    completedGroups,
    sundayScores,
    aiCache,
  };

  // Auth listener + Firestore workspace bootstrap & real-time subscriptions
  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }

      if (!firebaseUser || firebaseUser.isAnonymous || !firebaseUser.emailVerified) {
        if (firebaseUser && firebaseUser.isAnonymous) {
          void signOut(auth).catch(() => {});
        }
        setUser(null);
        setAuthReady(true);
        setCloudError(null);
        setCloudReady(false);
        setCloudFullSentences([]);
        setCloudThreeWordStories([]);
        setCloudSundayQuizzes([]);
        return;
      }

      setUser(firebaseUser);
      setAuthReady(true);
      setCloudError(null);

      try {
        const seed = localSeedRef.current;
        await ensureUserWorkspace(firebaseUser, {
          preferences: {
            currentGroup: seed.currentGroup,
            startDateIso: seed.startDateIso,
            fullSentenceLevel: seed.fullSentenceLevel,
            threeWordLevel: seed.threeWordLevel,
          },
          completedGroups: seed.completedGroups,
          sundayScores: seed.sundayScores,
          fullSentences: seed.aiCache.fullSentences,
          threeWordStories: seed.aiCache.threeWordStories,
        });

        unsubFirestore = subscribeUserStudyData(firebaseUser.uid, {
          onPreferences: (prefs) => {
            setCurrentGroup(prefs.currentGroup);
            setStartDateIso(prefs.startDateIso);
            setFullSentenceLevel(prefs.fullSentenceLevel);
            setThreeWordLevel(prefs.threeWordLevel);
          },
          onGroupProgress: (doneGroups) => {
            setCompletedGroups(doneGroups);
          },
          onFullSentences: (items) => {
            setCloudFullSentences(items);
          },
          onThreeWordStories: (items) => {
            setCloudThreeWordStories(items);
          },
          onSundayScores: (records) => {
            const bestMap: Record<number, number> = {};
            for (const [w, rec] of Object.entries(records)) {
              bestMap[Number(w)] = rec.bestScorePct;
            }
            setSundayScores(bestMap);
          },
          onSundayAiQuizzes: (quizzes) => {
            setCloudSundayQuizzes(quizzes);
          },
          onError: (err) => {
            setCloudError(err.message);
          },
        });

        setCloudReady(true);
      } catch (err: any) {
        setCloudError(err?.message || 'Falha ao sincronizar com o Firebase.');
        setCloudReady(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  const handleSignInGoogle = async () => {
    setAuthLoading(true);
    setCloudError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain') {
        setCloudError(
          `Domínio "${window.location.hostname}" não autorizado no Firebase Authentication. Adicione este domínio em Firebase Console → Authentication → Settings → Authorized domains.`
        );
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setCloudError(err?.message || 'Não foi possível concluir o login com Google.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      setCloudError(err?.message || 'Erro ao sair da conta.');
    }
  };

  // Sync to localStorage as local mirror
  useEffect(() => {
    safeSetStorage(STORAGE_KEY_CURRENT_GROUP, String(currentGroup));
  }, [currentGroup]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEY_COMPLETED, JSON.stringify(completedGroups));
  }, [completedGroups]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEY_START_DATE, startDateIso);
  }, [startDateIso]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEY_SUNDAY_SCORES, JSON.stringify(sundayScores));
  }, [sundayScores]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEY_AI_CACHE, JSON.stringify(aiCache));
  }, [aiCache]);

  const currentGroupWords: NgslWord[] = useMemo(
    () => NGSL_GROUPS[currentGroup] || [],
    [currentGroup]
  );

  const isCurrentGroupCompleted = completedGroups.includes(currentGroup);

  const toggleGroupComplete = (groupNum: number) => {
    const willBeCompleted = !completedGroups.includes(groupNum);
    setCompletedGroups((prev) =>
      willBeCompleted ? [...prev, groupNum] : prev.filter((g) => g !== groupNum)
    );

    if (user && cloudReady) {
      void setGroupCompletionInFirestore(user.uid, groupNum, willBeCompleted).catch((err) => {
        setCloudError(err?.message || 'Erro ao salvar marcação no Firebase.');
      });
    }
  };

  const handleChangeStartDate = (newIso: string) => {
    setStartDateIso(newIso);
    if (user && cloudReady) {
      void savePreferencesPatch(user.uid, { startDateIso: newIso }).catch((err) => {
        setCloudError(err?.message || 'Erro ao salvar data no Firebase.');
      });
    }
  };

  const handleChangeFullSentenceLevel = (lvl: StudyLevel) => {
    setFullSentenceLevel(lvl);
    setSelectedFullVersionIdx(0);
    if (user && cloudReady) {
      void savePreferencesPatch(user.uid, { fullSentenceLevel: lvl }).catch((err) => {
        setCloudError(err?.message || 'Erro ao salvar nível no Firebase.');
      });
    }
  };

  const handleChangeThreeWordLevel = (lvl: StudyLevel) => {
    setThreeWordLevel(lvl);
    setSelectedThreeWordVersionIdx(0);
    if (user && cloudReady) {
      void savePreferencesPatch(user.uid, { threeWordLevel: lvl }).catch((err) => {
        setCloudError(err?.message || 'Erro ao salvar nível no Firebase.');
      });
    }
  };

  const handleSaveSundayScore = (
    weekNum: number,
    scorePct: number,
    mode: 'flash-quiz' | 'ai-contextual' = 'flash-quiz'
  ) => {
    setSundayScores((prev) => ({
      ...prev,
      [weekNum]: Math.max(prev[weekNum] || 0, scorePct),
    }));

    if (user && cloudReady) {
      void saveSundayReviewScoreInFirestore(user.uid, weekNum, scorePct, mode).catch((err) => {
        setCloudError(err?.message || 'Erro ao salvar nota da revisão no Firebase.');
      });
    }
  };

  const handleSaveSundayAiQuiz = async (
    weekNum: number,
    weekGroups: number[],
    questions: AiContextualQuestion[]
  ) => {
    if (user && cloudReady) {
      await saveSundayAiQuizInFirestore(user.uid, weekNum, weekGroups, questions);
    }
  };

  const handleSelectGroupToStudy = (groupNum: number) => {
    setCurrentGroup(groupNum);
    setActiveDeckWordRank(null);
    setSelectedFullVersionIdx(0);
    setSelectedThreeWordVersionIdx(0);
    setErrorFull(null);
    setErrorThreeWord(null);
    setActiveView('estudo');

    if (user && cloudReady) {
      void savePreferencesPatch(user.uid, { currentGroup: groupNum }).catch((err) => {
        setCloudError(err?.message || 'Erro ao salvar grupo atual no Firebase.');
      });
    }
  };

  // Generate Full Group Sentence via Gemini API + persist in Firebase
  const handleGenerateFullSentence = async (levelOverride?: StudyLevel) => {
    const targetLevel = levelOverride || fullSentenceLevel;
    setLoadingFull(true);
    setErrorFull(null);

    try {
      const data = await postGeminiApi<FullSentenceResponse>(
        '/api/gemini/full-sentence',
        {
          groupNumber: currentGroup,
          level: targetLevel,
          words: currentGroupWords.map((w) => ({
            lemma: w.lemma,
            pos: w.pos,
            pt: w.pt,
          })),
        }
      );

      const cacheKey = `${currentGroup}_${targetLevel}`;
      setAiCache((prev) => ({
        ...prev,
        fullSentences: {
          ...prev.fullSentences,
          [cacheKey]: data,
        },
      }));
      setSelectedFullVersionIdx(0);

      if (user && cloudReady) {
        await saveGeneratedFullSentence(user.uid, {
          groupNumber: currentGroup,
          level: targetLevel,
          sentence: data.sentence,
          translationPt: data.translationPt,
          contextNote: data.contextNote || '',
          tokens: data.tokens || [],
        });
      }
    } catch (err: any) {
      setErrorFull(err?.message || 'Falha ao comunicar com o servidor Gemini.');
    } finally {
      setLoadingFull(false);
    }
  };

  // Generate Connected 3-Word Sentences via Gemini API + persist in Firebase
  const handleGenerateThreeWordStory = async (levelOverride?: StudyLevel) => {
    const targetLevel = levelOverride || threeWordLevel;
    setLoadingThreeWord(true);
    setErrorThreeWord(null);

    try {
      const data = await postGeminiApi<ThreeWordStoryResponse>(
        '/api/gemini/three-word-story',
        {
          groupNumber: currentGroup,
          level: targetLevel,
          words: currentGroupWords.map((w) => ({
            lemma: w.lemma,
            pos: w.pos,
            pt: w.pt,
          })),
        }
      );

      const cacheKey = `${currentGroup}_${targetLevel}`;
      setAiCache((prev) => ({
        ...prev,
        threeWordStories: {
          ...prev.threeWordStories,
          [cacheKey]: data,
        },
      }));
      setSelectedThreeWordVersionIdx(0);

      if (user && cloudReady) {
        await saveGeneratedThreeWordStory(user.uid, {
          groupNumber: currentGroup,
          level: targetLevel,
          storyTitlePt: data.storyTitlePt || `História Grupo ${currentGroup}`,
          storySummaryPt: data.storySummaryPt || '',
          items: data.items || [],
        });
      }
    } catch (err: any) {
      setErrorThreeWord(err?.message || 'Falha ao comunicar com o servidor Gemini.');
    } finally {
      setLoadingThreeWord(false);
    }
  };

  // Cloud-saved versions for the active group & level, falling back to local cache when signed out
  const savedFullVersions = useMemo(
    () =>
      cloudFullSentences.filter(
        (item) => item.groupNumber === currentGroup && item.level === fullSentenceLevel
      ),
    [cloudFullSentences, currentGroup, fullSentenceLevel]
  );

  const savedThreeWordVersions = useMemo(
    () =>
      cloudThreeWordStories.filter(
        (item) => item.groupNumber === currentGroup && item.level === threeWordLevel
      ),
    [cloudThreeWordStories, currentGroup, threeWordLevel]
  );

  const currentFullSentenceData: (FullSentenceResponse & { id?: string }) | undefined = useMemo(() => {
    if (user && cloudReady && savedFullVersions.length > 0) {
      const safeIdx = Math.min(selectedFullVersionIdx, savedFullVersions.length - 1);
      return savedFullVersions[safeIdx];
    }
    return aiCache.fullSentences[`${currentGroup}_${fullSentenceLevel}`];
  }, [user, cloudReady, savedFullVersions, selectedFullVersionIdx, aiCache.fullSentences, currentGroup, fullSentenceLevel]);

  const currentThreeWordData: (ThreeWordStoryResponse & { id?: string }) | undefined = useMemo(() => {
    if (user && cloudReady && savedThreeWordVersions.length > 0) {
      const safeIdx = Math.min(selectedThreeWordVersionIdx, savedThreeWordVersions.length - 1);
      return savedThreeWordVersions[safeIdx];
    }
    return aiCache.threeWordStories[`${currentGroup}_${threeWordLevel}`];
  }, [user, cloudReady, savedThreeWordVersions, selectedThreeWordVersionIdx, aiCache.threeWordStories, currentGroup, threeWordLevel]);

  // Current week info (6 groups per week Monday-Saturday)
  const currentWeekOfGroup = Math.ceil(currentGroup / 6);
  const dayOfWeekIndex = (currentGroup - 1) % 6;
  const weekdayNames = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const reviewWeekStartGroup = (reviewWeekNumber - 1) * 6 + 1;
  const reviewWeekGroups = Array.from({ length: 6 }, (_, i) => reviewWeekStartGroup + i).filter(
    (g) => g <= TOTAL_GROUPS
  );

  // Speak all 3-word sentences sequentially
  const handlePlayEntireThreeWordStory = () => {
    if (!currentThreeWordData?.items?.length) return;
    const joined = currentThreeWordData.items.map((it) => it.sentence).join('. ');
    speakEnglishText(joined, 0.88);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#estudo"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('estudo');
            }}
            className="text-lg font-display font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0"
          >
            NGSL 1.2 English Mastery
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto">
            <a
              href="#estudo"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('estudo');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === 'estudo'
                  ? 'text-[#0F172A] border-[#0284C7] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Estudo Diário
            </a>
            <a
              href="#calendario"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('calendario');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === 'calendario'
                  ? 'text-[#0F172A] border-[#0284C7] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Calendário Inteligente
            </a>
            <a
              href="#revisao"
              onClick={(e) => {
                e.preventDefault();
                setReviewWeekNumber(Math.ceil(currentGroup / 6));
                setActiveView('revisao');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === 'revisao'
                  ? 'text-[#0F172A] border-[#0284C7] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Revisão de Domingo
            </a>
            <a
              href="#explorador"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('explorador');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === 'explorador'
                  ? 'text-[#0F172A] border-[#0284C7] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Lista NGSL 1.2
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                const nextPending =
                  Array.from({ length: TOTAL_GROUPS }, (_, i) => i + 1).find(
                    (g) => !completedGroups.includes(g)
                  ) || 1;
                handleSelectGroupToStudy(nextPending);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Treinar Meta do Dia
            </button>
          </div>
        </div>
      </header>

      {/* Sub-header telemetry, Firebase sync status & quick group bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">
              Semana <span className="font-mono tabular-nums">{currentWeekOfGroup}</span> ·{' '}
              {weekdayNames[dayOfWeekIndex]}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Grupo Atual: <strong className="font-mono text-[#0284C7] tabular-nums">{currentGroup}</strong> de{' '}
              <span className="font-mono tabular-nums">{TOTAL_GROUPS}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Domínio Acumulado:{' '}
              <strong className="font-mono text-emerald-700 tabular-nums">
                {completedGroups.length} grupos
              </strong>{' '}
              (
              <span className="font-mono tabular-nums">
                {completedGroups.reduce((acc, g) => acc + (NGSL_GROUPS[g]?.length || 0), 0)}
              </span>{' '}
              / <span className="font-mono tabular-nums">{TOTAL_WORDS}</span> palavras)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {authReady && user ? (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">
                <CloudCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium truncate max-w-[200px]" title={user.email || undefined}>
                  Firebase: {user.email || user.displayName}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="ml-1 inline-flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                  title="Desconectar conta Google"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sair</span>
                </button>
              </div>
            ) : authReady ? (
              <button
                type="button"
                onClick={handleSignInGoogle}
                disabled={authLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
              >
                {authLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogIn className="w-3.5 h-3.5 text-amber-700" />
                )}
                <span>Conectar Google para Salvar no Firebase</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setReviewWeekNumber(currentWeekOfGroup);
                setActiveView('revisao');
              }}
              className="text-[#0284C7] hover:underline font-medium cursor-pointer whitespace-nowrap"
            >
              Revisão de Domingo (Sem. {currentWeekOfGroup}) →
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Prompt / Error Banner when not signed in or on error */}
      {authReady && !user && (
        <div className="bg-sky-50/90 border-b border-sky-200 px-6 py-2.5">
          <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-sky-950">
            <div className="flex items-center gap-2">
              <CloudOff className="w-4 h-4 text-[#0284C7] shrink-0" />
              <span>
                Seus estudos estão salvos apenas neste navegador. Entre com sua conta Google para manter todas as frases geradas, marcações de conclusão, calendário e revisões salvos permanentemente no <strong>Firebase</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={handleSignInGoogle}
              disabled={authLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0284C7] text-white font-semibold rounded-md hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar com Google</span>
            </button>
          </div>
        </div>
      )}

      {cloudError && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5">
          <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{cloudError}</span>
            </div>
            <button
              type="button"
              onClick={() => setCloudError(null)}
              className="font-semibold underline cursor-pointer shrink-0"
            >
              Dispensar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 py-8">
        {activeView === 'estudo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT ZONE (5 Cols): Daily Vocabulary Group Deck & Interactive Pronunciation/Translation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                {/* Group Switcher Header */}
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectGroupToStudy(Math.max(1, currentGroup - 1))
                      }
                      disabled={currentGroup <= 1}
                      className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      title="Grupo anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                        Semana {currentWeekOfGroup} · {weekdayNames[dayOfWeekIndex]}
                      </div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-display font-bold text-[#0F172A]">
                          Grupo {currentGroup}
                        </h1>
                        <select
                          aria-label="Selecionar Grupo NGSL"
                          value={currentGroup}
                          onChange={(e) =>
                            handleSelectGroupToStudy(Number(e.target.value))
                          }
                          className="text-xs font-mono bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:border-[#0284C7]"
                        >
                          {Array.from({ length: TOTAL_GROUPS }, (_, i) => i + 1).map(
                            (g) => (
                              <option key={g} value={g}>
                                Ir para G{g}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectGroupToStudy(
                          Math.min(TOTAL_GROUPS, currentGroup + 1)
                        )
                      }
                      disabled={currentGroup >= TOTAL_GROUPS}
                      className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      title="Próximo grupo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleGroupComplete(currentGroup)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isCurrentGroupCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isCurrentGroupCompleted ? 'Grupo Concluído' : 'Marcar Concluído'}
                    </span>
                  </button>
                </div>

                {/* Instruction Banner */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Clique sobre qualquer palavra para abrir o <strong>balão de tradução</strong> e ouvir a pronúncia:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const allLemmas = currentGroupWords.map((w) => w.lemma).join(', ');
                      speakEnglishText(allLemmas, 0.85);
                    }}
                    className="inline-flex items-center gap-1 text-[#0284C7] font-semibold hover:underline shrink-0 ml-2 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir Todas</span>
                  </button>
                </div>

                {/* Words List with Interactive Translation Balloon & Audio */}
                <div className="space-y-2.5">
                  {currentGroupWords.map((word) => {
                    const isBalloonOpen = activeDeckWordRank === word.rank;
                    return (
                      <div key={word.rank} className="relative">
                        <div
                          onClick={() => {
                            setActiveDeckWordRank(isBalloonOpen ? null : word.rank);
                            speakEnglishText(word.lemma, 0.88);
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isBalloonOpen
                              ? 'bg-sky-50/70 border-[#0284C7] ring-2 ring-[#0284C7]/15'
                              : 'bg-slate-50/70 border-slate-200/90 hover:border-[#0284C7] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-baseline gap-3 min-w-0">
                            <span className="text-xs font-mono text-slate-400 tabular-nums w-8 shrink-0">
                              #{word.rank}
                            </span>
                            <span className="text-lg font-mono font-bold text-[#0F172A] tracking-tight">
                              {word.lemma}
                            </span>
                            <span className="text-xs text-slate-500 truncate">
                              {word.pos}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-slate-500 hidden sm:inline">
                              {isBalloonOpen ? 'Ocultar tradução' : 'Ver tradução'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakEnglishText(word.lemma, 0.88);
                              }}
                              className="p-2 rounded-lg bg-white border border-slate-200 text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-colors cursor-pointer"
                              title={`Ouvir pronúncia de "${word.lemma}"`}
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Portuguese Translation Balloon */}
                        {isBalloonOpen && (
                          <div className="mt-1.5 p-3.5 rounded-xl bg-[#0F172A] text-white shadow-lg border border-slate-700 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between text-xs text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800">
                              <span>
                                Tradução NGSL 1.2 · <strong className="text-sky-400">{word.pos}</strong>
                              </span>
                              <span className="font-mono tabular-nums">
                                SFI {word.sfi} · {word.freq.toLocaleString('pt-BR')}/M
                              </span>
                            </div>
                            <div className="text-base font-semibold text-white">
                              {word.pt}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Weekly Progress Strip inside Deck */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Progresso da Semana {currentWeekOfGroup} (Seg–Sáb):</span>
                    <button
                      type="button"
                      onClick={() => {
                        setReviewWeekNumber(currentWeekOfGroup);
                        setActiveView('revisao');
                      }}
                      className="text-amber-700 font-semibold hover:underline cursor-pointer"
                    >
                      Domingo: Revisão Semanal
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {Array.from({ length: 6 }, (_, i) => (currentWeekOfGroup - 1) * 6 + 1 + i)
                      .filter((g) => g <= TOTAL_GROUPS)
                      .map((g, idx) => {
                        const shortDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                        const isDone = completedGroups.includes(g);
                        const isActive = g === currentGroup;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleSelectGroupToStudy(g)}
                            className={`py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                              isActive
                                ? 'border-[#0284C7] bg-sky-50 text-[#0284C7] font-semibold'
                                : isDone
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-[10px]">{shortDays[idx]}</div>
                            <div className="text-xs font-mono tabular-nums">G{g}</div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT ZONE (7 Cols): Gemini AI Contextual Sentence Studios */}
            <div className="lg:col-span-7 space-y-8">
              {/* STUDIO 1: Single Cohesive Sentence Incorporating ALL Words of the Group */}
              <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-[#0284C7] mb-1">
                      Laboratório Gemini 01 · Síntese Completa do Grupo {currentGroup}
                    </div>
                    <h2 className="text-xl font-display font-semibold text-[#0F172A]">
                      Frase Englobando Todas as {currentGroupWords.length} Palavras do Grupo
                    </h2>
                  </div>

                  {/* Level Selector: Simples | Intermediário | Avançado */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto shrink-0">
                    {(
                      [
                        { id: 'simples', label: 'Simples' },
                        { id: 'intermediario', label: 'Intermediário' },
                        { id: 'avancado', label: 'Avançado' },
                      ] as const
                    ).map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => handleChangeFullSentenceLevel(lvl.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          fullSentenceLevel === lvl.id
                            ? 'bg-white text-[#0F172A] shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    Solicite à API Gemini uma frase única no nível{' '}
                    <strong className="text-slate-900 capitalize">{fullSentenceLevel}</strong>{' '}
                    que conecte:{' '}
                    <span className="font-mono text-slate-800">
                      {currentGroupWords.map((w) => w.lemma).join(', ')}
                    </span>
                    .
                  </p>

                  <button
                    type="button"
                    onClick={() => handleGenerateFullSentence()}
                    disabled={loadingFull}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {loadingFull ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {currentFullSentenceData
                        ? 'Gerar Nova Frase do Grupo'
                        : 'Gerar Frase com Todas as Palavras'}
                    </span>
                  </button>
                </div>

                {errorFull && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorFull}</span>
                  </div>
                )}

                {loadingFull && (
                  <div className="py-10 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-slate-200/80">
                    <Loader2 className="w-7 h-7 text-[#0284C7] animate-spin mb-2.5" />
                    <p className="text-sm font-medium text-slate-800">
                      Criando frase no nível {fullSentenceLevel} com todas as palavras do Grupo {currentGroup}...
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Cada palavra será mapeada com tradução contextual e pronúncia.
                    </p>
                  </div>
                )}

                {!loadingFull && currentFullSentenceData && (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">
                          Clique em qualquer palavra para traduzir e ouvir:
                        </span>
                        {user && cloudReady && currentFullSentenceData.id && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <CloudCheck className="w-3 h-3" />
                            Salvo no Firebase
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {savedFullVersions.length > 1 && (
                          <select
                            aria-label="Histórico de frases geradas"
                            value={Math.min(selectedFullVersionIdx, savedFullVersions.length - 1)}
                            onChange={(e) => setSelectedFullVersionIdx(Number(e.target.value))}
                            className="px-2 py-1 text-[11px] font-mono bg-white border border-slate-200 rounded-md text-slate-700"
                          >
                            {savedFullVersions.map((v, idx) => (
                              <option key={v.id || idx} value={idx}>
                                Versão #{savedFullVersions.length - idx}
                              </option>
                            ))}
                          </select>
                        )}
                        {user && cloudReady && currentFullSentenceData.id && (
                          <button
                            type="button"
                            onClick={() => {
                              if (currentFullSentenceData.id) {
                                void deleteGeneratedFullSentence(user.uid, currentFullSentenceData.id);
                                setSelectedFullVersionIdx(0);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Remover esta frase salva"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            speakEnglishText(currentFullSentenceData.sentence, 0.9)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0284C7] bg-white border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors shrink-0 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Ouvir Frase Completa</span>
                        </button>
                      </div>
                    </div>

                    <InteractiveSentence
                      tokens={currentFullSentenceData.tokens}
                      fallbackSentence={currentFullSentenceData.sentence}
                      targetGroupWords={currentGroupWords}
                      size="xl"
                    />

                    <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                      <div className="text-xs font-medium text-slate-500">
                        Tradução Completa:
                      </div>
                      <p className="text-sm font-medium text-slate-800">
                        {currentFullSentenceData.translationPt}
                      </p>
                      {currentFullSentenceData.contextNote && (
                        <p className="text-xs text-slate-500 pt-1">
                          Nota contextual: {currentFullSentenceData.contextNote}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {!loadingFull && !currentFullSentenceData && !errorFull && (
                  <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                    <Layers className="w-7 h-7 text-slate-400 mx-auto" />
                    <div className="max-w-md mx-auto">
                      <h3 className="text-sm font-semibold text-slate-800">
                        Pronto para gerar a frase englobando o Grupo {currentGroup}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Escolha entre o nível Simples, Intermediário ou Avançado e clique em{' '}
                        <strong>"Gerar Frase com Todas as Palavras"</strong> para criar uma sentença interativa com tradução ao clicar em cada termo.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* STUDIO 2: Connected 3-Word Sentences for Each Word of the Group */}
              <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-[#0284C7] mb-1">
                      Laboratório Gemini 02 · Micro-Narrativa Conectada (3 Palavras por Frase)
                    </div>
                    <h2 className="text-xl font-display font-semibold text-[#0F172A]">
                      Frases de 3 Palavras Conectadas por Contexto
                    </h2>
                  </div>

                  {/* Level Selector: Simples | Intermediário | Avançado */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto shrink-0">
                    {(
                      [
                        { id: 'simples', label: 'Simples' },
                        { id: 'intermediario', label: 'Intermediário' },
                        { id: 'avancado', label: 'Avançado' },
                      ] as const
                    ).map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => handleChangeThreeWordLevel(lvl.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          threeWordLevel === lvl.id
                            ? 'bg-white text-[#0F172A] shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    Cria uma frase de <strong>exatamente 3 palavras</strong> para cada termo do Grupo {currentGroup}, onde todas as frases se conectam formando uma história contínua no nível{' '}
                    <strong className="text-slate-900 capitalize">{threeWordLevel}</strong>.
                  </p>

                  <div className="flex items-center gap-2 shrink-0">
                    {currentThreeWordData && (
                      <button
                        type="button"
                        onClick={handlePlayEntireThreeWordStory}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                        title="Ouvir todas as frases de 3 palavras em sequência"
                      >
                        <Play className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Ouvir Sequência</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleGenerateThreeWordStory()}
                      disabled={loadingThreeWord}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {loadingThreeWord ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      )}
                      <span>
                        {currentThreeWordData
                          ? 'Recriar Frases de 3 Palavras'
                          : 'Gerar Frases de 3 Palavras Conectadas'}
                      </span>
                    </button>
                  </div>
                </div>

                {errorThreeWord && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorThreeWord}</span>
                  </div>
                )}

                {loadingThreeWord && (
                  <div className="py-10 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-slate-200/80">
                    <Loader2 className="w-7 h-7 text-[#0284C7] animate-spin mb-2.5" />
                    <p className="text-sm font-medium text-slate-800">
                      Construindo {currentGroupWords.length} frases conectadas de 3 palavras (Nível {threeWordLevel})...
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Cada frase terá 3 palavras (incluindo a palavra do grupo) e ligação contextual com a próxima.
                    </p>
                  </div>
                )}

                {!loadingThreeWord && currentThreeWordData && (
                  <div className="space-y-4">
                    {/* Story Context Header */}
                    <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-[#0284C7] font-semibold">
                            Fio Condutor: {currentThreeWordData.storyTitlePt}
                          </span>
                          {user && cloudReady && currentThreeWordData.id && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <CloudCheck className="w-3 h-3" />
                              Salvo no Firebase
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {currentThreeWordData.storySummaryPt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {savedThreeWordVersions.length > 1 && (
                          <select
                            aria-label="Histórico de histórias de 3 palavras"
                            value={Math.min(selectedThreeWordVersionIdx, savedThreeWordVersions.length - 1)}
                            onChange={(e) => setSelectedThreeWordVersionIdx(Number(e.target.value))}
                            className="px-2 py-1 text-[11px] font-mono bg-white border border-sky-200 rounded-md text-slate-700"
                          >
                            {savedThreeWordVersions.map((v, idx) => (
                              <option key={v.id || idx} value={idx}>
                                Versão #{savedThreeWordVersions.length - idx}
                              </option>
                            ))}
                          </select>
                        )}
                        {user && cloudReady && currentThreeWordData.id && (
                          <button
                            type="button"
                            onClick={() => {
                              if (currentThreeWordData.id) {
                                void deleteGeneratedThreeWordStory(user.uid, currentThreeWordData.id);
                                setSelectedThreeWordVersionIdx(0);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-sky-200 rounded-lg transition-colors cursor-pointer"
                            title="Remover esta história salva"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-[11px] text-slate-500">
                          Clique nas palavras para tradução
                        </span>
                      </div>
                    </div>

                    {/* Connected Timeline of 3-Word Sentences */}
                    <div className="space-y-3">
                      {currentThreeWordData.items.map((item, idx) => (
                        <div
                          key={`${item.targetLemma}-${idx}`}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="font-mono font-semibold text-slate-700 tabular-nums">
                                0{idx + 1}.
                              </span>
                              <span>Palavra-alvo do grupo:</span>
                              <span className="font-mono font-bold text-[#0284C7]">
                                {item.targetLemma}
                              </span>
                              {item.connectionNote && (
                                <>
                                  <span>·</span>
                                  <span className="text-slate-500 truncate">
                                    {item.connectionNote}
                                  </span>
                                </>
                              )}
                            </div>

                            <InteractiveSentence
                              tokens={item.tokens}
                              fallbackSentence={item.sentence}
                              targetGroupWords={currentGroupWords}
                              size="lg"
                            />

                            <div className="text-xs text-slate-600">
                              Tradução: <span className="font-medium text-slate-800">{item.translationPt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <button
                              type="button"
                              onClick={() => speakEnglishText(item.sentence, 0.88)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-[#0284C7] hover:text-[#0284C7] transition-colors cursor-pointer"
                              title="Ouvir esta frase de 3 palavras"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Ouvir</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loadingThreeWord && !currentThreeWordData && !errorThreeWord && (
                  <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                    <Link2 className="w-7 h-7 text-slate-400 mx-auto" />
                    <div className="max-w-md mx-auto">
                      <h3 className="text-sm font-semibold text-slate-800">
                        Gere as frases de 3 palavras conectadas para o Grupo {currentGroup}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Para cada uma das {currentGroupWords.length} palavras do grupo, a IA criará uma frase de exatamente 3 palavras interligada à frase seguinte para construir contexto memorável.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {activeView === 'calendario' && (
          <SmartCalendarPanel
            startDateIso={startDateIso}
            onChangeStartDate={handleChangeStartDate}
            completedGroups={completedGroups}
            onToggleGroupComplete={toggleGroupComplete}
            sundayScores={sundayScores}
            currentGroup={currentGroup}
            onSelectGroupToStudy={handleSelectGroupToStudy}
            onOpenSundayReview={(weekNum) => {
              setReviewWeekNumber(weekNum);
              setActiveView('revisao');
            }}
          />
        )}

        {activeView === 'revisao' && (
          <div className="space-y-6">
            {/* Week Picker for Sunday Review */}
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">
                  Escolher Semana para Revisão de Domingo:
                </span>
                <select
                  value={reviewWeekNumber}
                  onChange={(e) => setReviewWeekNumber(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0284C7]"
                >
                  {Array.from({ length: Math.ceil(TOTAL_GROUPS / 6) }, (_, i) => i + 1).map(
                    (wNum) => {
                      const gStart = (wNum - 1) * 6 + 1;
                      const gEnd = Math.min(TOTAL_GROUPS, gStart + 5);
                      return (
                        <option key={wNum} value={wNum}>
                          Semana {wNum} (Segunda a Sábado: Grupos {gStart} a {gEnd})
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('calendario')}
                className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
              >
                ← Voltar ao Calendário Semanal
              </button>
            </div>

            <SundayReviewPanel
              weekNumber={reviewWeekNumber}
              weekGroups={reviewWeekGroups}
              completedScore={sundayScores[reviewWeekNumber]}
              savedAiQuizzes={cloudSundayQuizzes}
              isCloudConnected={Boolean(user && cloudReady)}
              onSaveAiQuiz={handleSaveSundayAiQuiz}
              onSaveScore={handleSaveSundayScore}
              onSelectGroupToStudy={handleSelectGroupToStudy}
            />
          </div>
        )}

        {activeView === 'explorador' && (
          <NgslExplorerPanel
            completedGroups={completedGroups}
            currentGroup={currentGroup}
            onSelectGroupToStudy={handleSelectGroupToStudy}
            onToggleGroupComplete={toggleGroupComplete}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 mt-12">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            NGSL 1.2 English Mastery · Lista New General Service List Completa (2.809 palavras · 352 grupos)
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`${import.meta.env.BASE_URL}assets/aistudio/NGSL_1.2_50f502bc.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Documento PDF Original
            </a>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveView('calendario')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Planejamento Semanal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
