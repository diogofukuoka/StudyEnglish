import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Volume2,
  Sparkles,
  Award,
  ArrowRight,
  HelpCircle,
  Loader2,
  AlertCircle,
  CloudCheck,
} from 'lucide-react';
import { NGSL_GROUPS, NgslWord, NGSL_WORDS } from '../data/ngslData';
import { speakEnglishText } from '../utils/speech';
import { InteractiveSentence } from './InteractiveSentence';
import { SundayAiQuizData } from '../services/studyFirestoreService';

interface SundayReviewModalProps {
  weekNumber: number;
  weekGroups: number[];
  completedScore?: number;
  savedAiQuizzes?: SundayAiQuizData[];
  isCloudConnected?: boolean;
  onSaveAiQuiz?: (
    weekNumber: number,
    weekGroups: number[],
    questions: AiContextualQuestion[]
  ) => Promise<void>;
  onSaveScore: (
    weekNumber: number,
    scorePercent: number,
    mode: 'flash-quiz' | 'ai-contextual'
  ) => void;
  onSelectGroupToStudy: (groupNumber: number) => void;
}

interface LocalQuizQuestion {
  id: string;
  type: 'pt-to-en' | 'en-to-pt' | 'audio-to-pt';
  word: NgslWord;
  promptText: string;
  options: string[];
  correctAnswer: string;
}

export interface AiContextualQuestion {
  sentenceWithBlank: string;
  translationPt: string;
  options: string[];
  correctWord: string;
  groupNumber: number;
  explanationPt: string;
}

export const SundayReviewPanel: React.FC<SundayReviewModalProps> = ({
  weekNumber,
  weekGroups,
  completedScore,
  savedAiQuizzes = [],
  isCloudConnected = false,
  onSaveAiQuiz,
  onSaveScore,
  onSelectGroupToStudy,
}) => {
  const [quizMode, setQuizMode] = useState<'flash-quiz' | 'ai-contextual'>('flash-quiz');
  const [quizSeed, setQuizSeed] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  // AI contextual review state
  const [selectedSavedQuizIdx, setSelectedSavedQuizIdx] = useState(0);
  const [localAiQuestions, setLocalAiQuestions] = useState<AiContextualQuestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const weekSavedQuizzes = useMemo(
    () => savedAiQuizzes.filter((q) => q.weekNumber === weekNumber),
    [savedAiQuizzes, weekNumber]
  );

  const aiQuestions = useMemo(() => {
    if (weekSavedQuizzes.length > 0 && weekSavedQuizzes[selectedSavedQuizIdx]) {
      return weekSavedQuizzes[selectedSavedQuizIdx].questions;
    }
    return localAiQuestions;
  }, [weekSavedQuizzes, selectedSavedQuizIdx, localAiQuestions]);

  // Reset active quiz progress when week changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers({});
    setIsFinished(false);
    setSelectedSavedQuizIdx(0);
    setLocalAiQuestions([]);
    setAiError(null);
  }, [weekNumber]);

  const weekWords: NgslWord[] = useMemo(() => {
    const list: NgslWord[] = [];
    for (const g of weekGroups) {
      if (NGSL_GROUPS[g]) {
        list.push(...NGSL_GROUPS[g]);
      }
    }
    return list;
  }, [weekGroups]);

  // Generate 12 deterministic-shuffled quick review questions covering Mon-Sat groups
  const localQuestions: LocalQuizQuestion[] = useMemo(() => {
    if (weekWords.length === 0) return [];
    const shuffled = [...weekWords].sort((a, b) => {
      const hashA = (a.rank * 31 + quizSeed * 17) % 97;
      const hashB = (b.rank * 31 + quizSeed * 17) % 97;
      return hashA - hashB;
    });

    const selected = shuffled.slice(0, Math.min(12, shuffled.length));
    return selected.map((word, idx) => {
      const qType: 'pt-to-en' | 'en-to-pt' | 'audio-to-pt' =
        idx % 3 === 0 ? 'en-to-pt' : idx % 3 === 1 ? 'pt-to-en' : 'audio-to-pt';

      const distractorsPool = NGSL_WORDS.filter(
        (w) => w.rank !== word.rank && w.pt !== word.pt
      );

      // Pick 3 distractors
      const d1 = distractorsPool[(word.rank + idx * 7 + quizSeed) % distractorsPool.length];
      const d2 = distractorsPool[(word.rank + idx * 13 + 29 + quizSeed) % distractorsPool.length];
      const d3 = distractorsPool[(word.rank + idx * 23 + 53 + quizSeed) % distractorsPool.length];

      if (qType === 'pt-to-en') {
        const opts = [word.lemma, d1.lemma, d2.lemma, d3.lemma].sort();
        return {
          id: `${word.rank}-${idx}`,
          type: qType,
          word,
          promptText: `Qual termo em inglês do Grupo ${word.group} corresponde a "${word.pt}" (${word.pos})?`,
          options: opts,
          correctAnswer: word.lemma,
        };
      } else if (qType === 'audio-to-pt') {
        const opts = [word.pt, d1.pt, d2.pt, d3.pt].sort();
        return {
          id: `${word.rank}-${idx}`,
          type: qType,
          word,
          promptText: `Ouça e observe o termo "${word.lemma}" (Grupo ${word.group}). Qual é a sua tradução correta?`,
          options: opts,
          correctAnswer: word.pt,
        };
      } else {
        const opts = [word.pt, d1.pt, d2.pt, d3.pt].sort();
        return {
          id: `${word.rank}-${idx}`,
          type: qType,
          word,
          promptText: `Qual é a tradução em português de "${word.lemma}" (${word.pos} · Grupo ${word.group})?`,
          options: opts,
          correctAnswer: word.pt,
        };
      }
    });
  }, [weekWords, quizSeed]);

  const generateAiContextualQuiz = async (forceNew = false) => {
    // If there's already a saved quiz for this week and the user simply clicked the tab button, open it immediately
    if (!forceNew && weekSavedQuizzes.length > 0 && quizMode !== 'ai-contextual') {
      setQuizMode('ai-contextual');
      setCurrentIdx(0);
      setSelectedOption(null);
      setAnswers({});
      setIsFinished(false);
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setQuizMode('ai-contextual');
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers({});
    setIsFinished(false);

    try {
      const response = await fetch('/api/gemini/sunday-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groups: weekGroups,
          words: weekWords.map((w) => ({
            group: w.group,
            lemma: w.lemma,
            pos: w.pos,
            pt: w.pt,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Falha ao gerar revisão contextual com Gemini.');
      }
      const generatedQuestions: AiContextualQuestion[] = data.questions || [];
      setLocalAiQuestions(generatedQuestions);
      setSelectedSavedQuizIdx(0);

      if (onSaveAiQuiz && generatedQuestions.length > 0) {
        await onSaveAiQuiz(weekNumber, weekGroups, generatedQuestions);
      }
    } catch (err: any) {
      setAiError(err?.message || 'Erro de conexão com a API Gemini.');
    } finally {
      setAiLoading(false);
    }
  };

  const resetLocalQuiz = () => {
    setQuizMode('flash-quiz');
    setQuizSeed((s) => s + 1);
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers({});
    setIsFinished(false);
  };

  const activeQuestionsCount =
    quizMode === 'flash-quiz' ? localQuestions.length : aiQuestions.length;

  const handleSelectAnswer = (option: string, correct: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    const isCorrect = option.toLowerCase().trim() === correct.toLowerCase().trim();
    setAnswers((prev) => ({ ...prev, [currentIdx]: isCorrect }));
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < activeQuestionsCount) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      const totalCorrect = Object.values(answers).filter(Boolean).length;
      const pct =
        activeQuestionsCount > 0
          ? Math.round((totalCorrect / activeQuestionsCount) * 100)
          : 100;
      onSaveScore(weekNumber, pct, quizMode);
    }
  };

  const correctCount = Object.values(answers).filter(Boolean).length;
  const currentScorePct =
    activeQuestionsCount > 0 ? Math.round((correctCount / activeQuestionsCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono text-[#0284C7] uppercase tracking-wider mb-1">
              Domingo de Revisão Semanal · Semana {weekNumber}
            </div>
            <h2 className="text-2xl font-display font-semibold text-[#0F172A]">
              Retenção de Segunda a Sábado (Grupos {weekGroups[0]} a {weekGroups[weekGroups.length - 1]})
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Revise todas as <span className="font-mono font-semibold">{weekWords.length}</span> palavras aprendidas nos 6 grupos desta semana através de testes rápidos de retenção ou lacunas contextuais geradas pela IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={resetLocalQuiz}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                quizMode === 'flash-quiz'
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Teste Rápido de Vocabulário (12 Questões)
            </button>
            <button
              type="button"
              onClick={() => generateAiContextualQuiz(false)}
              disabled={aiLoading}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                quizMode === 'ai-contextual'
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-sky-50 text-[#0284C7] border border-sky-200 hover:bg-sky-100'
              }`}
            >
              {aiLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>
                {weekSavedQuizzes.length > 0
                  ? `Desafio Contextual Gemini (${weekSavedQuizzes.length} salvo${weekSavedQuizzes.length > 1 ? 's' : ''})`
                  : 'Desafio Contextual Gemini (Lacunas)'}
              </span>
            </button>
          </div>
        </div>

        {/* Summary of the 6 groups from Monday to Saturday */}
        <div className="pt-5">
          <div className="text-xs font-medium text-slate-500 mb-3">
            Cronograma da Semana {weekNumber} (Clique em qualquer palavra para ouvir ou clique no grupo para abrir):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {weekGroups.map((gNum, dayIdx) => {
              const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
              const gWords = NGSL_GROUPS[gNum] || [];
              return (
                <div
                  key={gNum}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-medium text-slate-700">{dayNames[dayIdx]}</span>
                      <button
                        type="button"
                        onClick={() => onSelectGroupToStudy(gNum)}
                        className="font-mono text-[#0284C7] hover:underline cursor-pointer"
                      >
                        Grupo {gNum}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {gWords.map((w) => (
                        <button
                          key={w.rank}
                          type="button"
                          onClick={() => speakEnglishText(w.lemma, 0.9)}
                          title={`${w.lemma}: ${w.pt} (${w.pos})`}
                          className="text-xs font-mono px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-800 hover:border-[#0284C7] hover:text-[#0284C7] transition-colors cursor-pointer"
                        >
                          {w.lemma}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiz Arena */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {quizMode === 'ai-contextual' && aiLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-[#0284C7] animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-800">
              Gerando frases inéditas de revisão dominical com as palavras de segunda a sábado...
            </p>
            <p className="text-xs text-slate-500 mt-1">
              A API Gemini está preparando questões de lacunas para os Grupos {weekGroups.join(', ')}.
            </p>
          </div>
        )}

        {quizMode === 'ai-contextual' && aiError && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{aiError}</span>
            </div>
            <button
              type="button"
              onClick={() => generateAiContextualQuiz(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-red-300 rounded-md hover:bg-red-100 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {isFinished ? (
          <div className="py-8 text-center max-w-lg mx-auto space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-700">
                Revisão de Domingo Concluída
              </div>
              <h3 className="text-2xl font-display font-semibold text-slate-900 mt-1">
                Pontuação: <span className="font-mono tabular-nums">{currentScorePct}%</span> ({correctCount} de {activeQuestionsCount} acertos)
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Excelente retenção! O seu progresso dominical da Semana {weekNumber} foi registrado no calendário inteligente.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={resetLocalQuiz}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Novo Teste Rápido</span>
              </button>
              <button
                type="button"
                onClick={() => generateAiContextualQuiz(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gerar Novo Desafio Gemini</span>
              </button>
            </div>
          </div>
        ) : quizMode === 'flash-quiz' && localQuestions[currentIdx] ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                <span className="font-semibold text-slate-700">
                  Questão <span className="font-mono tabular-nums">{currentIdx + 1}</span> de{' '}
                  <span className="font-mono tabular-nums">{localQuestions.length}</span>
                </span>
                <span>·</span>
                <span>Grupo {localQuestions[currentIdx].word.group}</span>
              </div>
              {completedScore !== undefined && (
                <div className="text-emerald-700 font-mono">
                  Melhor nota da semana: {completedScore}%
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {localQuestions[currentIdx].promptText}
                </h3>
                <button
                  type="button"
                  onClick={() => speakEnglishText(localQuestions[currentIdx].word.lemma, 0.88)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0284C7] bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Ouvir Termo</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {localQuestions[currentIdx].options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === localQuestions[currentIdx].correctAnswer;
                const showResult = selectedOption !== null;

                let btnStyle =
                  'bg-white border-slate-200 text-slate-800 hover:border-[#0284C7] hover:bg-sky-50/40';
                if (showResult) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-red-50 border-red-400 text-red-900';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={showResult}
                    onClick={() =>
                      handleSelectAnswer(opt, localQuestions[currentIdx].correctAnswer)
                    }
                    className={`p-3.5 text-left text-sm border rounded-lg transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-slate-700">
                  <span className="font-mono font-semibold text-slate-900">
                    {localQuestions[currentIdx].word.lemma}
                  </span>{' '}
                  ({localQuestions[currentIdx].word.pos} · Rank #{localQuestions[currentIdx].word.rank}):{' '}
                  <span className="font-medium text-[#0284C7]">
                    {localQuestions[currentIdx].word.pt}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    {currentIdx + 1 < localQuestions.length
                      ? 'Próxima Questão'
                      : 'Concluir Revisão de Domingo'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : quizMode === 'ai-contextual' && !aiLoading && aiQuestions[currentIdx] ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                <span className="font-semibold text-slate-700">
                  Desafio Contextual Gemini · Questão{' '}
                  <span className="font-mono tabular-nums">{currentIdx + 1}</span> de{' '}
                  <span className="font-mono tabular-nums">{aiQuestions.length}</span>
                </span>
                {isCloudConnected && weekSavedQuizzes.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <CloudCheck className="w-3.5 h-3.5" />
                    Salvo no Firebase
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {weekSavedQuizzes.length > 1 && (
                  <select
                    aria-label="Selecionar desafio salvo"
                    value={selectedSavedQuizIdx}
                    onChange={(e) => {
                      setSelectedSavedQuizIdx(Number(e.target.value));
                      setCurrentIdx(0);
                      setSelectedOption(null);
                      setAnswers({});
                      setIsFinished(false);
                    }}
                    className="px-2 py-1 text-[11px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-700"
                  >
                    {weekSavedQuizzes.map((sq, idx) => (
                      <option key={sq.id || idx} value={idx}>
                        Desafio #{weekSavedQuizzes.length - idx}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  onClick={() => generateAiContextualQuiz(true)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#0284C7] bg-sky-50 border border-sky-200 rounded hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  + Novo Desafio IA
                </button>
                <span className="font-mono">Grupo {aiQuestions[currentIdx].groupNumber}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs text-slate-500">
                Complete a frase em inglês (clique em qualquer palavra para ver a tradução):
              </div>
              <InteractiveSentence
                fallbackSentence={aiQuestions[currentIdx].sentenceWithBlank}
                targetGroupWords={weekWords}
                size="lg"
              />
              <div className="text-xs text-slate-600 pt-1 border-t border-slate-200/70">
                Tradução: {aiQuestions[currentIdx].translationPt}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiQuestions[currentIdx].options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect =
                  opt.toLowerCase().trim() ===
                  aiQuestions[currentIdx].correctWord.toLowerCase().trim();
                const showResult = selectedOption !== null;

                let btnStyle =
                  'bg-white border-slate-200 text-slate-800 hover:border-[#0284C7] hover:bg-sky-50/40';
                if (showResult) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-red-50 border-red-400 text-red-900';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={showResult}
                    onClick={() => {
                      speakEnglishText(opt, 0.9);
                      handleSelectAnswer(opt, aiQuestions[currentIdx].correctWord);
                    }}
                    className={`p-3.5 text-left text-sm font-mono border rounded-lg transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-slate-700">
                  {aiQuestions[currentIdx].explanationPt}
                </div>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    {currentIdx + 1 < aiQuestions.length
                      ? 'Próxima Questão'
                      : 'Concluir Revisão de Domingo'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
