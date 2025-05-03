import { useEffect, useRef } from 'react';

interface UseProtectedStepNavigationProps {
  currentStep: number;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  isBackNavigationAllowed: boolean;
  warnBeforeUnload: boolean;
  isEnabled: boolean;
}

export function useProtectedStepNavigation({
  currentStep,
  handleNextStep,
  handlePreviousStep,
  isBackNavigationAllowed,
  warnBeforeUnload,
  isEnabled,
}: UseProtectedStepNavigationProps) {
  const lastStep = useRef<number>(currentStep);
  const internalNavigation = useRef<boolean>(false);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const pushStepToHistory = (step: number) => {
      const url = new URL(window.location.href);
      url.searchParams.set('x', step.toString());
      history.pushState({ cvrocketStep: step }, '', url.toString());
      lastStep.current = step;
    };

    pushStepToHistory(currentStep);

    const onPopState = (e: PopStateEvent) => {
      const stateStep = e.state?.cvrocketStep;

      internalNavigation.current = true;

      if (typeof stateStep === 'number') {
        if (stateStep < lastStep.current) {
          if (isBackNavigationAllowed) {
            handlePreviousStep();
            lastStep.current = stateStep;
          } else {
            pushStepToHistory(currentStep);
          }
        } else if (stateStep > lastStep.current) {
          handleNextStep();
          lastStep.current = stateStep;
        } else {
          history.replaceState(
            { cvrocketStep: currentStep },
            '',
            window.location.href,
          );
        }
      } else {
        pushStepToHistory(currentStep);
      }
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!warnBeforeUnload) return;

      // Nur blockieren, wenn es KEINE interne Navigation war
      if (!internalNavigation.current) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome/Safari
      }
    };

    // Reset Flag nach jedem Schritt (wir sind nicht mehr im internen Navigationsmodus)
    internalNavigation.current = false;

    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [
    isEnabled,
    currentStep,
    handleNextStep,
    handlePreviousStep,
    isBackNavigationAllowed,
    warnBeforeUnload,
  ]);
}
