import { useState } from 'react';
import { Info, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PORTAL_ASSETS, PORTAL_TEXT } from '@/constants/portal';
import { AboutDialog } from './AboutDialog';

export const PortalHeader = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <header className="relative z-20 h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 overflow-hidden flex items-center justify-center">
            <img
              src={PORTAL_ASSETS.saiboLogo}
              alt="Prism Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {PORTAL_TEXT.brand.name}
            </h1>
            <p className="text-xs text-muted-foreground">{PORTAL_TEXT.brand.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500">{PORTAL_TEXT.status.engineOnline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-blue-500" />
            <span className="text-blue-500">{PORTAL_TEXT.status.encryptedTransfer}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="border border-primary/20 hover:border-primary/40 hover:bg-primary/10">
              <Info className="w-4 h-4 mr-2" />
              关于棱镜
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-primary/20 bg-background/95 backdrop-blur-xl overflow-hidden">
            <AboutDialog />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};
