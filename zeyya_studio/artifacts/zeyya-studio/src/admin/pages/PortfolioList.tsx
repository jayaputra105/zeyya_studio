import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { PortfolioItem } from '@/admin/types';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, Copy, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PortfolioList() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['data', 'portfolio'],
    queryFn: () => getData<{ items: PortfolioItem[] }>('portfolio'),
  });

  const saveMutation = useMutation({
    mutationFn: (updated: { items: PortfolioItem[] }) => saveData('portfolio', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'portfolio'] });
    },
    onError: (err: any) => toast.error(err.message || 'Terjadi kesalahan'),
  });

  const handleDelete = () => {
    if (!data || !deleteId) return;
    saveMutation.mutate({ items: data.items.filter(i => i.id !== deleteId) }, {
      onSuccess: () => toast.success('Portfolio berhasil dihapus')
    });
  };

  const handleDuplicate = (item: PortfolioItem) => {
    if (!data) return;
    const newItem = {
      ...item,
      id: `port-${Date.now()}`,
      slug: `${item.slug}-copy`,
      title: `${item.title} (Copy)`,
      published: false,
      featured: false
    };
    saveMutation.mutate({ items: [newItem, ...data.items] }, {
      onSuccess: () => toast.success('Portfolio berhasil diduplikasi')
    });
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  const items = data?.items || [];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Portfolio</h2>
        <Button asChild className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          <Link href="/admin/portfolio/new">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Portfolio
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Belum ada portfolio</h3>
          <p className="text-sm text-gray-400 mb-6">Mulai tambahkan hasil karya atau project Anda untuk ditampilkan di website.</p>
          <Button asChild className="bg-white/10 hover:bg-white/20 text-white rounded-xl">
            <Link href="/admin/portfolio/new">Buat Portfolio Pertama</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-white/5">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                <div className="w-24 h-16 bg-[#0A0A0A] rounded-lg border border-white/10 overflow-hidden shrink-0">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white truncate text-base">{item.title}</h3>
                    {item.published ? <StatusBadge type="published" /> : <StatusBadge type="draft" />}
                    {item.featured && <StatusBadge type="featured" />}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {item.client} • {item.category} • {item.year}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-gray-500 font-mono mb-1">{item.slug}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(item)} className="h-8 w-8 text-gray-400 hover:text-white" title="Duplikasi">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" title="Edit">
                      <Link href={`/admin/portfolio/${item.id}`}><Edit className="w-4 h-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Portfolio?"
        description="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
      />
    </div>
  );
}
