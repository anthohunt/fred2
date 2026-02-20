import SearchBar from '@/components/SearchBar';

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[680px] text-center">
        <h1 className="text-[2.5rem] font-bold mb-1 tracking-tight">
          <span className="text-accent-blue">Scholar</span>
          <span className="text-accent-violet">Scope</span>
        </h1>
        <p className="text-text-secondary text-base mb-10">
          Explorez les profils academiques en un instant
        </p>

        <SearchBar />
      </div>
    </div>
  );
}
