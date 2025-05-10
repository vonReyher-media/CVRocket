import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  Children,
  cloneElement,
  isValidElement,
} from 'react';

import { useCVRocket } from '../../../providers/CVRocketProvider';
import { cn } from '../../../utils/utils';
import pageHeaders, { PageHeaderProps } from '../../base/pageHeaders';
import PageHeader from '../../base/pageHeaders.tsx';
import PageTemplate, { BaseTemplateProps } from '../PageTemplate';
import { TypingText, type TypingTextProps } from '../../base/typing_alert';

interface OneSelectionContextType {
  selectedValue: string | null;
  selectValue: (value: string) => void;
}

const OneSelectionContext = createContext<OneSelectionContextType | undefined>(
  undefined,
);

/**
 * Hook to access the OneSelectPage selection context.
 */
export function useOneSelectContext(): OneSelectionContextType {
  const context = useContext(OneSelectionContext);
  if (!context) {
    throw new Error('OneSelectionItem must be used within OneSelectPage.');
  }
  return context;
}

interface OneSelectPageProps extends BaseTemplateProps {
  header?: PageHeaderProps;
  children: ReactNode;
  datakey: string;
}

/**
 * OneSelectPage – Single-selection page with auto-navigation and optional AGB check.
 */
export function OneSelectPage({
  header,
  children,
  datakey,
  showBackButtonOnThisPage = true,
  showNextButtonOnThisPage: initialShowNextButton = false,
  showAgb,
  agbInfo,
  className,
}: OneSelectPageProps) {
  const {
    updateFormData,
    data,
    currentStep,
    totalSteps,
    currentPageConfig,
    setCurrentPageConfig,
  } = useCVRocket();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [wasManuallySelected, setWasManuallySelected] = useState(false);
  const [animatedTextProps, setAnimatedTextProps] = useState<
    (Omit<TypingTextProps, 'icon'> & { icon?: ReactNode }) | null
  >(null);
  const [hasAnimatedItems, setHasAnimatedItems] = useState(false);
  const [showNextButtonOnThisPage, setShowNextButtonOnThisPage] = useState(
    initialShowNextButton,
  );

  // Check if any child has animated_description_text
  useEffect(() => {
    const hasAnimated = Children.toArray(children).some(
      (child) =>
        isValidElement(child) &&
        'animated_description_text' in child.props &&
        child.props.animated_description_text,
    );
    setHasAnimatedItems(hasAnimated);
    if (hasAnimated) {
      setShowNextButtonOnThisPage(true);
    }
  }, [children]);

  // Restore selection from data
  useEffect(() => {
    const storedValue = data[datakey];
    if (typeof storedValue === 'string') {
      setSelectedValue(storedValue);
    } else {
      setSelectedValue(null);
    }
  }, [datakey, data]);

  // Update form data and selection
  const selectValue = (value: string) => {
    setWasManuallySelected(true);
    setSelectedValue(value);
    updateFormData({ [datakey]: value });

    // Find and set animated text props for selected item
    const selectedChild = Children.toArray(children).find(
      (child) =>
        isValidElement(child) &&
        child.props.value === value &&
        'animated_description_text' in child.props,
    );

    if (selectedChild && isValidElement(selectedChild)) {
      const props = selectedChild.props.animated_description_text;
      if (props) {
        // Extract icon from props and pass it separately
        const { icon, ...restProps } = props;
        setAnimatedTextProps({
          ...restProps,
          icon: icon as ReactNode,
        });
      } else {
        setAnimatedTextProps(null);
      }
    } else {
      setAnimatedTextProps(null);
    }
  };

  // Auto-advance to next step if form is valid and AGB accepted
  useEffect(() => {
    if (
      !selectedValue ||
      currentStep === totalSteps - 1 ||
      !wasManuallySelected ||
      showNextButtonOnThisPage
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
    selectedValue,
    wasManuallySelected,
    showAgb,
    currentPageConfig,
    data,
    currentStep,
    totalSteps,
    showNextButtonOnThisPage,
  ]);

  const isFormValid = Boolean(selectedValue);

  return (
    <OneSelectionContext.Provider value={{ selectedValue, selectValue }}>
      <PageTemplate
        showAgb={showAgb}
        agbInfo={agbInfo}
        showNextButtonOnThisPage={showNextButtonOnThisPage}
        showBackButtonOnThisPage={showBackButtonOnThisPage}
        isFormValid={isFormValid}
      >
        {header && <PageHeader {...header} />}

        {hasAnimatedItems && animatedTextProps && (
          <div className="mb-6">
            <TypingText {...animatedTextProps} />
          </div>
        )}

        <div className={cn('gap-4 grid grid-cols-2 md:grid-cols-4', className)}>
          {children}
        </div>
      </PageTemplate>
    </OneSelectionContext.Provider>
  );
}
