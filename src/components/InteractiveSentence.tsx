import React, { useState, useRef, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { lookupNgslWord, NgslWord } from '../data/ngslData';
import { speakEnglishText } from '../utils/speech';

export interface WordTokenData {
  word: string;
  cleanWord?: string;
  pt?: string;
  pos?: string;
  isTargetWord?: boolean;
  targetLemma?: string;
}

interface InteractiveSentenceProps {
  tokens?: WordTokenData[];
  fallbackSentence?: string;
  targetGroupWords?: NgslWord[];
  size?: 'md' | 'lg' | 'xl';
}

export const InteractiveSentence: React.FC<InteractiveSentenceProps> = ({
  tokens,
  fallbackSentence,
  targetGroupWords = [],
  size = 'lg',
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const targetLemmaSet = new Set(targetGroupWords.map((w) => w.lemma.toLowerCase()));

  // Build normalized token array
  const resolvedTokens: WordTokenData[] =
    tokens && tokens.length > 0
      ? tokens
      : (fallbackSentence || '')
          .split(/\s+/)
          .filter(Boolean)
          .map((raw) => {
            const clean = raw.replace(/[^a-zA-Z']/g, '');
            const ngsl = lookupNgslWord(clean);
            const isTarget =
              targetLemmaSet.has(clean.toLowerCase()) ||
              (ngsl ? targetLemmaSet.has(ngsl.lemma.toLowerCase()) : false);
            return {
              word: raw,
              cleanWord: clean,
              pt: ngsl?.pt || 'Clique para ouvir a pronúncia',
              pos: ngsl?.pos || 'Termo contextual',
              isTargetWord: isTarget,
              targetLemma: ngsl?.lemma || clean,
            };
          });

  const sizeClasses =
    size === 'xl'
      ? 'text-xl md:text-2xl leading-relaxed'
      : size === 'lg'
      ? 'text-lg md:text-xl leading-relaxed'
      : 'text-base leading-relaxed';

  return (
    <div ref={containerRef} className={`flex flex-wrap items-baseline gap-x-2 gap-y-2.5 ${sizeClasses}`}>
      {resolvedTokens.map((token, idx) => {
        const clean = (token.cleanWord || token.word).replace(/[^a-zA-Z']/g, '');
        const ngslMatch = lookupNgslWord(clean);
        const isTarget =
          Boolean(token.isTargetWord) ||
          targetLemmaSet.has(clean.toLowerCase()) ||
          (ngslMatch ? targetLemmaSet.has(ngslMatch.lemma.toLowerCase()) : false);

        const translationPt = token.pt || ngslMatch?.pt || 'Termo em inglês';
        const partOfSpeech = token.pos || ngslMatch?.pos || 'Vocabulário';
        const isOpen = activeIndex === idx;

        return (
          <span key={`${token.word}-${idx}`} className="relative inline-block">
            <button
              type="button"
              onClick={() => {
                setActiveIndex(isOpen ? null : idx);
                speakEnglishText(clean || token.word, 0.9);
              }}
              className={`group relative inline-flex items-baseline px-1.5 py-0.5 rounded transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                isOpen
                  ? 'bg-[#0284C7] text-white font-semibold'
                  : isTarget
                  ? 'bg-[#0284C7]/10 text-[#0284C7] font-semibold border-b-2 border-[#0284C7] hover:bg-[#0284C7]/20'
                  : 'text-[#0F172A] hover:bg-slate-200/70 border-b border-dashed border-slate-300'
              }`}
              title="Clique para ver a tradução em português e ouvir a pronúncia"
            >
              <span>{token.word}</span>
            </button>

            {isOpen && (
              <div
                role="tooltip"
                className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 p-3 bg-[#0F172A] text-white rounded-lg shadow-xl border border-slate-700 text-left animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-700/80">
                  <div className="flex items-baseline gap-1.5 truncate">
                    <span className="font-mono text-sm font-semibold text-sky-400">
                      {clean || token.word}
                    </span>
                    {ngslMatch && (
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                        #{ngslMatch.rank} · G{ngslMatch.group}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakEnglishText(clean || token.word, 0.85);
                    }}
                    className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors shrink-0"
                    title="Ouvir pronúncia"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-slate-400 mb-0.5">{partOfSpeech}</div>
                <div className="text-sm font-medium text-white leading-snug">{translationPt}</div>

                {ngslMatch && ngslMatch.pt !== translationPt && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[11px] text-slate-300">
                    <span className="text-slate-400">NGSL 1.2: </span>
                    {ngslMatch.pt}
                  </div>
                )}

                {/* Tooltip caret */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[#0F172A]" />
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
};
