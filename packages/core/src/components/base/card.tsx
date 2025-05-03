import * as React from 'react';

/**
 * Eine wiederverwendbare Card-Komponente mit optionaler Auswahlfunktion und Icon.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML-Div-Attribute
 * @param {boolean} [isSelected] - Gibt an, ob die Karte ausgewählt ist
 * @param {React.ReactNode} [icon] - Optionales Icon, das über dem Inhalt angezeigt wird
 * @returns {JSX.Element} Eine Card-Komponente mit optionaler Auswahlfunktion und Icon
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isSelected?: boolean;
    icon?: React.ReactNode;
  }
>(({ className, isSelected, icon, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={
        'relative flex flex-col p-6 border rounded-lg transition-all cursor-pointer ' +
        'hover:border-primary hover:bg-accent/50 ' +
        (isSelected
          ? 'border-primary bg-accent/50 ring-2 ring-primary/20 '
          : 'border-border ') +
        className
      }
      {...props}
    >
      {icon && <div className="mb-4 text-primary">{icon}</div>}
      {children}
      {isSelected && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-background rounded-full" />
        </div>
      )}
    </div>
  );
});
Card.displayName = 'Card';

export { Card };
