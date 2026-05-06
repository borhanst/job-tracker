'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  KeyRound,
  Loader2,
  LockKeyhole,
  Power,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { updateUserSettings } from '@/lib/settings/actions';
import { settingsSchema, validateWithSchema } from '@/lib/validation';

interface SettingsFormProps {
  initialSettings: any;
}

const PROVIDER_OPTIONS = [
  { value: 'gemini', label: 'Google Gemini', hint: 'Recommended', icon: Sparkles },
  { value: 'openai', label: 'OpenAI', hint: 'ChatGPT', icon: Bot },
  { value: 'anthropic', label: 'Anthropic', hint: 'Claude', icon: ShieldCheck },
  { value: 'groq', label: 'Groq', hint: 'Fastest', icon: Zap },
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
    { value: 'openai/gpt-oss-120b', label: 'OpenAI GPT-OSS 120B (Higher quality)' },
    { value: 'openai/gpt-oss-20b', label: 'OpenAI GPT-OSS 20B (Fast)' },
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

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
    setFieldErrors({});
  };

  const handleModelChange = (newModel: string) => {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.model;
      return next;
    });
    setProviderModels((currentModels) => ({
      ...currentModels,
      [provider]: newModel,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setFieldErrors({});

    const validation = validateWithSchema(settingsSchema, {
      provider,
      model,
      newKey: apiKey,
      hasExistingKey: hasKeySet,
    });

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setMessage({ type: 'error', text: validation.formErrors[0] ?? 'Check the highlighted fields.' });
      return;
    }

    setIsSaving(true);

    try {
      await updateUserSettings(validation.data.provider, validation.data.model, validation.data.newKey);

      if (validation.data.newKey) {
        setSavedKeys((currentKeys) => ({
          ...currentKeys,
          [validation.data.provider]: true,
        }));
        setApiKey('');
      }

      setActiveProvider(validation.data.provider);
      setMessage({ type: 'success', text: `${selectedProvider?.label || 'Provider'} is now active.` });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-console">
      <div className="settings-console__mast">
        <div>
          <span><RadioTower size={16} /> Model routing</span>
          <h2>AI control desk</h2>
          <p>
            Choose the active generation provider, keep model preferences per vendor, and rotate encrypted keys without leaving this workspace.
          </p>
        </div>

        <div className="settings-console__status">
          <strong>{configuredCount}</strong>
          <span>configured</span>
        </div>
      </div>

      {message.text && (
        <div className={`settings-message is-${message.type}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form" noValidate>
        <div className="settings-provider-panel">
          <div className="settings-section-heading">
            <div>
              <span>Providers</span>
              <h3>Route generation through</h3>
            </div>
            <em>{activeProvider} active</em>
          </div>

          <div className="settings-provider-grid">
            {PROVIDER_OPTIONS.map((option) => {
              const isSelected = provider === option.value;
              const isActive = activeProvider === option.value;
              const isConfigured = savedKeys[option.value];
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleProviderChange(option.value)}
                  className={`settings-provider ${isSelected ? 'is-selected' : ''}`}
                  aria-pressed={isSelected}
                >
                  <span className="settings-provider__icon">
                    <Icon size={19} />
                  </span>
                  <span className="settings-provider__copy">
                    <strong>{option.label}</strong>
                    <span>{option.hint}</span>
                  </span>
                  <span className="settings-provider__badges">
                    {isActive && (
                      <span className="settings-pill is-active">
                        <Power size={12} /> Active
                      </span>
                    )}
                    {isConfigured && (
                      <span className="settings-pill is-saved">
                        <CheckCircle2 size={12} /> Saved
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="settings-detail-panel">
          <div className="settings-section-heading">
            <div>
              <span>Configuration</span>
              <h3>{selectedProvider?.label || 'Provider'}</h3>
            </div>
            <em>{hasKeySet ? 'key saved' : 'needs key'}</em>
          </div>

          <div className="settings-model-field">
            <label htmlFor="settings-model">Model</label>
            <select
              id="settings-model"
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
              aria-invalid={Boolean(fieldErrors.model?.[0])}
            >
              {MODEL_OPTIONS[provider]?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {fieldErrors.model?.[0] && <p className="settings-field-error">{fieldErrors.model[0]}</p>}
          </div>

          <div className="settings-summary-grid">
            <div className="settings-summary-item">
              <span>Selected model</span>
              <strong>{selectedModelLabel}</strong>
            </div>

            <div className="settings-summary-item">
              <span>API key</span>
              <strong>{hasKeySet ? 'Saved and encrypted' : 'Not saved yet'}</strong>
            </div>
          </div>

          <div className="settings-key-panel">
            <div className="settings-key-panel__header">
              <span><LockKeyhole size={16} /> API key</span>
              {hasKeySet && (
                <em>
                  <CheckCircle2 size={12} /> Key saved
                </em>
              )}
            </div>

            <label className="settings-secret-field">
              <KeyRound size={18} />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setFieldErrors((current) => {
                    const next = { ...current };
                    delete next.newKey;
                    return next;
                  });
                }}
                placeholder={hasKeySet ? 'Enter a new key only if you want to replace it' : `Paste ${selectedProvider?.label || provider} API key`}
                aria-invalid={Boolean(fieldErrors.newKey?.[0])}
              />
            </label>

            {fieldErrors.newKey?.[0] && <p className="settings-field-error">{fieldErrors.newKey[0]}</p>}
            <p>
              {hasKeySet
                ? 'Leave this field empty to keep the existing encrypted key.'
                : 'A key is required before this provider can be activated.'}
            </p>
          </div>

          <div className="settings-actions">
            <span>
              {selectedProvider?.label || 'Provider'} will be used for extraction, CVs, and cover letters.
            </span>
            <button type="submit" disabled={isSaving} className="settings-save">
              {isSaving && <Loader2 size={18} className="animate-spin" />}
              Save and set active
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
