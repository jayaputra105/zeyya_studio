import React, { useState } from 'react';
import { ExternalLink, Rocket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getData, publishToGitHub } from '@/admin/cmsApi';
import type { SettingsData } from '@/admin/types';
import { toast } from 'sonner';

interface HeaderProps {
  title: string;
  breadcrumb?: string;
}

export function Header({ title, breadcrumb }: HeaderProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['data', 'settings'],
    queryFn: () => getData<SettingsData>('settings'),
  });

  const handlePublish = async () => {
    if (!settings?.publishConfig?.secret) {
      toast.error('Secret GitHub belum diatur di menu Settings.');
      return;
    }
    
    try {
      setIsPublishing(true);
      const res = await publishToGitHub(settings.publishConfig.secret);
      toast.success(res.message || 'Berhasil di-publish ke GitHub! Website akan segera diperbarui.');
    } catch (err: any) {
      toast.error(err.message || 'Gagal publish ke GitHub');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-white/[0.08] bg-[#0A0A0A] sticky top-0 z-10">
      <div>
        {breadcrumb && <p className="text-[11px] font-medium text-[#FF6B00] uppercase tracking-wider mb-1">{breadcrumb}</p>}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10" asChild>
          <a href="/" target="_blank" rel="noreferrer">
            View Website
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <Button 
          onClick={handlePublish} 
          disabled={isPublishing}
          className="bg-[#FF6B00] hover:bg-[#e66000] text-white border-none shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Publish ke Website
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
