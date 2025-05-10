import {
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

import {
  CVRocketFullscreenHeaderProps,
  FullScreenHeaderLayout,
} from '../components/base/fullscreenHeader.tsx';
import { ButtonFooter } from '../components/buttonFooter';
import { usePersistentCVRocket, useProtectedStepNavigation } from '../hooks';
import { cn } from '../utils/utils.ts';
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

/** Listener map with typed keys */
type GenericListenerMap = {
  [K in keyof EventMap]?: EventCallback<K>[];
};

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
  fullScreenLayout?: CVRocketFullscreenHeaderProps;
  className?: string;
  storageKey?: string;
}

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
  fullScreenLayout = undefined,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>({});
  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const totalSteps = Children.count(children);

  const eventListenersRef = useRef<GenericListenerMap>({});

  const updateFormData = (newData: FormData) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const emit: EventHandler = (event, payload) => {
    const listeners = eventListenersRef.current[event];
    listeners?.forEach((listener) => {
      void listener(payload);
    });
  };

  const subscribe = useCallback(
    <K extends keyof EventMap>(event: K, callback: EventCallback<K>) => {
      const listeners = eventListenersRef.current[event] ?? [];
      // @ts-expect-error – type-safe via controlled usage in subscribe
      eventListenersRef.current[event] = [...listeners, callback];

      return () => {
        const current = eventListenersRef.current[event];
        if (!current) return;
        // @ts-expect-error – type-safe via controlled usage in subscribe
        eventListenersRef.current[event] = current.filter(
          (cb): cb is EventCallback<K> => cb !== callback,
        );
      };
    },
    [],
  );

  // Funktion zum Überprüfen, ob eine Seite gerendert werden soll
  const shouldRenderPage = useCallback(
    (step: number) => {
      const child = Children.toArray(children)[step];
      if (!isValidElement(child)) return true;

      const renderCondition = child.props.renderCondition;
      return typeof renderCondition === 'function'
        ? renderCondition()
        : (renderCondition ?? true);
    },
    [children],
  );

  // Finde den ersten sichtbaren Schritt
  const findFirstVisibleStep = useCallback(() => {
    let step = 0;
    while (step < totalSteps - 1 && !shouldRenderPage(step)) {
      step++;
    }
    return step;
  }, [totalSteps, shouldRenderPage]);

  useEffect(() => {
    if (!hasStarted) {
      const firstVisibleStep = findFirstVisibleStep();
      setCurrentStep(firstVisibleStep);
      setHasStarted(true);
      onStart?.();
      onStepChange?.(firstVisibleStep);
    }
  }, [hasStarted, findFirstVisibleStep, onStart, onStepChange]);

  // Finde den nächsten sichtbaren Schritt
  const findNextVisibleStep = useCallback(
    (current: number) => {
      let nextStep = current + 1;
      while (nextStep < totalSteps - 1 && !shouldRenderPage(nextStep)) {
        nextStep++;
      }
      return nextStep;
    },
    [totalSteps, shouldRenderPage],
  );

  // Finde den vorherigen sichtbaren Schritt
  const findPreviousVisibleStep = useCallback(
    (current: number) => {
      let prevStep = current - 1;
      while (prevStep > 0 && !shouldRenderPage(prevStep)) {
        prevStep--;
      }
      return prevStep;
    },
    [shouldRenderPage],
  );

  const handleNextStep = useCallback(
    async (stepData?: FormData) => {
      try {
        if (stepData) updateFormData(stepData);

        const nextStep = findNextVisibleStep(currentStep);

        if (nextStep < totalSteps - 1) {
          setCurrentStep(nextStep);
          onStepChange?.(nextStep);
        } else {
          setIsCompleted(true);
          setIsSubmitting(true);
          await new Promise((res) => setTimeout(res, 600));
          await onComplete(data);
          setIsSubmitting(false);
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
      findNextVisibleStep,
    ],
  );

  const handlePreviousStep = useCallback(() => {
    const prevStep = findPreviousVisibleStep(currentStep);
    setCurrentStep(prevStep);
    onStepChange?.(prevStep);
  }, [currentStep, onStepChange, findPreviousVisibleStep]);

  const submitForm = useCallback(async () => {
    try {
      await onComplete(data);
    } catch (error) {
      onError?.(
        error instanceof Error ? error : new Error('Form submission error'),
      );
    }
  }, [data, onComplete, onError]);

  useEffect(() => {
    const unsubscribeNext = subscribe('next_step', handleNextStep);
    const unsubscribePrev = subscribe('previous_step', handlePreviousStep);
    return () => {
      unsubscribeNext();
      unsubscribePrev();
    };
  }, [handleNextStep, handlePreviousStep, subscribe]);

  const updatePageConfig = useCallback((step: number, config: PageConfig) => {
    console.log('CVRocketProvider - Updating page config for step:', step);
    console.log('CVRocketProvider - New config:', config);
    setPageConfigs((prev) => {
      const updated = [...prev];
      updated[step] = config;
      return updated;
    });
  }, []);

  const setCurrentPageConfig = useCallback(
    (config: PageConfig) => {
      console.log('CVRocketProvider - Setting current page config:', config);
      updatePageConfig(currentStep, config);
    },
    [currentStep, updatePageConfig],
  );

  const currentChild = Children.toArray(children)[currentStep] ?? null;
  const enhancedChild = isValidElement(currentChild)
    ? cloneElement(
        currentChild as React.ReactElement<{
          setPageConfig?: (config: PageConfig) => void;
          renderCondition?: boolean | (() => boolean);
        }>,
        {
          setPageConfig: (config: PageConfig) =>
            updatePageConfig(currentStep, config),
        },
      )
    : currentChild;

  // Check if the current page should be rendered
  const shouldRenderCurrentPage =
    isValidElement(currentChild) &&
    (typeof currentChild.props.renderCondition === 'function'
      ? currentChild.props.renderCondition()
      : (currentChild.props.renderCondition ?? true));

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

  const thankYouStep = Children.toArray(children)[totalSteps] ?? null;

  return (
    <CheckAvailableToastProvider>
      <CVRocketContext.Provider value={contextValue}>
        <div
          className={cn(
            fullScreenLayout
              ? 'fixed inset-0 w-screen h-screen bg-background'
              : 'container mx-auto px-10',
            className,
          )}
        >
          {fullScreenLayout ? (
            <div className="fixed inset-0 flex flex-col h-screen w-screen z-[9999] bg-background">
              {/* Header immer sichtbar oben */}
              <FullScreenHeaderLayout {...fullScreenLayout} />

              {/* Scrollbarer Content */}
              <div className="flex-grow overflow-y-auto pt-6 mx-auto px-5 container">
                {isCompleted ? (
                  isSubmitting ? (
                    (loadingComponent ?? (
                      <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground animate-pulse">
                          Submitting...
                        </p>
                      </div>
                    ))
                  ) : (
                    (thankYouStep ?? (
                      <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground animate-pulse">
                          Thank you for your submission!
                        </p>
                      </div>
                    ))
                  )
                ) : (
                  <>
                    {/* Seiteninhalt */}
                    <div className="shrink-0 py-5 bg-background z-10 ">
                      {shouldRenderCurrentPage && enhancedChild}
                    </div>
                  </>
                )}
              </div>

              {/* Fixierte Button-Leiste unten */}
              {!isCompleted && (
                <div className="shrink-0 w-full py-5 bg-background px-10">
                  <ButtonFooter
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between w-full">
              <div className="flex-grow pt-6">
                {isCompleted
                  ? isSubmitting
                    ? loadingComponent
                    : (thankYouStep ?? (
                        <div className="text-center py-20">
                          <p className="text-lg text-muted-foreground animate-pulse">
                            Thank you for your submission!
                          </p>
                        </div>
                      ))
                  : shouldRenderCurrentPage && enhancedChild}
              </div>
              {!isCompleted && (
                <div className="w-full py-5 bg-background">
                  {pageConfigs[currentStep]?.showNextButton && (
                    <ButtonFooter
                      currentStep={currentStep}
                      totalSteps={totalSteps}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CVRocketContext.Provider>
    </CheckAvailableToastProvider>
  );
};

export const useCVRocket = (): CVRocketContextValue => {
  const context = useContext(CVRocketContext);
  if (!context) {
    throw new Error('useCVRocket must be used within a CVRocketProvider');
  }
  return context;
};
