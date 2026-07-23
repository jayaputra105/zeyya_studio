import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, FolderKanban, FileCode2, Image as ImageIcon, 
  Home, User, Blocks, Tags, HelpCircle, MessageSquareQuote, 
  Search, Navigation, Share2, Settings, LogOut, Code2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminLogout } from '@/admin/cmsApi';

export function Sidebar() {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    adminLogout();
    setLocation('/admin/login');
  };

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href || (href !== '/admin' && location.startsWith(href));
    return (
      <Link href={href} className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-2",
        isActive 
          ? "bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]" 
          : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
      )}>
        <Icon className={cn("w-4 h-4", isActive ? "text-[#FF6B00]" : "text-gray-400")} />
        {label}
      </Link>
    );
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-[#0D0D0D] border-r border-white/[0.08] flex flex-col h-[100dvh] sticky top-0">
      <div className="p-6 flex items-center gap-3 shrink-0 border-b border-white/[0.08]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#e66000] flex items-center justify-center">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white leading-none">Zeyya Studio</h1>
          <span className="text-[10px] text-[#FF6B00] font-medium tracking-wide uppercase">CMS Admin</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <NavLink href="/admin" icon={LayoutDashboard} label="Dashboard" />
        <div className="h-4" />
        
        <Section title="Portfolio & Konten">
          <NavLink href="/admin/portfolio" icon={FolderKanban} label="Portfolio" />
          <NavLink href="/admin/study-case" icon={FileCode2} label="Study Case" />
        </Section>

        <Section title="Media">
          <NavLink href="/admin/media" icon={ImageIcon} label="Media Library" />
        </Section>

        <Section title="Website">
          <NavLink href="/admin/hero" icon={Home} label="Hero" />
          <NavLink href="/admin/about" icon={User} label="About" />
          <NavLink href="/admin/services" icon={Blocks} label="Services" />
          <NavLink href="/admin/pricing" icon={Tags} label="Pricing" />
          <NavLink href="/admin/faq" icon={HelpCircle} label="FAQ" />
          <NavLink href="/admin/testimonials" icon={MessageSquareQuote} label="Testimonials" />
        </Section>

        <Section title="Pengaturan">
          <NavLink href="/admin/seo" icon={Search} label="SEO" />
          <NavLink href="/admin/navigation" icon={Navigation} label="Navigation" />
          <NavLink href="/admin/social" icon={Share2} label="Social Media" />
          <NavLink href="/admin/settings" icon={Settings} label="Settings" />
        </Section>
      </div>

      <div className="p-4 border-t border-white/[0.08] shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
