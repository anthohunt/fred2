'use client';

import { useRef, useState } from 'react';
import SearchBar, { SearchBarHandle } from '@/components/SearchBar';
import SearchExamples from '@/components/SearchExamples';
import AccountModal from '@/components/AccountModal';

export default function SearchPage() {
  const searchBarRef = useRef<SearchBarHandle>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);

  function handleExampleSelect(value: string) {
    searchBarRef.current?.setQuery(value);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 relative">
      <button
        onClick={() => setShowAccountModal(true)}
        className="absolute top-6 right-6 text-text-secondary text-sm px-4 py-2 border border-border-default rounded-lg hover:bg-bg-input hover:text-text-primary transition-colors"
      >
        Connexion
      </button>

      <div className="w-full max-w-[680px] text-center flex flex-col items-center">
        <h1 className="text-[2.5rem] font-bold mb-1 tracking-tight">
          <span className="text-accent-blue">Scholar</span>
          <span className="text-accent-violet">Scope</span>
        </h1>
        <p className="text-text-secondary text-base mb-10">
          Explorez les profils academiques en un instant
        </p>

        <SearchBar ref={searchBarRef} />
        <SearchExamples onSelect={handleExampleSelect} />
      </div>

      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </div>
  );
}
