import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getData, getMedia } from '@/admin/cmsApi';
import { FolderKanban, FileCode2, Image as ImageIcon, LayoutTemplate, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import type { PortfolioItem, StudyCaseItem } from '@/admin/types';

export default function Dashboard() {
  const { data: portfolio } = useQuery({
    queryKey: ['data', 'portfolio'],
    queryFn: () => getData<{ items: PortfolioItem[] }>('portfolio'),
  });

  const { data: studyCases } = useQuery({
    queryKey: ['data', 'study-case'],
    queryFn: () => getData<{ items: StudyCaseItem[] }>('study-case'),
  });

  const { data: media } = useQuery({
    queryKey: ['media'],
    queryFn: getMedia,
  });

  const stats = [
    { label: 'Total Portfolio', value: portfolio?.items?.length || 0, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Study Cases', value: studyCases?.items?.length || 0, icon: FileCode2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Media Files', value: media?.length || 0, icon: ImageIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
    { 
      label: 'Live Portfolio', 
      value: portfolio?.items?.filter(i => i.published).length || 0, 
      icon: LayoutTemplate, 
      color: 'text-[#FF6B00]', 
      bg: 'bg-[#FF6B00]/10' 
    },
  ];

  const quickActions = [
    { label: 'Tambah Portfolio Baru', href: '/admin/portfolio/new', icon: FolderKanban },
    { label: 'Tambah Study Case', href: '/admin/study-case/new', icon: FileCode2 },
    { label: 'Buka Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Edit Halaman Hero', href: '/admin/hero', icon: LayoutTemplate },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111111] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Portfolio Terbaru</h3>
            <Link href="/admin/portfolio" className="text-sm text-[#FF6B00] hover:text-[#e66000] flex items-center">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            {portfolio?.items?.slice(0, 4).map((item, i) => (
              <div key={item.id} className={`p-4 flex items-center gap-4 ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                <div className="w-16 h-12 rounded-lg bg-[#0A0A0A] overflow-hidden shrink-0 border border-white/5">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{item.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{item.client} • {item.category}</p>
                </div>
                <div className="shrink-0">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                    item.published ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-400'
                  }`}>
                    {item.published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
            {(!portfolio?.items || portfolio.items.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                Belum ada portfolio.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, i) => (
              <Link 
                key={i} 
                href={action.href}
                className="flex items-center gap-3 p-4 bg-[#111111] border border-white/10 rounded-xl hover:border-[#FF6B00] hover:bg-white/[0.02] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00] transition-colors">
                  <action.icon className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B00]" />
                </div>
                <span className="font-medium text-gray-300 group-hover:text-white">{action.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-[#FF6B00]/20 to-transparent border border-[#FF6B00]/30 rounded-2xl">
            <h4 className="font-bold text-white mb-2">Siap untuk Go Live?</h4>
            <p className="text-sm text-gray-400 mb-4">Pastikan Anda mengklik "Publish ke Website" setelah mengubah konten agar perubahan terlihat di website publik.</p>
            <div className="flex items-center text-xs text-[#FF6B00] font-medium">
              Gunakan tombol di pojok kanan atas <ArrowRight className="w-3 h-3 ml-1 -rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
