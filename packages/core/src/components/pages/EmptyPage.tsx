/**
 * @component EmptyPage
 * @description
 * `EmptyPage` ist ein flexibler Basis-Wrapper für eine einzelne Formularseite innerhalb des CVRocket-Workflows.
 *
 * Er kapselt Kinder-Elemente in einem standardisierten Layout (`PageTemplate`) und ermöglicht Steuerung von:
 * - „Weiter“-Button Sichtbarkeit
 * - „Zurück“-Button Sichtbarkeit
 * - AGB-Checkbox + Linkeinbindung
 *
 * @param {React.ReactNode} children - Inhalt der Seite (z.B. Eingabefelder, Fragen, etc.)
 * @param {boolean} [showNextButtonOnThisPage] - Ob der „Weiter“-Button auf dieser Seite angezeigt wird.
 * @param {boolean} [showBackButtonOnThisPage] - Ob der „Zurück“-Button auf dieser Seite angezeigt wird.
 * @param {boolean} [showAgb] - Ob auf dieser Seite eine AGB-/Datenschutz-Checkbox erscheinen soll.
 * @param {AgbInfo} [agbInfo] - Informationen für den AGB-Text und Links (Text und URL).
 *
 * @example
 * ```tsx
 * <EmptyPage
 *   showNextButtonOnThisPage
 *   showAgb
 *   agbInfo={{ text: "Ich stimme zu", linkText: "AGB", linkHref: "/agb" }}
 * >
 *   <MyFormFields />
 * </EmptyPage>
 * ```
 */
import { PageTemplate } from './index';

interface AgbInfo {
  text: string;
  linkText: string;
  linkHref: string;
}

interface EmptyPageProps {
  children: React.ReactNode;
  showNextButtonOnThisPage?: boolean;
  showBackButtonOnThisPage?: boolean;
  showAgb?: boolean;
  agbInfo?: AgbInfo;
  className?: string;
}

export const EmptyPage = ({
  children,
  showNextButtonOnThisPage,
  showBackButtonOnThisPage,
  showAgb,
  agbInfo,
  className,
}: EmptyPageProps) => {
  return (
    <PageTemplate
      showNextButtonOnThisPage={showNextButtonOnThisPage}
      showBackButtonOnThisPage={showBackButtonOnThisPage}
      showAgb={showAgb}
      agbInfo={agbInfo}
      className={className}
      isFormValid={true}
    >
      {children}
    </PageTemplate>
  );
};
