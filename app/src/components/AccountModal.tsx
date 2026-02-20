'use client';

import { useState } from 'react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-bg-navbar border border-border-default rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-text-primary mb-2">Creer un compte</h2>
        <p className="text-text-muted text-sm mb-6">
          Optionnel — ScholarScope fonctionne sans compte. Un compte permet de persister vos cles API institutionnelles.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-bg-input border border-border-default rounded-lg text-text-primary outline-none focus:border-accent-blue"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-bg-input border border-border-default rounded-lg text-text-primary outline-none focus:border-accent-blue"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-accent-blue text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
          >
            Creer un compte
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-text-muted text-sm hover:text-text-secondary transition-colors"
        >
          Continuer sans compte
        </button>
      </div>
    </div>
  );
}
