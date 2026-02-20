import { detectInputFormat } from '@/lib/detect-format';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '@/app/page';

jest.mock('@/lib/openalex', () => ({
  searchAuthorsByName: jest.fn().mockResolvedValue([]),
  searchAuthorByOrcid: jest.fn().mockResolvedValue(null),
}));

describe('US-1.4: Detection auto format — unit tests', () => {
  it('detects name format', () => {
    expect(detectInputFormat('Frederick Benaben')).toBe('name');
    expect(detectInputFormat('Marie-Claire Dupont')).toBe('name');
    expect(detectInputFormat("Jean D'Arc")).toBe('name');
  });

  it('detects ORCID format', () => {
    expect(detectInputFormat('0000-0003-1894-5128')).toBe('orcid');
    expect(detectInputFormat('0000-0001-2345-678X')).toBe('orcid');
  });

  it('detects Scopus ID format', () => {
    expect(detectInputFormat('56273849100')).toBe('scopus');
    expect(detectInputFormat('Scopus: 56273849100')).toBe('scopus');
  });

  it('detects Google Scholar URL format', () => {
    expect(detectInputFormat('scholar.google.com/citations?user=abc123')).toBe('scholar');
    expect(detectInputFormat('https://scholar.google.fr/citations?user=abc')).toBe('scholar');
  });

  it('returns unknown for empty or unrecognized input', () => {
    expect(detectInputFormat('')).toBe('unknown');
    expect(detectInputFormat('12')).toBe('unknown');
  });
});

describe('US-1.4: Detection auto format — badge display', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('shows "Nom detecte" badge when typing a name', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'Frederick');

    expect(screen.getByTestId('format-badge')).toHaveTextContent('Nom detecte');
  });

  it('shows "ORCID detecte" badge when typing an ORCID', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, '0000-0003-1894-5128');

    expect(screen.getByTestId('format-badge')).toHaveTextContent('ORCID detecte');
  });

  it('shows "Scopus ID detecte" badge when typing a Scopus ID', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, '56273849100');

    expect(screen.getByTestId('format-badge')).toHaveTextContent('Scopus ID detecte');
  });

  it('shows "Google Scholar detecte" badge for Scholar URL', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'scholar.google.com/citations?user=abc');

    expect(screen.getByTestId('format-badge')).toHaveTextContent('Google Scholar detecte');
  });
});
