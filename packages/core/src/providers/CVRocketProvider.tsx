/**
 * CVRocketProvider – central form provider with step management,
 * context access, validation, persistence, and protected navigation.
 *
 * Features:
 * - Configurable step-based form system
 * - Context-based navigation & data management
 * - Event-based step handling
 * - Optional terms checkbox integration
 * - Supports persistent storage & Thank You page
 * - Auto-navigation & button footer integration
 */

import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ButtonFooter } from '../components/buttonFooter';
import { usePersistentCVRocket, useProtectedStepNavigation } from '../hooks';
import { CheckAvailableToastProvider } from './ToastProvider';

/** Shape of form data object */
type FormData = Record<string, unknown>;

/** Configuration per page/step */
export interface PageConfig {
  isFormValid: boolean;
  agbRequired: boolean;
  showNextButton: boolean;
  showBackButton: boolean;
  goToNextStep?: () => Promise<void>;
  goToPreviousStep?: () => Promise<void>;
}

/** Internal event names & payloads */
type EventMap = {
  next_step: FormData;
  previous_step: void;
};

/** Signature for event callback */
type EventCallback<K extends keyof EventMap> = (
  payload: EventMap[K],
) => void | Promise<void>;

/** Typed event emitter function */
type EventHandler = <K extends keyof EventMap>(
  event: K,
  payload: EventMap[K],
) => void;

/** Props for the CVRocketProvider */
interface CVRocketProviderProps {
  children: ReactNode;
  onComplete: (data: FormData) => void | Promise<void>;
  onError?: (error: Error) => void;
  onStart?: () => void;
  onStepChange?: (step: number) => void;
  enableThankYouPage?: boolean;
  loadingComponent?: ReactNode;
  protectFormNavigation?: boolean;
  warnBeforeUnload?: boolean;
  persistData?: boolean;
  storageKey?: string;
}

/** Context value available via useCVRocket */
interface CVRocketContextValue {
  currentStep: number;
  totalSteps: number;
  data: FormData;
  goToNextStep: (stepData?: FormData) => void;
  goToPreviousStep: () => void;
  updateFormData: (newData: FormData) => void;
  emit: EventHandler;
  submitForm: () => void;
  updatePageConfig: (step: number, config: PageConfig) => void;
  setCurrentPageConfig: (config: PageConfig) => void;
  currentPageConfig: PageConfig;
  pageConfigs: PageConfig[];
}

export const CVRocketContext = createContext<CVRocketContextValue | undefined>(
  undefined,
);

export const CVRocketProvider: React.FC<CVRocketProviderProps> = ({
  children,
  onComplete,
  onError,
  onStart,
  onStepChange,
  loadingComponent,
  protectFormNavigation = true,
  warnBeforeUnload = false,
  enableThankYouPage = true,
  persistData = false,
  storageKey,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>({});
  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = Children.count(children);

  type GenericListenerMap = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: EventCallback<any>[]; // TODO: replace with a more specific type
  };

  const eventListenersRef = useRef<GenericListenerMap>({});

  const updateFormData = (newData: FormData) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const emit: EventHandler = (event, payload) => {
    const listeners = eventListenersRef.current[event];
    listeners?.forEach((listener) => {
      void listener(payload as never);
    });
  };

  const subscribe = useCallback(
    <K extends keyof EventMap>(event: K, callback: EventCallback<K>) => {
      const listeners = eventListenersRef.current[event] ?? [];
      eventListenersRef.current[event] = [...listeners, callback];

      return () => {
        const current = eventListenersRef.current[event];
        if (!current) return;
        eventListenersRef.current[event] = current.filter(
          (cb): cb is EventCallback<K> => cb !== callback,
        );
      };
    },
    [],
  );

  const handleNextStep = useCallback(
    async (stepData?: FormData) => {
      try {
        if (stepData) updateFormData(stepData);
        if (currentStep < totalSteps - 1) {
          setCurrentStep((prev) => {
            const newStep = prev + 1;
            onStepChange?.(newStep);
            return newStep;
          });
        } else {
          setIsSubmitting(true);
          await new Promise((res) => setTimeout(res, 600)); // simulate async work
          await onComplete(data);
          setIsSubmitting(false);
          if (enableThankYouPage) setIsCompleted(true);
        }
      } catch (error) {
        setIsSubmitting(false);
        onError?.(
          error instanceof Error ? error : new Error('Form step error'),
        );
      }
    },
    [
      currentStep,
      totalSteps,
      data,
      onComplete,
      onError,
      onStepChange,
      enableThankYouPage,
    ],
  );

  const handlePreviousStep = useCallback(() => {
    setCurrentStep((prev) => {
      const newStep = Math.max(0, prev - 1);
      onStepChange?.(newStep);
      return newStep;
    });
  }, [onStepChange]);

  const submitForm = useCallback(() => {
    try {
      onComplete(data);
    } catch (error) {
      onError?.(
        error instanceof Error ? error : new Error('Form submission error'),
      );
    }
  }, [data, onComplete, onError]);

  useEffect(() => {
    onStart?.();
    onStepChange?.(0);
    const unsubscribeNext = subscribe('next_step', handleNextStep);
    const unsubscribePrev = subscribe('previous_step', handlePreviousStep);
    return () => {
      unsubscribeNext();
      unsubscribePrev();
    };
  }, [handleNextStep, handlePreviousStep, onStart, onStepChange, subscribe]);

  const updatePageConfig = useCallback((step: number, config: PageConfig) => {
    setPageConfigs((prev) => {
      const updated = [...prev];
      updated[step] = config;
      return updated;
    });
  }, []);

  const setCurrentPageConfig = useCallback(
    (config: PageConfig) => {
      updatePageConfig(currentStep, config);
    },
    [currentStep, updatePageConfig],
  );

  const currentChild = Children.toArray(children)[currentStep];
  const enhancedChild = isValidElement(currentChild)
    ? cloneElement(currentChild as React.ReactElement, {
        setPageConfig: (config: PageConfig) =>
          updatePageConfig(currentStep, config),
      })
    : currentChild;

  const contextValue: CVRocketContextValue = {
    currentStep,
    totalSteps,
    data,
    goToNextStep: handleNextStep,
    goToPreviousStep: handlePreviousStep,
    updateFormData,
    emit,
    submitForm,
    updatePageConfig,
    currentPageConfig: pageConfigs[currentStep] ?? {
      isFormValid: true,
      agbRequired: false,
      showNextButton: true,
      showBackButton: true,
    },
    setCurrentPageConfig,
    pageConfigs,
  };

  const isBackNavigationAllowed =
    pageConfigs[currentStep]?.showBackButton ?? true;

  usePersistentCVRocket({
    currentStep,
    data,
    setStep: setCurrentStep,
    setData,
    isReady: persistData,
    storageKey,
  });

  useProtectedStepNavigation({
    currentStep,
    handleNextStep,
    handlePreviousStep,
    isBackNavigationAllowed,
    warnBeforeUnload,
    isEnabled: protectFormNavigation,
  });

  useEffect(() => {
    if (!warnBeforeUnload) return;
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      // Deprecated but still required for some browsers
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () =>
      window.removeEventListener('beforeunload', beforeUnloadHandler);
  }, [warnBeforeUnload]);

  const showThankYou = isCompleted && enableThankYouPage;
  const thankYouStep = Children.toArray(children)[totalSteps];

  return (
    <CheckAvailableToastProvider>
      <div className="py-14">
        <CVRocketContext.Provider value={contextValue}>
          <div className="container mx-auto px-10">
            <div className="flex flex-col h-full justify-between w-full">
              <div className="flex-grow">
                {isSubmitting
                  ? (loadingComponent ?? (
                      <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground animate-pulse">
                          Submitting...
                        </p>
                      </div>
                    ))
                  : showThankYou
                    ? thankYouStep
                    : enhancedChild}
              </div>
              {!isSubmitting && !showThankYou && (
                <div className="w-full">
                  {pageConfigs[currentStep]?.showNextButton && (
                    <ButtonFooter
                      currentStep={currentStep}
                      totalSteps={totalSteps}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </CVRocketContext.Provider>
      </div>
    </CheckAvailableToastProvider>
  );
};

/**
 * Hook to access the CVRocket context.
 * Must be used within CVRocketProvider.
 */
export const useCVRocket = (): CVRocketContextValue => {
  const context = useContext(CVRocketContext);
  if (!context) {
    throw new Error('useCVRocket must be used within a CVRocketProvider');
  }
  return context;
};
