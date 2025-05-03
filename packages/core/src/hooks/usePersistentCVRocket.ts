import { useEffect } from 'react';

interface UsePersistentCVRocketOptions<TData = Record<string, unknown>> {
  storageKey?: string;
  currentStep: number;
  data: TData;
  setStep: (step: number) => void;
  setData: (data: TData) => void;
  isReady: boolean;
}

interface PersistentState<TData> {
  step: number;
  data: TData;
  timestamp: string;
  marketingTokens: Record<string, string>;
  deviceInfo: Record<string, string>;
}

function getMarketingTokens(): Record<string, string> {
  const urlParams = new URLSearchParams(window.location.search);
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'ref',
  ];
  const result: Record<string, string> = {};
  keys.forEach((key) => {
    const val = urlParams.get(key);
    if (val) result[key] = val;
  });
  return result;
}

function getDeviceInfo(): Record<string, string> {
  const ua = navigator.userAgent;
  return {
    userAgent: ua,
    platform: navigator.platform,
    language: navigator.language,
    isMobile: /Mobi|Android/i.test(ua) ? 'true' : 'false',
  };
}

export function usePersistentCVRocket<TData>({
  storageKey = 'cvrocket_form_state',
  currentStep,
  data,
  setStep,
  setData,
  isReady,
}: UsePersistentCVRocketOptions<TData>) {
  // Zustand wiederherstellen
  useEffect(() => {
    if (!isReady) return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;

      const parsed: PersistentState<TData> = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.step === 'number') setStep(parsed.step);
        if (parsed.data) setData(parsed.data);
      }
    } catch (err) {
      console.warn('Fehler beim Wiederherstellen des Formularzustands:', err);
    }
  }, [isReady, setStep, setData, storageKey]);

  // Zustand speichern
  useEffect(() => {
    if (!isReady) return;

    const state: PersistentState<TData> = {
      step: currentStep,
      data,
      timestamp: new Date().toISOString(),
      marketingTokens: getMarketingTokens(),
      deviceInfo: getDeviceInfo(),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (err) {
      console.warn('Fehler beim Speichern des Formularzustands:', err);
    }
  }, [currentStep, data, storageKey, isReady]);
}
