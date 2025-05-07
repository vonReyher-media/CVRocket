import { animate } from '@motionone/dom';
import { useEffect, useRef, useState } from 'react';

import { useCVRocket } from '../../providers/CVRocketProvider';
import { EnhancedSlider } from '../base/enhanced-slider.tsx';
import PageHeader, { PageHeaderProps } from '../base/pageHeaders.tsx';
import { PageTemplate } from './index.ts';
import { BaseTemplateProps } from './PageTemplate.tsx';

interface SliderSelectPageProps extends BaseTemplateProps {
  title: string;
  description?: string;
  datakey: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  showValueLabel?: boolean;
  autoAdvance?: boolean;
  header: PageHeaderProps;
}

/**
 * SliderSelectPage – A modern page with a single slider selection that optionally auto-advances.
 */
export function SliderSelectPage({
  title,
  description,
  datakey,
  min,
  max,
  step = 1,
  unit = '',
  prefix = '',
  suffix = '',
  showValueLabel = true,
  showAgb,
  agbInfo,
  showBackButtonOnThisPage = true,
  showNextButtonOnThisPage = true,
  autoAdvance = false,
  className,
  header,
}: SliderSelectPageProps) {
  const { updateFormData, data, currentStep, totalSteps, currentPageConfig } =
    useCVRocket();

  const [value, setValue] = useState<number | null>(null);
  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);
  const valueDisplayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Restore previously selected value
  useEffect(() => {
    const storedValue = data[datakey];
    if (typeof storedValue === 'number') {
      setValue(storedValue);
    } else {
      // Default to middle value if nothing is set
      setValue(Math.floor(min + (max - min) / 2));
    }
  }, [datakey, data, min, max]);

  // Reset manual change flag on step change
  useEffect(() => {
    setWasManuallyChanged(false);
  }, [currentStep]);

  // Handle slider change (only called when user finishes changing)
  const handleChange = (val: number) => {
    setValue(val);
    updateFormData({ [datakey]: val });
    setWasManuallyChanged(true);

    // Animate value display when it changes
    if (valueDisplayRef.current) {
      animate(
        valueDisplayRef.current,
        { opacity: [0.5, 1], y: [-10, 0] },
        { duration: 0.3, easing: [0.16, 1, 0.3, 1] },
      );
    }
  };

  // Handle slider value update during dragging (for visual feedback only)
  const handleDrag = (val: number) => {
    setValue(val);

    // Update progress bar during drag for visual feedback
    if (progressBarRef.current) {
      const percentage = ((val - min) / (max - min)) * 100;
      progressBarRef.current.style.width = `${percentage}%`;
    }
  };

  const isFormValid = typeof value === 'number';

  // Auto-advance if valid + AGB accepted
  useEffect(() => {
    if (
      !autoAdvance ||
      !wasManuallyChanged ||
      !isFormValid ||
      currentStep === totalSteps - 1
    )
      return;

    const acceptedAGB =
      !showAgb || data[`agb_accepted_page_${currentStep}`] === true;

    if (acceptedAGB) {
      const timeout = setTimeout(() => {
        currentPageConfig.goToNextStep?.();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [
    autoAdvance,
    value,
    wasManuallyChanged,
    showAgb,
    data,
    currentStep,
    totalSteps,
    currentPageConfig,
    isFormValid,
  ]);

  // // Set up animations when component mounts
  // useEffect(() => {
  //     // Animate in the component
  //     inView(".slider-page-content", ({ target }) => {
  //         animate(target, { opacity: [0, 1], y: [20, 0] }, { delay: 0.1, duration: 0.5, easing: [0.16, 1, 0.3, 1] })
  //         return false; // Stop observing after first animation
  //     })
  // }, [])

  // Calculate percentage for visual indicators
  // const percentage = value !== null ? ((value - min) / (max - min)) * 100 : 50

  // Format the displayed value with prefix/suffix
  const formattedValue =
    value !== null
      ? `${prefix}${value}${unit}${suffix}`
      : `${prefix}${min}${unit}${suffix}`;

  return (
    <PageTemplate
      showAgb={showAgb}
      agbInfo={agbInfo}
      showNextButtonOnThisPage={showNextButtonOnThisPage}
      showBackButtonOnThisPage={showBackButtonOnThisPage}
      isFormValid={isFormValid}
    >
      <PageHeader {...header} />
      <div className="slider-page-content w-full">
        <div className={`w-full flex flex-col items-center ${className ?? ''}`}>
          {showValueLabel && typeof value === 'number' && (
            <div className="mb-8 text-center">
              <div
                ref={valueDisplayRef}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formattedValue}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Selected Value
              </div>
            </div>
          )}

          <div className="w-full max-w-xl px-4 md:px-0">
            {/*<div className="relative mb-2">*/}
            {/*    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full">*/}
            {/*        <div*/}
            {/*            ref={progressBarRef}*/}
            {/*            className="h-full bg-primary rounded-full"*/}
            {/*            style={{ width: `${percentage}%` }}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <EnhancedSlider
              min={min}
              max={max}
              step={step}
              value={value ?? min}
              onChange={handleChange}
              onDrag={handleDrag}
            />

            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>
                {prefix}
                {min}
                {unit}
                {suffix}
              </span>
              <span>
                {prefix}
                {max}
                {unit}
                {suffix}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
