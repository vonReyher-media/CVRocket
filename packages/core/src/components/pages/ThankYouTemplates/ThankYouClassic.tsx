// ThankYouPages.tsx
import { animate } from '@motionone/dom';
import { CheckCircle } from 'lucide-react';
import React, { ReactNode, useEffect, useRef } from 'react';

/**
 * Shared props for all Thank You page variants.
 */
interface ThankYouPageProps {
  /** Main heading shown at the top. */
  title?: string;
  /** Supporting text displayed below the title. */
  description?: string;
  /** Optional link label for action. */
  linkText?: string;
  /** Optional href for action. If provided, renders <a>. */
  linkHref?: string;
  /** Optional ReactNode for routing links (e.g., Next.js <Link>) */
  linkComponent?: ReactNode;
}

/**
 * Simple fade-in animation on mount using motionone/dom
 */
const useFadeInAnimation = (delay = 0.1, duration = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      animate(
        ref.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration, delay },
      );
    }
  }, [delay, duration]);
  return ref;
};

/**
 * Classic Thank You Page – clean and friendly.
 */
export const ThankYouClassic: React.FC<ThankYouPageProps> = ({
  title = 'Vielen Dank für deine Angaben!',
  description = 'Deine Informationen wurden erfolgreich übermittelt. Wir melden uns bald bei dir.',
}) => {
  const ref = useFadeInAnimation();
  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-xl mx-auto"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
        {title}
      </h1>
      <p className="text-muted-foreground text-lg mb-6">{description}</p>
    </div>
  );
};

/**
 * Minimal Thank You Page – reduced design with check icon.
 */
export const ThankYouMinimal: React.FC<ThankYouPageProps> = ({
  title = 'Abgeschlossen',
  description = 'Alles erledigt. Du kannst das Fenster jetzt schließen oder zurück zur Startseite gehen.',
}) => {
  const ref = useFadeInAnimation();
  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-md mx-auto"
    >
      <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

/**
 * Personal Thank You Page – warm and conversion-focused.
 */
export const ThankYouPersonal: React.FC<ThankYouPageProps> = ({
  title = 'Geschafft! 🎉',
  description = 'Danke, dass du dir Zeit genommen hast. Wir schätzen dein Vertrauen.',
  linkText = 'Zurück zur Startseite',
  linkHref = '/',
  linkComponent,
}) => {
  const ref = useFadeInAnimation();
  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-xl mx-auto"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground text-base mb-6">{description}</p>
      {linkComponent ??
        (linkHref && linkText && (
          <a
            href={linkHref}
            className="inline-flex items-center justify-center rounded-md bg-primary text-white px-6 py-2 text-sm font-medium hover:bg-primary/90 transition"
          >
            {linkText}
          </a>
        ))}
    </div>
  );
};

/**
 * Type union to support variants dynamically.
 */
export type ThankYouVariant = 'classic' | 'minimal' | 'personal';

/**
 * ThankYouPage – Variant wrapper component.
 */
export const ThankYouPage: React.FC<
  ThankYouPageProps & { variant?: ThankYouVariant }
> = ({ variant = 'classic', ...props }) => {
  switch (variant) {
    case 'minimal':
      return <ThankYouMinimal {...props} />;
    case 'personal':
      return <ThankYouPersonal {...props} />;
    case 'classic':
    default:
      return <ThankYouClassic {...props} />;
  }
};
