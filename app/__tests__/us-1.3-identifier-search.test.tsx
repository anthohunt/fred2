import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '@/app/page';

jest.mock('@/lib/openalex', () => ({
  searchAuthorsByName: jest.fn(),
  searchAuthorByOrcid: jest.fn(),
}));

import { searchAuthorsByName, searchAuthorByOrcid } from '@/lib/openalex';
const mockSearchByName = searchAuthorsByName as jest.MockedFunction<typeof searchAuthorsByName>;
const mockSearchByOrcid = searchAuthorByOrcid as jest.MockedFunction<typeof searchAuthorByOrcid>;

const mockAuthor = {
  id: 'https://openalex.org/A123',
  display_name: 'Frederick Benaben',
  last_known_institutions: [{ display_name: 'IMT Mines Albi' }],
  topics: [{ display_name: 'Crisis Management' }],
  summary_stats: { h_index: 27 },
  works_count: 150,
  cited_by_count: 3200,
};

beforeEach(() => {
  jest.useFakeTimers();
  mockSearchByName.mockReset();
  mockSearchByOrcid.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('US-1.3: ORCID/Scopus ID/URL Scholar', () => {
  it('calls ORCID search when user enters an ORCID', async () => {
    mockSearchByOrcid.mockResolvedValueOnce(mockAuthor);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, '0000-0003-1894-5128');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(mockSearchByOrcid).toHaveBeenCalledWith('0000-0003-1894-5128');
    });
  });

  it('displays the author found by ORCID', async () => {
    mockSearchByOrcid.mockResolvedValueOnce(mockAuthor);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, '0000-0003-1894-5128');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getByText('Frederick Benaben')).toBeInTheDocument();
    });
  });

  it('handles Scopus ID input', async () => {
    mockSearchByName.mockResolvedValueOnce([mockAuthor]);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    // Scopus IDs are numeric, searched via name API with filter
    await user.type(input, '56273849100');
    act(() => { jest.advanceTimersByTime(350); });

    // Scopus ID search should trigger some search function
    await waitFor(() => {
      expect(mockSearchByName).toHaveBeenCalled();
    });
  });

  it('handles Google Scholar URL input', async () => {
    mockSearchByName.mockResolvedValueOnce([mockAuthor]);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'scholar.google.com/citations?user=abc123');
    act(() => { jest.advanceTimersByTime(350); });

    // Scholar URLs trigger a search (OpenAlex doesn't support Scholar directly)
    await waitFor(() => {
      expect(mockSearchByName).toHaveBeenCalled();
    });
  });
});
