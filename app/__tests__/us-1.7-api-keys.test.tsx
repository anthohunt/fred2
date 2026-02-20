import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiKeysForm from '@/components/ApiKeysForm';

describe('US-1.7: Cles API institutionnelles', () => {
  it('renders Scopus API key input', () => {
    render(<ApiKeysForm onSave={() => {}} />);
    expect(screen.getByLabelText(/scopus/i)).toBeInTheDocument();
  });

  it('renders Web of Science API key input', () => {
    render(<ApiKeysForm onSave={() => {}} />);
    expect(screen.getByLabelText(/web of science/i)).toBeInTheDocument();
  });

  it('renders Mistral API key input', () => {
    render(<ApiKeysForm onSave={() => {}} />);
    expect(screen.getByLabelText(/mistral/i)).toBeInTheDocument();
  });

  it('calls onSave with API keys when form is submitted', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    render(<ApiKeysForm onSave={onSave} />);

    await user.type(screen.getByLabelText(/scopus/i), 'scopus-key-123');
    await user.type(screen.getByLabelText(/web of science/i), 'wos-key-456');
    await user.type(screen.getByLabelText(/mistral/i), 'mistral-key-789');

    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    expect(onSave).toHaveBeenCalledWith({
      scopus: 'scopus-key-123',
      wos: 'wos-key-456',
      mistral: 'mistral-key-789',
    });
  });

  it('shows description explaining premium features', () => {
    render(<ApiKeysForm onSave={() => {}} />);
    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  it('stores API keys in localStorage when saved', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<ApiKeysForm onSave={onSave} />);

    await user.type(screen.getByLabelText(/scopus/i), 'test-key');
    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    expect(localStorage.getItem('scholarscope_api_keys')).toBeTruthy();
  });
});
