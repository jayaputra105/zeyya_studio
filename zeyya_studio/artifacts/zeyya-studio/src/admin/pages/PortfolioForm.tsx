import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { PortfolioItem } from '@/admin/types';
import { useRoute, useLocation } from 'wouter';
import { FormField } from '../components/FormField';
import { TagInput } from '../components/TagInput';
import { ImageUpload } from '../components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, X, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function PortfolioForm() {
  const [match, params] = useRoute('/admin/portfolio/:id');
  const id = params?.id;
  const isNew = id === 'new' || !id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [item, setItem] = useState<Partial<PortfolioItem>>({
    id: `port-${Date.now()}`, slug: '', title: '', client: '', category: 'Website Development', year: new Date().getFullYear().toString(),
    thumbnail: '', gallery: [], description: '', problem: '', solution: '', result: '',
    technologies: [], features: [], demoUrl: '', githubUrl: '', featured: false, published: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  });

  const { data, isLoading } = useQuery({
    queryKey: ['data', 'portfolio'],
    queryFn: () => getData<{ items: PortfolioItem[] }>('portfolio'),
  });

  useEffect(() => {
    if (!isNew && data?.items) {
      const existing = data.items.find(i => i.id === id);
      if (existing) setItem(existing);
      else { toast.error('Portfolio tidak ditemukan'); setLocation('/admin/portfolio'); }
    }
  }, [id, isNew, data, setLocation]);

  const saveMutation = useMutation({
    mutationFn: (updated: { items: PortfolioItem[] }) => saveData('portfolio', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'portfolio'] });
      toast.success('Portfolio berhasil disimpan');
      setLocation('/admin/portfolio');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (!item.title || !item.slug) {
      toast.error('Judul dan Slug wajib diisi');
      return;
    }
    const currentItems = data?.items || [];
    const finalItem = { ...item, updatedAt: new Date().toISOString() } as PortfolioItem;
    
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

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white rounded-full">
            <Link href="/admin/portfolio"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h2 className="text-xl font-bold text-white">{isNew ? 'Tambah Portfolio' : 'Edit Portfolio'}</h2>
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
            <FormField label="Judul Project" required>
              <input
                value={item.title || ''}
                onChange={(e) => {
                  const title = e.target.value;
                  setItem(prev => ({ ...prev, title, slug: isNew ? generateSlug(title) : prev.slug }));
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
              <FormField label="Nama Klien">
                <input
                  value={item.client || ''}
                  onChange={(e) => setItem({ ...item, client: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                />
              </FormField>
              <FormField label="Kategori">
                <select
                  value={item.category || ''}
                  onChange={(e) => setItem({ ...item, category: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                >
                  <option value="Website Development">Website Development</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Company Profile">Company Profile</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </FormField>
              <FormField label="Tahun">
                <input
                  value={item.year || ''}
                  onChange={(e) => setItem({ ...item, year: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                />
              </FormField>
            </div>

            <FormField label="Deskripsi Singkat">
              <textarea
                value={item.description || ''}
                onChange={(e) => setItem({ ...item, description: e.target.value })}
                rows={3}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </FormField>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Detail Case Study (Opsional)</h3>
            <FormField label="Tantangan / Masalah">
              <textarea
                value={item.problem || ''}
                onChange={(e) => setItem({ ...item, problem: e.target.value })}
                rows={3}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </FormField>
            <FormField label="Solusi Zeyya Studio">
              <textarea
                value={item.solution || ''}
                onChange={(e) => setItem({ ...item, solution: e.target.value })}
                rows={3}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </FormField>
            <FormField label="Hasil / Dampak">
              <textarea
                value={item.result || ''}
                onChange={(e) => setItem({ ...item, result: e.target.value })}
                rows={3}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </FormField>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Teknologi & Fitur</h3>
            <FormField label="Teknologi yang digunakan">
              <TagInput
                value={item.technologies || []}
                onChange={(val) => setItem({ ...item, technologies: val })}
                placeholder="Next.js, React, Tailwind..."
              />
            </FormField>
            <FormField label="Fitur Utama">
              <TagInput
                value={item.features || []}
                onChange={(val) => setItem({ ...item, features: val })}
                placeholder="Responsive, Dark Mode, SEO..."
              />
            </FormField>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Status & Tampilan</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="font-medium text-white block">Published</span>
                  <span className="text-[10px] text-gray-500">Tampil di website</span>
                </div>
                <Switch
                  checked={item.published || false}
                  onCheckedChange={(c) => setItem({ ...item, published: c })}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
              <div className="flex items-center justify-between bg-[#FF6B00]/5 p-3 rounded-xl border border-[#FF6B00]/20">
                <div>
                  <span className="font-medium text-[#FF6B00] block">Featured</span>
                  <span className="text-[10px] text-gray-500">Tampil di halaman depan</span>
                </div>
                <Switch
                  checked={item.featured || false}
                  onCheckedChange={(c) => setItem({ ...item, featured: c })}
                  className="data-[state=checked]:bg-[#FF6B00]"
                />
              </div>
            </div>

            <FormField label="Gambar Thumbnail" required>
              <ImageUpload
                value={item.thumbnail || ''}
                onChange={(url) => setItem({ ...item, thumbnail: url })}
                className="aspect-video"
              />
            </FormField>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Gallery Tambahan (Opsional)</label>
              <div className="grid grid-cols-2 gap-2">
                {item.gallery?.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setItem({ ...item, gallery: item.gallery?.filter((_, i) => i !== idx) })}
                      className="absolute top-1 right-1 bg-red-500 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="aspect-video">
                  <ImageUpload
                    value=""
                    onChange={(url) => setItem({ ...item, gallery: [...(item.gallery || []), url] })}
                    className="h-full border-dashed"
                    placeholder="+"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Links</h3>
            <FormField label="Live Demo URL">
              <input
                value={item.demoUrl || ''}
                onChange={(e) => setItem({ ...item, demoUrl: e.target.value })}
                placeholder="https://"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </FormField>
            <FormField label="GitHub URL (Jika Open Source)">
              <input
                value={item.githubUrl || ''}
                onChange={(e) => setItem({ ...item, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </FormField>
          </section>
        </div>
      </div>
    </div>
  );
}
