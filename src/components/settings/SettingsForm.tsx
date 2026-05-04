'use client';

import React, { useState } from 'react';
import { Loader2, Key, CheckCircle2, AlertCircle, Power } from 'lucide-react';
import { updateUserSettings } from '@/lib/settings/actions';

interface SettingsFormProps {
  initialSettings: any;
}

const PROVIDER_OPTIONS = [
  { value: 'gemini', label: 'Google Gemini', hint: 'Recommended' },
  { value: 'openai', label: 'OpenAI', hint: 'ChatGPT' },
  { value: 'anthropic', label: 'Anthropic', hint: 'Claude' },
  { value: 'groq', label: 'Groq', hint: 'Fastest' },
];

const MODEL_OPTIONS: Record<string, { value: string; label: string }[]> = {
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Fast, Good for extraction)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Slower, Better reasoning)' },
  ],
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
    { value: 'gpt-4o', label: 'GPT-4o (Most capable)' },
  ],
  anthropic: [
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Fast)' },
    { value: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet (Excellent quality)' },
  ],
  groq: [
    { value: 'llama3-8b-8192', label: 'Llama 3 8B (Extremely fast)' },
    { value: 'llama3-70b-8192', label: 'Llama 3 70B (High quality)' },
  ],
};

const KEY_FLAGS: Record<string, string> = {
  gemini: 'hasGeminiKey',
  openai: 'hasOpenaiKey',
  anthropic: 'hasAnthropicKey',
  groq: 'hasGroqKey',
};

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const initialProviderModels = initialSettings.providerModels || {};
  const [provider, setProvider] = useState(initialSettings.provider);
  const [activeProvider, setActiveProvider] = useState(initialSettings.provider);
  const [providerModels, setProviderModels] = useState<Record<string, string>>(() =>
    PROVIDER_OPTIONS.reduce<Record<string, string>>((models, option) => {
      models[option.value] =
        initialProviderModels[option.value] || MODEL_OPTIONS[option.value][0].value;
      return models;
    }, {})
  );
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>(() =>
    PROVIDER_OPTIONS.reduce<Record<string, boolean>>((keys, option) => {
      keys[option.value] = !!initialSettings[KEY_FLAGS[option.value]];
      return keys;
    }, {})
  );
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const selectedProvider = PROVIDER_OPTIONS.find((option) => option.value === provider);
  const model = providerModels[provider] || MODEL_OPTIONS[provider][0].value;
  const selectedModelLabel =
    MODEL_OPTIONS[provider]?.find((option) => option.value === model)?.label || model;
  const hasKeySet = !!savedKeys[provider];
  const configuredCount = Object.values(savedKeys).filter(Boolean).length;

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    setApiKey('');
    setMessage({ type: '', text: '' });
  };

  const handleModelChange = (newModel: string) => {
    setProviderModels((currentModels) => ({
      ...currentModels,
      [provider]: newModel,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateUserSettings(provider, model, apiKey || undefined);

      if (apiKey) {
        setSavedKeys((currentKeys) => ({
          ...currentKeys,
          [provider]: true,
        }));
        setApiKey('');
      }

      setActiveProvider(provider);
      setMessage({ type: 'success', text: `${selectedProvider?.label || 'Provider'} is now active.` });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-card p-10">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Key className="text-blue-600" />
        AI Provider Configuration
      </h2>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-red-50 text-red-600 dark:bg-red-950/30'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <label className="block text-sm font-medium">AI Providers</label>
            <span className="text-xs text-slate-500">{configuredCount} configured, 1 active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROVIDER_OPTIONS.map((option) => {
              const isSelected = provider === option.value;
              const isActive = activeProvider === option.value;
              const isConfigured = savedKeys[option.value];

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleProviderChange(option.value)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/80 shadow-sm dark:bg-blue-950/20'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block font-semibold text-slate-950 dark:text-slate-100">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">{option.hint}</span>
                    </span>
                    <span className="flex flex-col items-end gap-1">
                      {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                          <Power size={12} /> Active
                        </span>
                      )}
                      {isConfigured && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                          <CheckCircle2 size={12} /> Saved
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Model for {selectedProvider?.label || 'Provider'}
          </label>
          <select
            value={model}
            onChange={(e) => handleModelChange(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {MODEL_OPTIONS[provider]?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-2 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Selected model
              </span>
              <span className="mt-1 block text-sm font-medium text-slate-950 dark:text-slate-100">
                {selectedModelLabel}
              </span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                API key
              </span>
              <span className="mt-1 block font-mono text-sm font-medium text-slate-950 dark:text-slate-100">
                {hasKeySet ? '•••• •••• •••• saved' : 'No key saved'}
              </span>
            </div>
          </div>

          <label className="block text-sm font-medium mb-2 flex items-center justify-between">
            <span>API Key for {selectedProvider?.label || provider}</span>
            {hasKeySet && (
              <span className="text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-md font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Key Saved
              </span>
            )}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={hasKeySet ? 'Existing key saved. Enter a new key to replace it.' : 'Enter your API key here'}
            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            {hasKeySet
              ? 'Leave blank to keep your existing saved key. Entering a new key will overwrite it.'
              : 'Save a key to add this provider. It is encrypted before being stored in the database.'}
          </p>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSaving || (!hasKeySet && !apiKey)}
            className="btn-primary px-10 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            Save and Set Active
          </button>
        </div>
      </form>
    </div>
  );
}
