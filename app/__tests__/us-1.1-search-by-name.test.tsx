import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '@/app/page';

// Mock the openalex module
jest.mock('@/lib/openalex', () => ({
  searchAuthorsByName: jest.fn(),
}));

import { searchAuthorsByName } from '@/lib/openalex';
const mockSearch = searchAuthorsByName as jest.MockedFunction<typeof searchAuthorsByName>;

const mockAuthors = [
  {
    id: 'https://openalex.org/A123',
    display_name: 'Frederick Benaben',
    last_known_institutions: [{ display_name: 'IMT Mines Albi' }],
    topics: [{ display_name: 'Crisis Management' }],
    summary_stats: { h_index: 27 },
    works_count: 150,
    cited_by_count: 3200,
  },
];

beforeEach(() => {
  jest.useFakeTimers();
  mockSearch.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('US-1.1: Recherche par nom', () => {
  it('renders a search input with placeholder', () => {
    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);
    expect(input).toBeInTheDocument();
  });

  it('displays the ScholarScope logo', () => {
    render(<SearchPage />);
    expect(screen.getByText('Scholar')).toBeInTheDocument();
    expect(screen.getByText('Scope')).toBeInTheDocument();
  });

  it('calls OpenAlex search when user types a name (3+ chars)', async () => {
    mockSearch.mockResolvedValueOnce(mockAuthors);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'Fred');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('Fred');
    });
  });

  it('displays author results from the search', async () => {
    mockSearch.mockResolvedValueOnce(mockAuthors);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'Frederick');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getByText('Frederick Benaben')).toBeInTheDocument();
    });
  });
});
