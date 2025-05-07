import { animate } from '@motionone/dom';
import { FC, useCallback, useMemo, useRef } from 'react';

import { cn } from '../../utils/utils.ts';
import { useCVRocket } from '../providers/CVRocketProvider';
import { useToast } from '../providers/ToastProvider.tsx';
import { Button } from './base/button';

export interface ButtonFooterProps {
  currentStep: number;
  totalSteps: number;
}

export const ButtonFooter: FC<ButtonFooterProps> = ({
  currentStep,
  totalSteps,
}) => {
  const {
    submitForm,
    currentPageConfig,
    goToNextStep,
    goToPreviousStep,
    data,
  } = useCVRocket();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const { showToast } = useToast();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  console.log(currentPageConfig);

  const agbRequired = currentPageConfig?.agbRequired === true;
  const agbAccepted = data[`agb_accepted_page_${currentStep}`] === true;
  const isFormValid = currentPageConfig?.isFormValid ?? false;

  const isStepValid = useMemo(() => {
    return agbRequired ? agbAccepted && isFormValid : isFormValid;
  }, [agbRequired, agbAccepted, isFormValid]);

  const handleNext = useCallback(() => {
    if (!isStepValid) {
      const errorMessage =
        agbRequired && !agbAccepted && !isFormValid
          ? 'Bitte akzeptiere die AGB und fülle alle Pflichtfelder aus.'
          : agbRequired && !agbAccepted
            ? 'Bitte akzeptiere die AGB.'
            : 'Bitte fülle alle Pflichtfelder aus.';

      showToast(errorMessage);

      if (buttonRef.current) {
        animate(
          buttonRef.current,
          { x: [-10, 10, -6, 6, -2, 2, 0] },
          { duration: 0.6 },
        );
      }

      return;
    }

    if (isLastStep) {
      submitForm();
    } else {
      if (currentPageConfig?.goToNextStep) {
        currentPageConfig.goToNextStep();
      } else {
        goToNextStep();
      }
    }
  }, [
    agbRequired,
    agbAccepted,
    isFormValid,
    isStepValid,
    isLastStep,
    currentPageConfig,
    goToNextStep,
    showToast,
    submitForm,
  ]);

  const handlePrevious = useCallback(() => {
    try {
      if (currentPageConfig?.goToPreviousStep) {
        currentPageConfig.goToPreviousStep();
      } else {
        goToPreviousStep();
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [currentPageConfig, goToPreviousStep]);

  return (
    <div className="flex flex-col items-end gap-2 pt-6 sm:flex-row sm:justify-between sm:items-center">
      {!isFirstStep && currentPageConfig?.showBackButton && (
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="sm:ml-0 sm:w-auto w-full"
        >
          Zurück
        </Button>
      )}

      {(currentPageConfig?.showNextButton || isLastStep) && (
        <Button
          ref={buttonRef}
          onClick={handleNext}
          className={cn(
            'ml-auto sm:w-auto w-full transition-opacity',
            !isStepValid && 'opacity-50 pointer-events-auto',
          )}
          variant="default"
        >
          {isLastStep ? 'Absenden' : 'Weiter'}
        </Button>
      )}
    </div>
  );
};
