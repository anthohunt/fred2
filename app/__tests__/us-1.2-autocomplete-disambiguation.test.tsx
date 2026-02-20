import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '@/app/page';

jest.mock('@/lib/openalex', () => ({
  searchAuthorsByName: jest.fn(),
}));

import { searchAuthorsByName } from '@/lib/openalex';
const mockSearch = searchAuthorsByName as jest.MockedFunction<typeof searchAuthorsByName>;

const homonymAuthors = [
  {
    id: 'https://openalex.org/A111',
    display_name: 'Marie Dupont',
    last_known_institutions: [{ display_name: 'Universite Paris-Saclay' }],
    topics: [{ display_name: 'Machine Learning' }, { display_name: 'NLP' }],
    summary_stats: { h_index: 34 },
    works_count: 200,
    cited_by_count: 5000,
  },
  {
    id: 'https://openalex.org/A222',
    display_name: 'Marie Dupont',
    last_known_institutions: [{ display_name: 'CNRS Lyon' }],
    topics: [{ display_name: 'Organic Chemistry' }],
    summary_stats: { h_index: 12 },
    works_count: 45,
    cited_by_count: 800,
  },
];

beforeEach(() => {
  jest.useFakeTimers();
  mockSearch.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('US-1.2: Autocompletion avec institution et domaine', () => {
  it('shows institution for each suggestion to disambiguate homonyms', async () => {
    mockSearch.mockResolvedValueOnce(homonymAuthors);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'Marie');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getByText(/Universite Paris-Saclay/)).toBeInTheDocument();
      expect(screen.getByText(/CNRS Lyon/)).toBeInTheDocument();
    });
  });

  it('shows research domain for each suggestion', async () => {
    mockSearch.mockResolvedValueOnce(homonymAuthors);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'Marie');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getByText(/Machine Learning/)).toBeInTheDocument();
      expect(screen.getByText(/Organic Chemistry/)).toBeInTheDocument();
    });
  });

  it('shows h-index badge for each suggestion', async () => {
    mockSearch.mockResolvedValueOnce(homonymAuthors);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'Marie');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getByText('h:34')).toBeInTheDocument();
      expect(screen.getByText('h:12')).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation in dropdown', async () => {
    mockSearch.mockResolvedValueOnce(homonymAuthors);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchPage />);
    const input = screen.getByPlaceholderText(/rechercher un chercheur/i);

    await user.type(input, 'Marie');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    await user.keyboard('{ArrowDown}');
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });
});
