'use client';
import { Button } from '@vonreyher-media/cvrocket';
import { MoreHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Drawer } from 'vaul';

export interface CVRocketFullscreenHeaderProps {
  logo?: string | ReactNode;
  brandName: string;
  logoHref?: string;
  drawerInformation?: {
    title: string;
    icon?: ReactNode;
    description?: string;
    drawerContent?: ReactNode;
  };
}

export const FullScreenHeaderLayout: React.FC<
  CVRocketFullscreenHeaderProps
> = ({ logo, logoHref = '/', brandName = 'CVRocket', drawerInformation }) => {
  const [open, setOpen] = useState(false);

  const renderLogo = () => {
    if (!logo) {
      return (
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          {brandName}
        </h1>
      );
    }

    const logoContent =
      typeof logo === 'string' ? (
        <img src={logo} alt="Logo" className="h-8 md:h-10 max-w-[150px]" />
      ) : (
        logo
      );

    return (
      <a href={logoHref} className="inline-flex items-center justify-center">
        {logoContent}
      </a>
    );
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 pt-4 md:py-5 bg-background">
      {/* <div className="w-6 h-6" /> Placeholder für linke Seite */}
      <div className="flex-1 flex justify-center">{renderLogo()}</div>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          {drawerInformation && (
            <Button size="icon" variant="outline">
              <MoreHorizontal className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            </Button>
          )}
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-white/40" />
          <Drawer.Content className="bg-background border-t p-4 rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <Drawer.Title className="text-lg font-bold mb-2">
              {drawerInformation?.title}
            </Drawer.Title>
            {drawerInformation?.description && (
              <Drawer.Description className="text-sm text-muted-foreground mb-4">
                {drawerInformation.description}
              </Drawer.Description>
            )}
            {drawerInformation?.drawerContent && (
              <div className="mb-4">{drawerInformation.drawerContent}</div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </header>
  );
};
