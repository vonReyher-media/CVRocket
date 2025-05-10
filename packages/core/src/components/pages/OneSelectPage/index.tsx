import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useCVRocket } from '../../../providers/CVRocketProvider';
import { cn } from '../../../utils/utils';
import pageHeaders, { PageHeaderProps } from '../../base/pageHeaders';
import PageHeader from '../../base/pageHeaders.tsx';
import PageTemplate, { BaseTemplateProps } from '../PageTemplate';

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
  showNextButtonOnThisPage = false,
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
        <div className={cn('gap-4 grid grid-cols-2 md:grid-cols-4', className)}>
          {children}
        </div>
      </PageTemplate>
    </OneSelectionContext.Provider>
  );
}
