import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z, ZodSchema } from 'zod';

import { useCVRocket } from '../../../providers/CVRocketProvider';
import PageHeader, { PageHeaderProps } from '../../base/pageHeaders.tsx';
import { PageTemplate } from '../index.ts';
import { BaseTemplateProps } from '../PageTemplate.tsx';

interface UniversalFormPageProps extends BaseTemplateProps {
  header?: PageHeaderProps;
  datakey: string;
  zodSchema: ZodSchema;
  children: React.ReactNode;
  className?: string;
}

/**
 * UniversalFormPage – A responsive, validated form page with CVRocket integration.
 */
export function UniversalFormPage({
  header,
  datakey,
  zodSchema,
  showAgb,
  agbInfo,
  showNextButtonOnThisPage,
  showBackButtonOnThisPage,
  children,
  className,
}: UniversalFormPageProps) {
  const { updateFormData, data } = useCVRocket();

  const defaultValues = data[datakey] ?? {};
  const form = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { isValid } = form.formState;
  const { watch } = form;

  // Sync form data on change
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData({ [datakey]: value });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData, datakey]);

  return (
    <FormProvider {...form}>
      <PageTemplate
        showAgb={showAgb}
        agbInfo={agbInfo}
        showNextButtonOnThisPage={showNextButtonOnThisPage}
        showBackButtonOnThisPage={showBackButtonOnThisPage}
        isFormValid={isValid}
      >
        {header && <PageHeader {...header} />}
        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${className}`}>
          {children}
        </div>
      </PageTemplate>
    </FormProvider>
  );
}
