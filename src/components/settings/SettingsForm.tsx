'use client';

import React, { useState } from 'react';
import { Loader2, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { updateUserSettings } from '@/lib/settings/actions';

interface SettingsFormProps {
  initialSettings: any;
}

const PROVIDER_OPTIONS = [
  { value: 'gemini', label: 'Google Gemini (Recommended)' },
  { value: 'openai', label: 'OpenAI (ChatGPT)' },
  { value: 'anthropic', label: 'Anthropic (Claude)' },
  { value: 'groq', label: 'Groq (Fastest)' },
];

const MODEL_OPTIONS: Record<string, { value: string; label: string }[]> = {
  gemini: [
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Fast, Good for extraction)' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Slower, Better reasoning)' },
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

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [provider, setProvider] = useState(initialSettings.provider);
  // If the selected provider changes, we should default to its first model if the current model isn't valid for it
  const [model, setModel] = useState(initialSettings.model);
  const [apiKey, setApiKey] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const hasKeySet = () => {
    switch (provider) {
      case 'gemini': return initialSettings.hasGeminiKey;
      case 'openai': return initialSettings.hasOpenaiKey;
      case 'anthropic': return initialSettings.hasAnthropicKey;
      case 'groq': return initialSettings.hasGroqKey;
      default: return false;
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value;
    setProvider(newProvider);
    setModel(MODEL_OPTIONS[newProvider][0].value);
    setApiKey(''); // clear typed key when switching
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Only pass apiKey if they actually typed a new one
      await updateUserSettings(provider, model, apiKey || undefined);
      
      // Update local state to reflect that a key is now saved
      if (apiKey) {
        if (provider === 'gemini') initialSettings.hasGeminiKey = true;
        if (provider === 'openai') initialSettings.hasOpenaiKey = true;
        if (provider === 'anthropic') initialSettings.hasAnthropicKey = true;
        if (provider === 'groq') initialSettings.hasGroqKey = true;
        setApiKey('');
      }

      setMessage({ type: 'success', text: 'AI Settings saved successfully.' });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">AI Provider</label>
            <select
              value={provider}
              onChange={handleProviderChange}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              {PROVIDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              {MODEL_OPTIONS[provider]?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <label className="block text-sm font-medium mb-2 flex items-center justify-between">
            <span>API Key for {provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
            {hasKeySet() && (
              <span className="text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-md font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Key Saved
              </span>
            )}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={hasKeySet() ? "••••••••••••••••••••••••••••••••" : "Enter your API key here"}
            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            {hasKeySet() 
              ? "Leave blank to keep your existing saved key. Entering a new key will overwrite it." 
              : "Your API key is encrypted before being stored in the database."}
          </p>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSaving || (!hasKeySet() && !apiKey)}
            className="btn-primary px-10 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
