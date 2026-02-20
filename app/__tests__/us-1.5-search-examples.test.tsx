import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '@/app/page';

jest.mock('@/lib/openalex', () => ({
  searchAuthorsByName: jest.fn().mockResolvedValue([]),
  searchAuthorByOrcid: jest.fn().mockResolvedValue(null),
}));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('US-1.5: Exemples de recherche', () => {
  it('displays "Essayez un exemple" label', () => {
    render(<SearchPage />);
    expect(screen.getByText(/essayez un exemple/i)).toBeInTheDocument();
  });

  it('shows example shortcuts for different input formats', () => {
    render(<SearchPage />);
    expect(screen.getByRole('button', { name: /frederick benaben/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /0000-0003-1894-5128/i })).toBeInTheDocument();
  });

  it('fills search input when clicking a shortcut', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchPage />);

    const shortcut = screen.getByRole('button', { name: /frederick benaben/i });
    await user.click(shortcut);

    const input = screen.getByPlaceholderText(/rechercher un chercheur/i) as HTMLInputElement;
    expect(input.value).toBe('Frederick Benaben');
  });

  it('shows format tips below examples', () => {
    render(<SearchPage />);
    expect(screen.getByText(/nom complet/i)).toBeInTheDocument();
    expect(screen.getByText(/orcid/i)).toBeInTheDocument();
    expect(screen.getByText(/scopus id/i)).toBeInTheDocument();
    expect(screen.getByText(/google scholar/i)).toBeInTheDocument();
  });
});
