import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { StudyCaseItem, PortfolioItem } from '@/admin/types';
import { useRoute, useLocation } from 'wouter';
import { FormField } from '../components/FormField';
import { TagInput } from '../components/TagInput';
import { SortableList } from '../components/SortableList';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function StudyCaseForm() {
  const [match, params] = useRoute('/admin/study-case/:id');
  const id = params?.id;
  const isNew = id === 'new' || !id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [item, setItem] = useState<Partial<StudyCaseItem>>({
    id: `sc-${Date.now()}`, portfolioId: '', slug: '', judul: '', client: '', industry: '',
    problem: '', solution: '', result: '', process: [], technology: [], gallery: [],
    published: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  });

  const { data, isLoading } = useQuery({
    queryKey: ['data', 'study-case'],
    queryFn: () => getData<{ items: StudyCaseItem[] }>('study-case'),
  });

  const { data: portfolio } = useQuery({
    queryKey: ['data', 'portfolio'],
    queryFn: () => getData<{ items: PortfolioItem[] }>('portfolio'),
  });

  useEffect(() => {
    if (!isNew && data?.items) {
      const existing = data.items.find(i => i.id === id);
      if (existing) setItem(existing);
      else { toast.error('Study Case tidak ditemukan'); setLocation('/admin/study-case'); }
    }
  }, [id, isNew, data, setLocation]);

  const saveMutation = useMutation({
    mutationFn: (updated: { items: StudyCaseItem[] }) => saveData('study-case', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'study-case'] });
      toast.success('Study Case berhasil disimpan');
      setLocation('/admin/study-case');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (!item.judul || !item.slug || !item.portfolioId) {
      toast.error('Judul, Slug, dan Portfolio terkait wajib diisi');
      return;
    }
    const currentItems = data?.items || [];
    const finalItem = { ...item, updatedAt: new Date().toISOString() } as StudyCaseItem;
    // fix process steps order
    finalItem.process = finalItem.process.map((p, idx) => ({ ...p, step: idx + 1 }));
    
    let newItems;
    if (isNew) {
      if (currentItems.some(i => i.slug === finalItem.slug)) {
        toast.error('Slug sudah digunakan'); return;
      }
      newItems = [finalItem, ...currentItems];
    } else {
      newItems = currentItems.map(i => i.id === finalItem.id ? finalItem : i);
    }
    saveMutation.mutate({ items: newItems });
  };

  const generateSlug = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  const pfItems = portfolio?.items || [];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white rounded-full">
            <Link href="/admin/study-case"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h2 className="text-xl font-bold text-white">{isNew ? 'Tambah Study Case' : 'Edit Study Case'}</h2>
        </div>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Informasi Utama</h3>
            
            <FormField label="Terkait dengan Portfolio" required>
              <select
                value={item.portfolioId || ''}
                onChange={(e) => setItem({ ...item, portfolioId: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF6B00]"
              >
                <option value="" disabled>-- Pilih Portfolio --</option>
                {pfItems.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Judul Artikel Study Case" required>
              <input
                value={item.judul || ''}
                onChange={(e) => {
                  const judul = e.target.value;
                  setItem(prev => ({ ...prev, judul, slug: isNew ? generateSlug(judul) : prev.slug }));
                }}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#FF6B00]"
              />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Slug (URL)" required>
                <input
                  value={item.slug || ''}
                  onChange={(e) => setItem({ ...item, slug: generateSlug(e.target.value) })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 font-mono outline-none"
                />
              </FormField>
              <FormField label="Industri Klien">
                <input
                  value={item.industry || ''}
                  onChange={(e) => setItem({ ...item, industry: e.target.value })}
                  placeholder="misal: F&B, Edukasi..."
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                />
              </FormField>
            </div>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Cerita (The Story)</h3>
            <FormField label="The Problem (Masalah)">
              <textarea
                value={item.problem || ''}
                onChange={(e) => setItem({ ...item, problem: e.target.value })}
                rows={4}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </FormField>
            <FormField label="The Solution (Solusi)">
              <textarea
                value={item.solution || ''}
                onChange={(e) => setItem({ ...item, solution: e.target.value })}
                rows={4}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </FormField>
            <FormField label="The Result (Hasil / Impact)">
              <textarea
                value={item.result || ''}
                onChange={(e) => setItem({ ...item, result: e.target.value })}
                rows={4}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </FormField>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <h3 className="font-bold text-white">Proses Pengerjaan (Timeline)</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setItem({ ...item, process: [...(item.process || []), { step: (item.process?.length || 0) + 1, title: '', description: '' }] })}
                className="h-8 text-xs border-white/10"
              >
                <Plus className="w-3 h-3 mr-1" /> Tambah Step
              </Button>
            </div>
            <SortableList
              items={item.process || []}
              onReorder={(newItems) => setItem({ ...item, process: newItems })}
              onDelete={(idx) => setItem({ ...item, process: item.process?.filter((_, i) => i !== idx) })}
              renderItem={(step, idx) => (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                      {idx + 1}
                    </div>
                    <input
                      placeholder="Judul Step (misal: Discovery & Research)"
                      value={step.title}
                      onChange={(e) => {
                        const arr = [...(item.process || [])]; arr[idx].title = e.target.value; setItem({ ...item, process: arr });
                      }}
                      className="flex-1 font-bold bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Deskripsi apa yang dilakukan pada tahap ini..."
                    value={step.description}
                    onChange={(e) => {
                      const arr = [...(item.process || [])]; arr[idx].description = e.target.value; setItem({ ...item, process: arr });
                    }}
                    rows={2}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none resize-none ml-10 w-[calc(100%-2.5rem)]"
                  />
                </div>
              )}
            />
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Status</h3>
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
              <div>
                <span className="font-medium text-white block">Published</span>
                <span className="text-[10px] text-gray-500">Bisa diakses publik</span>
              </div>
              <Switch
                checked={item.published || false}
                onCheckedChange={(c) => setItem({ ...item, published: c })}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Meta & Tags</h3>
            <FormField label="Teknologi Digunakan">
              <TagInput
                value={item.technology || []}
                onChange={(val) => setItem({ ...item, technology: val })}
                placeholder="Next.js, Figma, dsb..."
              />
            </FormField>
          </section>
        </div>
      </div>
    </div>
  );
}
