'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { OpenAlexAuthor, searchAuthorsByName, searchAuthorByOrcid } from '@/lib/openalex';
import { detectInputFormat, InputFormat } from '@/lib/detect-format';

export interface SearchBarHandle {
  setQuery: (q: string) => void;
}

const SearchBar = forwardRef<SearchBarHandle>(function SearchBar(_, ref) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OpenAlexAuthor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [detectedFormat, setDetectedFormat] = useState<InputFormat>('unknown');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useImperativeHandle(ref, () => ({
    setQuery: (q: string) => setQuery(q),
  }));

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setIsOpen(false);
      setDetectedFormat('unknown');
      return;
    }

    const format = detectInputFormat(trimmed);
    setDetectedFormat(format);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      let authors: OpenAlexAuthor[] = [];

      if (format === 'orcid') {
        const author = await searchAuthorByOrcid(trimmed);
        if (author) authors = [author];
      } else {
        const res = await searchAuthorsByName(trimmed);
        if (res) authors = res;
      }

      setResults(authors);
      setIsOpen(authors.length > 0);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectAuthor(results[activeIndex]);
    }
  }

  function selectAuthor(author: OpenAlexAuthor) {
    setQuery(author.display_name);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  const formatBadge = {
    name: { label: 'Nom detecte', cls: 'bg-[rgba(96,165,250,0.2)] text-accent-blue border-[rgba(96,165,250,0.3)]' },
    orcid: { label: 'ORCID detecte', cls: 'bg-[rgba(167,139,250,0.2)] text-accent-violet border-[rgba(167,139,250,0.3)]' },
    scopus: { label: 'Scopus ID detecte', cls: 'bg-[rgba(245,158,11,0.2)] text-accent-yellow border-[rgba(245,158,11,0.3)]' },
    scholar: { label: 'Google Scholar detecte', cls: 'bg-[rgba(52,211,153,0.2)] text-accent-green border-[rgba(52,211,153,0.3)]' },
    unknown: null,
  };

  const badge = formatBadge[detectedFormat];

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[680px]">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un chercheur..."
          autoComplete="off"
          spellCheck={false}
          className="w-full py-4 pl-12 pr-32 text-lg bg-bg-input border-2 border-border-default rounded-[14px] text-text-primary outline-none transition-all focus:border-accent-blue focus:shadow-[0_0_0_3px_rgba(96,165,250,0.15)] placeholder:text-text-muted"
        />
        {badge && (
          <span
            data-testid="format-badge"
            className={`absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-semibold border ${badge.cls}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-bg-input border border-border-default rounded-xl overflow-hidden z-10 shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
          {results.map((author, idx) => (
            <div
              key={author.id}
              onClick={() => selectAuthor(author)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#293548] last:border-b-0 transition-colors ${
                idx === activeIndex ? 'bg-[#273548]' : 'hover:bg-[#273548]'
              }`}
              role="option"
              aria-selected={idx === activeIndex}
            >
              <div className="w-[42px] h-[42px] rounded-full bg-[#1e3a5f] text-accent-blue flex items-center justify-center font-bold text-sm shrink-0">
                {getInitials(author.display_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[0.95rem]">{author.display_name}</div>
                <div className="text-sm text-text-muted truncate">
                  {author.last_known_institutions?.[0]?.display_name ?? 'Unknown institution'}
                  {author.topics?.[0] && ` · ${author.topics[0].display_name}`}
                </div>
              </div>
              <span className="bg-[rgba(245,158,11,0.15)] text-accent-yellow text-xs font-bold px-2 py-1 rounded-lg shrink-0">
                h:{author.summary_stats?.h_index ?? '?'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default SearchBar;
