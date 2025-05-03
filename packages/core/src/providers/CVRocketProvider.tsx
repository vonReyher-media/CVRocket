import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { ButtonFooter } from '../components/buttonFooter';
import { CheckAvailableToastProvider } from './ToastProvider';
import { useProtectedStepNavigation } from '../hooks';
import { usePersistentCVRocket } from '../hooks';

/**
 * Type representing the shape of form data.
 */
type FormData = Record<string, unknown>;

/**
 * Configuration for a specific step/page in the form.
 */
export interface PageConfig {
  isFormValid: boolean;
  agbRequired: boolean;
  showNextButton: boolean;
  showBackButton: boolean;
  goToNextStep?: () => Promise<void>;
  goToPreviousStep?: () => Promise<void>;
}

/**
 * Typed event map used for event-based communication within the form.
 */
type EventMap = {
  next_step: FormData;
  previous_step: void;
};

/**
 * Callback invoked when emitting an event.
 */
type EventCallback<K extends keyof EventMap> = (
  payload: EventMap[K],
) => void | Promise<void>;

/**
 * Function signature for emitting a typed event.
 */
type EventHandler = <K extends keyof EventMap>(
  event: K,
  payload: EventMap[K],
) => void;

/**
 * Props required to initialize the CVRocketProvider.
 */
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

/**
 * Context value shared throughout the form.
 */
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
  const totalSteps = React.Children.count(children);

  const eventListeners: {
    [K in keyof EventMap]?: EventCallback<K>[];
  } = {};

  const updateFormData = (newData: FormData) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const emit: EventHandler = (event, payload) => {
    eventListeners[event]?.forEach((listener) => {
      void listener(payload as never);
    });
  };

  const subscribe = useCallback(
    <K extends keyof EventMap>(event: K, callback: EventCallback<K>) => {
      // Initialize the array if it doesn't exist for the specific event key
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }

      // Get the specific listener array and assert its type to EventCallback<K>[]
      const listeners = eventListeners[event] as EventCallback<K>[];
      listeners.push(callback);

      // Return the unsubscribe function
      return () => {
        const currentListeners = eventListeners[event];
        if (!currentListeners) return; // No listeners for this event

        // Filter the listeners with proper type assertion before assignment
        eventListeners[event] = currentListeners.filter(
          (l) => l !== callback,
        ) as unknown as (typeof eventListeners)[typeof event];
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
          await new Promise((res) => setTimeout(res, 6000));
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

  const currentChild = React.Children.toArray(children)[currentStep];
  const enhancedChild = React.isValidElement(currentChild)
    ? React.cloneElement(currentChild as React.ReactElement, {
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
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () =>
      window.removeEventListener('beforeunload', beforeUnloadHandler);
  }, [warnBeforeUnload]);

  const showThankYou = isCompleted && enableThankYouPage;
  const thankYouStep = React.Children.toArray(children)[totalSteps];

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
 * Throws an error if used outside the provider.
 */
export const useCVRocket = (): CVRocketContextValue => {
  const context = React.useContext(CVRocketContext);
  if (!context) {
    throw new Error('useCVRocket must be used within a CVRocketProvider');
  }
  return context;
};
