import {
  useState,
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useCVRocket } from '../../../providers/CVRocketProvider';
import PageTemplate, { BaseTemplateProps } from '../PageTemplate';
import { cn } from '../../../../utils/utils';

interface SelectionContextType {
  selectedValues: Set<string>;
  toggleSelection: (value: string) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined,
);

export function useMultiSelectContext(): SelectionContextType {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('SelectionItems must be used within a MultiSelectPage');
  }
  return context;
}

interface MultiSelectPageProps extends BaseTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
  datakey: string;
  required?: number;
  className?: string;
}

export function MultiSelectPage({
  title,
  description,
  children,
  showAgb,
  agbInfo,
  showNextButtonOnThisPage,
  showBackButtonOnThisPage,
  datakey,
  required,
  className,
}: MultiSelectPageProps) {
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const { updateFormData, data } = useCVRocket();
  const minRequired = typeof required === 'number' ? required : 0;

  const toggleSelection = (value: string) => {
    const newSelection = new Set(selectedValues);
    if (newSelection.has(value)) {
      newSelection.delete(value);
    } else {
      newSelection.add(value);
    }
    setSelectedValues(newSelection);
    updateFormData({ [datakey]: Array.from(newSelection) });
  };

  useEffect(() => {
    const storedData = data[datakey];
    if (storedData) {
      setSelectedValues(new Set(storedData));
    }
  }, [datakey, data]);

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    // console.log("selectedValues", selectedValues)
    setFormValid(selectedValues.size >= minRequired);
  }, [selectedValues, minRequired, datakey]);

  return (
    <SelectionContext.Provider value={{ selectedValues, toggleSelection }}>
      <PageTemplate
        showAgb={showAgb}
        agbInfo={agbInfo}
        showBackButtonOnThisPage={showBackButtonOnThisPage}
        showNextButtonOnThisPage={showNextButtonOnThisPage}
        isFormValid={formValid}
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
        {minRequired > 0 && selectedValues.size < minRequired && (
          <p className="mt-2 text-sm text-destructive">
            Bitte wähle mindestens {minRequired}{' '}
            {minRequired === 1 ? 'Option' : 'Optionen'} aus.
          </p>
        )}
      </PageTemplate>
    </SelectionContext.Provider>
  );
}
