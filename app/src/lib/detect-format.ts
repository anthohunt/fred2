export type InputFormat = 'name' | 'orcid' | 'scopus' | 'scholar' | 'unknown';

const ORCID_REGEX = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i;
const SCOPUS_REGEX = /^(?:scopus:\s*)?(\d{6,})$/i;
const SCHOLAR_REGEX = /scholar\.google/i;
const NAME_REGEX = /^[a-zA-Z\u00C0-\u024F\s.\-']{3,}$/;

export function detectInputFormat(input: string): InputFormat {
  const trimmed = input.trim();
  if (!trimmed) return 'unknown';

  if (ORCID_REGEX.test(trimmed)) return 'orcid';
  if (SCHOLAR_REGEX.test(trimmed)) return 'scholar';
  if (SCOPUS_REGEX.test(trimmed)) return 'scopus';
  if (NAME_REGEX.test(trimmed)) return 'name';

  return 'unknown';
}

export function extractScopusId(input: string): string {
  const match = input.match(SCOPUS_REGEX);
  return match ? match[1] : input;
}
