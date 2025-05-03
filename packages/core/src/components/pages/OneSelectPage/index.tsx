import {
  useState,
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useCVRocket } from '../../../providers/CVRocketProvider';
import { cn } from '../../../../utils/utils';
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
  title: string;
  description?: string;
  children: ReactNode;
  datakey: string;
}

/**
 * OneSelectPage – Single-selection page with auto-navigation and optional AGB check.
 */
export function OneSelectPage({
  title,
  description,
  children,
  datakey,
  showBackButtonOnThisPage,
  showNextButtonOnThisPage = false,
  showAgb,
  agbInfo,
  className,
}: OneSelectPageProps) {
  const { updateFormData, data, currentStep, totalSteps, currentPageConfig } =
    useCVRocket();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [wasManuallySelected, setWasManuallySelected] = useState(false);

  // Restore selection from data
  useEffect(() => {
    const storedValue = data[datakey];
    if (storedValue) {
      setSelectedValue(storedValue);
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
      !wasManuallySelected
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div
          className={cn(
            'gap-4',
            className || 'grid grid-cols-2 md:grid-cols-3',
          )}
        >
          {children}
        </div>
      </PageTemplate>
    </OneSelectionContext.Provider>
  );
}
