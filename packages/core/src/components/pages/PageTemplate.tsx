import { animate } from '@motionone/dom';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useCVRocket } from '../../providers/CVRocketProvider';
import { deepEqual } from '../../utils/deepEqual';
import { cn } from '../../utils/utils';
import { CheckboxWithLabel, Progress } from '../base';

/**
 * Information for the optional AGB (terms) checkbox.
 */
interface AgbInfo {
  text: string;
  linkText: string;
  linkHref: string;
}

/**
 * Base props shared across wrapper components that compose PageTemplate.
 */
export interface BaseTemplateProps {
  /**
   * Here you can enable a checkbox for the AGB (terms) and conditions.
   * This is optional and can be used in any page.
   * @default false
   */
  showAgb?: boolean;
  /**
   * Information for the AGB checkbox.
   * This is optional and can be used in any page.
   * It should be in the following format:
   *   @example {
   *       text: 'I accept the Terms and Conditions',
   *       linkText: 'Read more',
   *       linkHref: '#',
   *   }
   */
  agbInfo?: AgbInfo;
  /**
   * Indicates whether the next button should be shown on this page.
   * @default true
   */
  showNextButtonOnThisPage?: boolean;
  /**
   * Indicates whether the back button should be shown on this page.
   * @default true
   */
  showBackButtonOnThisPage?: boolean;
  /**
   * Additional class names to apply to the page template.
   */
  className?: string;
  /**
   * Duration of the transition animation (in milliseconds).
   * @default 400
   */
  animationDuration?: number;
  /**
   * Optional condition that determines whether the page content should be rendered.
   * Can be a boolean value or a function that returns a boolean.
   * If not provided, the page will always render.
   */
  renderCondition?: boolean | ((data: FormData) => boolean);
}

/**
 * Props used specifically by the PageTemplate component.
 */
export interface PageTemplateProps extends BaseTemplateProps {
  /**
   * The content rendered inside the page template.
   */
  children: React.ReactNode;

  /**
   * Indicates whether the form on this page is valid.
   * This will be passed into the global currentPageConfig state.
   * @default true
   */
  isFormValid?: boolean;
}

type PageConfigRef = {
  showNextButton: boolean;
  showBackButton: boolean;
  agbRequired: boolean;
  isFormValid: boolean;
  goToNextStep?: () => void | Promise<void>;
  goToPreviousStep?: () => void | Promise<void>;
};

/**
 * PageTemplate provides layout and behavior for a single step in the CVRocket flow.
 * It handles animations, AGB checkbox logic, and updates global navigation config.
 */
const PageTemplate = ({
  children,
  showNextButtonOnThisPage = true,
  showBackButtonOnThisPage = true,
  showAgb = false,
  agbInfo,
  className,
  isFormValid = true,
  animationDuration = 400,
}: PageTemplateProps) => {
  const {
    currentStep,
    totalSteps,
    setCurrentPageConfig,
    updateFormData,
    data,
    goToNextStep: originalGoToNextStep,
    goToPreviousStep: originalGoToPreviousStep,
  } = useCVRocket();

  const contentRef = useRef<HTMLDivElement>(null);
  const agbRef = useRef<HTMLDivElement>(null);
  const [isAgbAccepted, setIsAgbAccepted] = useState<boolean>(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showAgbError, setShowAgbError] = useState(false);

  // Load AGB checkbox state from shared form data
  useEffect(() => {
    const agbAccepted = data[`agb_accepted_page_${currentStep}`] === true;
    setIsAgbAccepted(agbAccepted);
    setShowAgbError(false);
  }, [currentStep, data]);

  // Navigate forward with exit animation
  const goToNextStep = useCallback(async () => {
    if (showAgb && !isAgbAccepted) {
      setShowAgbError(true);
      if (agbRef.current) {
        await animate(
          agbRef.current,
          { x: [0, -5, 5, -5, 5, 0] },
          { duration: 0.5, easing: 'ease-in-out' },
        );
      }
      return;
    }

    setDirection('forward');
    setIsAnimatingOut(true);

    if (contentRef.current) {
      await animate(
        contentRef.current,
        { opacity: [1, 0], x: [0, -20] },
        { duration: animationDuration },
      );
    }
    if (agbRef.current) {
      await animate(
        agbRef.current,
        { opacity: [1, 0], x: [0, -20] },
        { duration: animationDuration },
      );
    }

    originalGoToNextStep();
    setIsAnimatingOut(false);
  }, [originalGoToNextStep, animationDuration, showAgb, isAgbAccepted, agbRef]);

  // Navigate backward with exit animation
  const goToPreviousStep = useCallback(async () => {
    setDirection('backward');
    setIsAnimatingOut(true);

    if (contentRef.current) {
      await animate(
        contentRef.current,
        { opacity: [1, 0], x: [0, 20] },
        { duration: animationDuration },
      );
    }
    if (agbRef.current) {
      await animate(
        agbRef.current,
        { opacity: [1, 0], x: [0, 20] },
        { duration: animationDuration },
      );
    }

    originalGoToPreviousStep();
    setIsAnimatingOut(false);
  }, [originalGoToPreviousStep, animationDuration]);

  // Update current page config on relevant changes
  const lastConfigRef = useRef<PageConfigRef | null>(null);

  useEffect(() => {
    const newConfig = {
      showNextButton: showNextButtonOnThisPage,
      showBackButton: showBackButtonOnThisPage,
      agbRequired: showAgb,
      isFormValid,
      goToNextStep,
      goToPreviousStep,
    };

    console.log('PageTemplate - newConfig:', newConfig);
    console.log('PageTemplate - lastConfig:', lastConfigRef.current);

    if (!deepEqual(lastConfigRef.current, newConfig)) {
      console.log('PageTemplate - Config changed, updating...');
      lastConfigRef.current = newConfig;
      setCurrentPageConfig(newConfig);
    } else {
      console.log('PageTemplate - Config unchanged');
    }
  }, [
    setCurrentPageConfig,
    showAgb,
    isFormValid,
    goToNextStep,
    goToPreviousStep,
    showNextButtonOnThisPage,
    showBackButtonOnThisPage,
    currentStep,
  ]);

  // Animate content entry when step changes
  useEffect(() => {
    if (isAnimatingOut) return;

    const elements = [contentRef.current, agbRef.current].filter(Boolean);

    const animations = elements.map((el, i) =>
      el
        ? animate(
            el,
            {
              opacity: [0, 1],
              x: [direction === 'forward' ? 20 : -20, 0],
            },
            {
              duration: 0.4,
              delay: i * 0.1,
            },
          )
        : null,
    );

    return () => animations.forEach((a) => a?.stop());
  }, [currentStep, direction, isAnimatingOut]);

  // Handle AGB checkbox updates
  const handleAgbChange = (checked: boolean) => {
    setIsAgbAccepted(checked);
    setShowAgbError(false);
    updateFormData({ [`agb_accepted_page_${currentStep}`]: checked });
  };

  return (
    <div className="overflow-hidden py-3">
      <Progress current={currentStep + 1} total={totalSteps} />

      <div ref={contentRef} className={cn('relative px-2', className)}>
        {children}

        {showAgb && (
          <div ref={agbRef} className="mt-4 relative w-full">
            <CheckboxWithLabel
              id={`agb${currentStep}`}
              checked={isAgbAccepted}
              onCheckedChange={handleAgbChange}
              label={agbInfo?.text || 'I accept the Terms and Conditions'}
              linkHref={agbInfo?.linkHref}
              linkText={agbInfo?.linkText}
              error={
                showAgbError
                  ? 'Bitte akzeptieren Sie die AGBs, um fortzufahren.'
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTemplate;
