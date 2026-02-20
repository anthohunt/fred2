export interface OpenAlexAuthor {
  id: string;
  display_name: string;
  last_known_institutions: { display_name: string }[];
  topics: { display_name: string }[];
  summary_stats: { h_index: number };
  works_count: number;
  cited_by_count: number;
}

export interface OpenAlexSearchResult {
  results: OpenAlexAuthor[];
}

export async function searchAuthorsByName(query: string): Promise<OpenAlexAuthor[]> {
  const res = await fetch(
    `https://api.openalex.org/authors?search=${encodeURIComponent(query)}&per_page=5`
  );
  if (!res.ok) return [];
  const data: OpenAlexSearchResult = await res.json();
  return data.results;
}

export async function searchAuthorByOrcid(orcid: string): Promise<OpenAlexAuthor | null> {
  const res = await fetch(
    `https://api.openalex.org/authors/orcid:${encodeURIComponent(orcid)}`
  );
  if (!res.ok) return null;
  const data: OpenAlexAuthor = await res.json();
  return data;
}
