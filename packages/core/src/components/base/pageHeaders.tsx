import { Button } from '@vonreyher-media/cvrocket';
import { ShieldQuestionIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Drawer } from 'vaul';

import { cn } from '../../../utils/utils.ts';

export interface PageHeaderProps {
  title: string;
  description: string;
  information?: {
    title: string;
    icon?: React.ReactNode;
    description?: string;
    drawerContent?: React.ReactNode;
  };
  text_alignment?: 'center' | 'left';
  width?: 'full' | 'boxed';
}

const PageHeader = ({
  title,
  description,
  information,
  width = 'boxed',
  text_alignment = 'left',
}: PageHeaderProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkIsMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div
      className={cn(
        'w-full my-6 md:my-10',
        'flex flex-col md:flex-row items-start md:items-center gap-4',
        text_alignment === 'center'
          ? 'text-center md:justify-center'
          : 'text-left',
      )}
    >
      <div
        className={cn(
          'flex-1',
          text_alignment === 'center' ? 'flex flex-col items-center' : '',
        )}
      >
        <h1 className={cn('text-3xl lg:text-4xl font-bold text-foreground')}>
          {title}
        </h1>
        <p
          className={cn(
            'text-sm text-foreground/70 mt-2 md:mt-3',
            width === 'boxed'
              ? 'max-w-full md:max-w-xl lg:max-w-2xl'
              : 'w-full',
          )}
        >
          {description}
        </p>
      </div>

      {information && (
        <Drawer.Root
          direction={isMobile ? 'bottom' : 'right'}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <Drawer.Trigger asChild>
            <Button
              size={'sm'}
              variant={'outline'}
              className="mt-2 md:mt-0 shrink-0 relative flex h-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm transition-all hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A19]"
            >
              {information.icon ? (
                information.icon
              ) : (
                <ShieldQuestionIcon className="text-foreground/60" />
              )}
            </Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40 dark:bg-white/40 backdrop-blur-sm" />
            {isMobile ? (
              <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-auto min-h-1/3 mt-24 fixed bottom-0 left-0 right-0 z-50">
                <div className="p-4 rounded-t-[10px] flex-1 overflow-auto">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
                  <div className="max-w-md mx-auto">
                    <Drawer.Title className="text-3xl font-bold mb-4 text-foreground">
                      {information.title}
                    </Drawer.Title>
                    {information.description && (
                      <Drawer.Description className="text-muted-foreground">
                        {information.description}
                      </Drawer.Description>
                    )}
                    {information.drawerContent && (
                      <div className="mt-4">{information.drawerContent}</div>
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-muted bg-background">
                  <Button className="w-full" onClick={() => setIsOpen(false)}>
                    Schließen
                  </Button>
                </div>
              </Drawer.Content>
            ) : (
              <Drawer.Content
                className="right-2 top-2 bottom-2 fixed z-50 outline-none w-[380px] flex"
                style={
                  {
                    '--initial-transform': 'calc(100% + 8px)',
                  } as React.CSSProperties
                }
              >
                <div className="bg-background h-full w-full grow p-5 flex flex-col rounded-[16px]">
                  <div className="flex-1 overflow-auto">
                    <div className="max-w-md mx-auto">
                      <Drawer.Title className="font-medium mb-4 text-3xl text-foreground">
                        {information.title}
                      </Drawer.Title>
                      {information.description && (
                        <Drawer.Description className="text-muted-foreground">
                          {information.description}
                        </Drawer.Description>
                      )}
                      {information.drawerContent && (
                        <div className="mt-4">{information.drawerContent}</div>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-muted bg-background">
                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                      Schließen
                    </Button>
                  </div>
                </div>
              </Drawer.Content>
            )}
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  );
};

export default PageHeader;
