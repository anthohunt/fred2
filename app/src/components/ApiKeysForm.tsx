'use client';

import { useState, useEffect } from 'react';

export interface ApiKeys {
  scopus: string;
  wos: string;
  mistral: string;
}

interface ApiKeysFormProps {
  onSave: (keys: ApiKeys) => void;
}

const STORAGE_KEY = 'scholarscope_api_keys';

function loadKeys(): ApiKeys {
  if (typeof window === 'undefined') return { scopus: '', wos: '', mistral: '' };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { scopus: '', wos: '', mistral: '' };
}

export default function ApiKeysForm({ onSave }: ApiKeysFormProps) {
  const [keys, setKeys] = useState<ApiKeys>({ scopus: '', wos: '', mistral: '' });

  useEffect(() => {
    setKeys(loadKeys());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    onSave(keys);
  }

  function update(field: keyof ApiKeys, value: string) {
    setKeys((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-text-muted text-sm">
        Ajoutez vos cles API pour debloquer les donnees premium (impact factor, metriques avancees, jalons IA).
      </p>

      <div>
        <label htmlFor="scopus-key" className="block text-sm font-medium text-text-secondary mb-1">
          Scopus API Key
        </label>
        <input
          id="scopus-key"
          type="password"
          value={keys.scopus}
          onChange={(e) => update('scopus', e.target.value)}
          className="w-full px-4 py-2.5 bg-bg-input border border-border-default rounded-lg text-text-primary outline-none focus:border-accent-blue"
          placeholder="Votre cle Scopus"
        />
      </div>

      <div>
        <label htmlFor="wos-key" className="block text-sm font-medium text-text-secondary mb-1">
          Web of Science API Key
        </label>
        <input
          id="wos-key"
          type="password"
          value={keys.wos}
          onChange={(e) => update('wos', e.target.value)}
          className="w-full px-4 py-2.5 bg-bg-input border border-border-default rounded-lg text-text-primary outline-none focus:border-accent-blue"
          placeholder="Votre cle Web of Science"
        />
      </div>

      <div>
        <label htmlFor="mistral-key" className="block text-sm font-medium text-text-secondary mb-1">
          Mistral API Key
        </label>
        <input
          id="mistral-key"
          type="password"
          value={keys.mistral}
          onChange={(e) => update('mistral', e.target.value)}
          className="w-full px-4 py-2.5 bg-bg-input border border-border-default rounded-lg text-text-primary outline-none focus:border-accent-blue"
          placeholder="Votre cle Mistral (pour jalons IA)"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-accent-violet text-white font-semibold rounded-lg hover:bg-purple-500 transition-colors"
      >
        Enregistrer les cles
      </button>
    </form>
  );
}
