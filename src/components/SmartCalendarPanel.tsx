import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  Play,
} from 'lucide-react';
import { NGSL_GROUPS, TOTAL_GROUPS } from '../data/ngslData';

interface SmartCalendarPanelProps {
  startDateIso: string;
  onChangeStartDate: (newIso: string) => void;
  completedGroups: number[];
  onToggleGroupComplete: (groupNum: number) => void;
  sundayScores: Record<number, number>;
  currentGroup: number;
  onSelectGroupToStudy: (groupNum: number) => void;
  onOpenSundayReview: (weekNumber: number, weekGroups: number[]) => void;
}

const TOTAL_WEEKS = Math.ceil(TOTAL_GROUPS / 6); // 59 weeks for 352 groups (6 groups Mon-Sat per week)

function getMondayOfDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  const day = dt.getDay(); // 0 is Sun, 1 is Mon
  const diff = day === 0 ? -6 : 1 - day;
  dt.setDate(dt.getDate() + diff);
  return dt;
}

function formatShortDatePt(baseMonday: Date, offsetDays: number): string {
  const dt = new Date(baseMonday);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export const SmartCalendarPanel: React.FC<SmartCalendarPanelProps> = ({
  startDateIso,
  onChangeStartDate,
  completedGroups,
  onToggleGroupComplete,
  sundayScores,
  currentGroup,
  onSelectGroupToStudy,
  onOpenSundayReview,
}) => {
  const activeWeekForCurrentGroup = Math.ceil(currentGroup / 6);
  const [selectedWeek, setSelectedWeek] = useState<number>(activeWeekForCurrentGroup || 1);

  const completedSet = useMemo(() => new Set(completedGroups), [completedGroups]);
  const baseMonday = useMemo(() => getMondayOfDate(startDateIso), [startDateIso]);

  const weekStartGroup = (selectedWeek - 1) * 6 + 1;
  const weekGroups = Array.from({ length: 6 }, (_, i) => weekStartGroup + i).filter(
    (g) => g <= TOTAL_GROUPS
  );

  const dayLabels = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const completedInWeek = weekGroups.filter((g) => completedSet.has(g)).length;
  const weekSundayScore = sundayScores[selectedWeek];

  return (
    <div className="space-y-8">
      {/* Top Summary & Plan Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono text-[#0284C7] uppercase tracking-wider mb-1">
              Planejamento Inteligente · 1 Grupo por Dia (Seg–Sáb) + Domingo de Revisão
            </div>
            <h2 className="text-2xl font-display font-semibold text-[#0F172A]">
              Calendário de Estudos NGSL 1.2
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Ao ritmo de 1 grupo por dia de segunda a sábado e revisão acumulativa aos domingos, você domina os 352 grupos (2.809 palavras) em 59 semanas estruturadas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex flex-col">
              <label
                htmlFor="study-start-date"
                className="text-xs font-medium text-slate-500 mb-1"
              >
                Início do Cronograma (Segunda-feira):
              </label>
              <input
                id="study-start-date"
                type="date"
                value={startDateIso}
                onChange={(e) => {
                  if (e.target.value) onChangeStartDate(e.target.value);
                }}
                className="px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div className="h-10 w-px bg-slate-200 hidden sm:block" />

            <div className="text-right">
              <div className="text-xs text-slate-500">Progresso Total</div>
              <div className="text-lg font-mono font-semibold text-slate-900 tabular-nums">
                {completedGroups.length} / {TOTAL_GROUPS} grupos ({Math.round((completedGroups.length / TOTAL_GROUPS) * 100)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Week Selector Controls */}
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
              disabled={selectedWeek <= 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              title="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-4 py-1.5 rounded-lg bg-slate-100 font-mono text-sm font-semibold text-slate-900 tabular-nums">
              Semana {selectedWeek} de {TOTAL_WEEKS} · Grupos {weekGroups[0]}–{weekGroups[weekGroups.length - 1]}
            </div>

            <button
              type="button"
              onClick={() => setSelectedWeek((w) => Math.min(TOTAL_WEEKS, w + 1))}
              disabled={selectedWeek >= TOTAL_WEEKS}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              title="Próxima semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>
              Concluídos na semana:{' '}
              <strong className="font-mono text-slate-900 tabular-nums">
                {completedInWeek}/{weekGroups.length}
              </strong>
            </span>
            <span>·</span>
            <span>
              Revisão de Domingo:{' '}
              <strong className="font-mono text-emerald-700 tabular-nums">
                {weekSundayScore !== undefined ? `${weekSundayScore}%` : 'Pendente'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Schedule Grid (Monday - Saturday + Sunday Review) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {weekGroups.map((groupNum, dayIdx) => {
          const words = NGSL_GROUPS[groupNum] || [];
          const isDone = completedSet.has(groupNum);
          const isCurrent = groupNum === currentGroup;
          const dateLabel = formatShortDatePt(baseMonday, (selectedWeek - 1) * 7 + dayIdx);

          return (
            <div
              key={groupNum}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-white border-[#0284C7] ring-2 ring-[#0284C7]/15'
                  : isDone
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 mb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">{dayLabels[dayIdx]}</span>
                  <span className="font-mono tabular-nums">{dateLabel}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-slate-500">Meta Diária</div>
                    <div className="text-base font-display font-semibold text-slate-900">
                      Grupo <span className="font-mono tabular-nums">{groupNum}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleGroupComplete(groupNum)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                    }`}
                    title={isDone ? 'Marcar como pendente' : 'Marcar grupo como concluído'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 mb-4">
                  {words.map((w) => (
                    <div
                      key={w.rank}
                      className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-none"
                    >
                      <span className="font-mono font-medium text-slate-800">{w.lemma}</span>
                      <span className="text-slate-500 truncate max-w-[95px]" title={w.pt}>
                        {w.pt.split(';')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectGroupToStudy(groupNum)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0284C7] text-white hover:bg-sky-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Treinar Grupo {groupNum}</span>
              </button>
            </div>
          );
        })}

        {/* 7th Card: Sunday Mandatory Review */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-900 pb-2 mb-2 border-b border-amber-200/70">
              <span className="font-semibold">Domingo</span>
              <span className="font-mono tabular-nums">
                {formatShortDatePt(baseMonday, (selectedWeek - 1) * 7 + 6)}
              </span>
            </div>

            <div className="mb-3">
              <div className="text-xs text-amber-800 font-medium">Retenção Semanal</div>
              <div className="text-base font-display font-semibold text-slate-900">
                Revisão Seg–Sáb
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              Revise todas as{' '}
              <strong className="font-mono">
                {weekGroups.reduce((acc, g) => acc + (NGSL_GROUPS[g]?.length || 0), 0)}
              </strong>{' '}
              palavras estudadas nos Grupos {weekGroups[0]} a {weekGroups[weekGroups.length - 1]} com testes rápidos de fixação.
            </p>

            <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/80 text-xs space-y-1 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Grupos concluídos:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {completedInWeek} / {weekGroups.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Nota do Teste:</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {weekSundayScore !== undefined ? `${weekSundayScore}%` : 'Não realizado'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenSundayReview(selectedWeek, weekGroups)}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#0F172A] text-white hover:bg-slate-800 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Iniciar Revisão de Domingo</span>
          </button>
        </div>
      </div>

      {/* All 59 Weeks Panorama Navigator */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Mapa Geral das 59 Semanas (352 Grupos NGSL 1.2)
            </h3>
            <p className="text-xs text-slate-500">
              Clique em qualquer semana para visualizar os 6 grupos de segunda a sábado e a revisão de domingo correspondente.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" /> Semana Completa
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-sky-600 inline-block" /> Em Progresso
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-300 inline-block" /> Pendente
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2">
          {Array.from({ length: TOTAL_WEEKS }, (_, idx) => {
            const wNum = idx + 1;
            const gStart = (wNum - 1) * 6 + 1;
            const gList = Array.from({ length: 6 }, (__, i) => gStart + i).filter(
              (g) => g <= TOTAL_GROUPS
            );
            const doneCount = gList.filter((g) => completedSet.has(g)).length;
            const allDone = doneCount === gList.length;
            const hasSome = doneCount > 0;
            const isSelected = wNum === selectedWeek;

            return (
              <button
                key={wNum}
                type="button"
                onClick={() => setSelectedWeek(wNum)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20 bg-sky-50'
                    : allDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : hasSome
                    ? 'bg-sky-50 border-sky-300 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-mono font-semibold tabular-nums">
                  Sem {wNum}
                </div>
                <div
                  className={`text-[10px] font-mono tabular-nums ${
                    allDone && !isSelected ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  G{gList[0]}–{gList[gList.length - 1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
