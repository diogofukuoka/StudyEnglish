import React, { useState, useMemo } from 'react';
import { Search, Volume2, Play, CheckCircle2, FileText } from 'lucide-react';
import { NGSL_WORDS, NGSL_GROUPS, TOTAL_GROUPS } from '../data/ngslData';
import { speakEnglishText } from '../utils/speech';

interface NgslExplorerPanelProps {
  completedGroups: number[];
  currentGroup: number;
  onSelectGroupToStudy: (groupNum: number) => void;
  onToggleGroupComplete: (groupNum: number) => void;
}

export const NgslExplorerPanel: React.FC<NgslExplorerPanelProps> = ({
  completedGroups,
  currentGroup,
  onSelectGroupToStudy,
  onToggleGroupComplete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<number | 'all'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 40;

  const completedSet = useMemo(() => new Set(completedGroups), [completedGroups]);

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return NGSL_WORDS.filter((w) => {
      if (selectedGroupFilter !== 'all' && w.group !== selectedGroupFilter) {
        return false;
      }
      if (!q) return true;
      return (
        w.lemma.toLowerCase().includes(q) ||
        w.pt.toLowerCase().includes(q) ||
        w.pos.toLowerCase().includes(q) ||
        String(w.group) === q ||
        String(w.rank) === q
      );
    });
  }, [searchQuery, selectedGroupFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredWords.length / pageSize));
  const paginatedWords = filteredWords.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono text-[#0284C7] uppercase tracking-wider mb-1">
              Base Oficial Completa · NGSL 1.2 (2.809 Termos · 352 Grupos)
            </div>
            <h2 className="text-2xl font-display font-semibold text-[#0F172A]">
              Explorador de Vocabulário NGSL 1.2
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pesquise qualquer palavra, tradução ou grupo, ouça a pronúncia imediatamente ou abra o PDF original anexado.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/assets/aistudio/NGSL_1.2_50f502bc.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Ver PDF NGSL 1.2 Original</span>
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="pt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por palavra em inglês, tradução, classe ou rank..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0284C7] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="group-filter-select" className="text-xs font-medium text-slate-600">
              Filtrar por Grupo:
            </label>
            <select
              id="group-filter-select"
              value={selectedGroupFilter}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedGroupFilter(val === 'all' ? 'all' : Number(val));
                setPage(1);
              }}
              className="px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="all">Todos os 352 Grupos (2.809 palavras)</option>
              {Array.from({ length: TOTAL_GROUPS }, (_, i) => i + 1).map((g) => {
                const gWords = NGSL_GROUPS[g] || [];
                return (
                  <option key={g} value={g}>
                    Grupo {g} ({gWords.map((w) => w.lemma).join(', ')})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4">Grupo</th>
                <th className="py-3 px-4">Rank SFI</th>
                <th className="py-3 px-4">Termo (Lemma)</th>
                <th className="py-3 px-4">Classe Gramatical</th>
                <th className="py-3 px-4">Tradução (Português do Brasil)</th>
                <th className="py-3 px-4 text-right">SFI / Freq (U)</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedWords.map((w) => {
                const isGroupDone = completedSet.has(w.group);
                const isCurrent = w.group === currentGroup;
                return (
                  <tr
                    key={w.rank}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isCurrent ? 'bg-sky-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono text-xs whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectGroupToStudy(w.group)}
                        className="font-semibold text-[#0284C7] hover:underline cursor-pointer"
                      >
                        Grupo {w.group}
                      </button>
                      {isGroupDone && (
                        <span className="ml-1.5 text-emerald-600" title="Grupo concluído">
                          ✓
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-500 tabular-nums">
                      #{w.rank}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900 text-base">
                          {w.lemma}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakEnglishText(w.lemma, 0.9)}
                          className="p-1 text-slate-400 hover:text-[#0284C7] rounded hover:bg-sky-50 transition-colors cursor-pointer"
                          title={`Ouvir pronúncia de "${w.lemma}"`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-slate-600">{w.pos}</td>
                    <td className="py-2.5 px-4 text-slate-800 font-medium">{w.pt}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                      {w.sfi} · {w.freq.toLocaleString('pt-BR')}/M
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectGroupToStudy(w.group)}
                          className="px-2.5 py-1 text-xs font-medium text-[#0284C7] bg-sky-50 hover:bg-sky-100 rounded transition-colors cursor-pointer"
                        >
                          Treinar G{w.group}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleGroupComplete(w.group)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isGroupDone
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-300 hover:text-slate-600'
                          }`}
                          title={
                            isGroupDone
                              ? 'Desmarcar conclusão do grupo'
                              : 'Marcar grupo como concluído'
                          }
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600">
          <div>
            Exibindo{' '}
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {filteredWords.length === 0 ? 0 : (page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filteredWords.length)}
            </span>{' '}
            de{' '}
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {filteredWords.length}
            </span>{' '}
            palavras
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              Anterior
            </button>
            <span className="font-mono tabular-nums px-2">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
