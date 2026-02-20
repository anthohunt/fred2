'use client';

interface SearchExamplesProps {
  onSelect: (value: string) => void;
}

const examples = [
  { label: 'Frederick Benaben', value: 'Frederick Benaben' },
  { label: '0000-0003-1894-5128', value: '0000-0003-1894-5128' },
  { label: 'Scopus: 56273849100', value: 'Scopus: 56273849100' },
  { label: 'scholar.google.com/...', value: 'scholar.google.com/citations?user=abc123XYZ' },
];

const tips = [
  { label: 'Nom complet', color: 'bg-accent-blue' },
  { label: 'ORCID', color: 'bg-accent-violet' },
  { label: 'Scopus ID', color: 'bg-accent-yellow' },
  { label: 'Google Scholar URL', color: 'bg-accent-green' },
];

export default function SearchExamples({ onSelect }: SearchExamplesProps) {
  return (
    <>
      <p className="text-text-muted text-sm mt-7 mb-3">Essayez un exemple :</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {examples.map((ex) => (
          <button
            key={ex.value}
            onClick={() => onSelect(ex.value)}
            className="bg-bg-input border border-border-default text-text-secondary px-4 py-2 rounded-lg text-sm cursor-pointer transition-all hover:bg-[#273548] hover:border-accent-blue hover:text-text-primary hover:-translate-y-px"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="mt-12 flex gap-6 justify-center flex-wrap">
        {tips.map((tip) => (
          <div key={tip.label} className="flex items-center gap-2 text-xs text-text-dim">
            <span className={`w-[7px] h-[7px] rounded-full ${tip.color}`} />
            {tip.label}
          </div>
        ))}
      </div>
    </>
  );
}
