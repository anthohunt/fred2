import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '@/app/page';
import AccountModal from '@/components/AccountModal';

jest.mock('@/lib/openalex', () => ({
  searchAuthorsByName: jest.fn().mockResolvedValue([]),
  searchAuthorByOrcid: jest.fn().mockResolvedValue(null),
}));

describe('US-1.6: Compte optionnel', () => {
  it('shows a "Connexion" button on the search page', () => {
    render(<SearchPage />);
    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
  });

  it('opens account modal when clicking Connexion', async () => {
    const user = userEvent.setup();
    render(<SearchPage />);

    await user.click(screen.getByRole('button', { name: /connexion/i }));

    expect(screen.getByRole('heading', { name: /creer un compte/i })).toBeInTheDocument();
  });

  it('AccountModal has email and password fields', () => {
    render(<AccountModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it('AccountModal has a submit button', () => {
    render(<AccountModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /creer|se connecter/i })).toBeInTheDocument();
  });

  it('shows anonymous mode message — no account required', () => {
    render(<AccountModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/optionnel/i)).toBeInTheDocument();
  });
});
