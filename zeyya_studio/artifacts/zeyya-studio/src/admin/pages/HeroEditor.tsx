import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { HeroData } from '@/admin/types';
import { FormField } from '../components/FormField';
import { TagInput } from '../components/TagInput';
import { ImageUpload } from '../components/ImageUpload';
import { SortableList } from '../components/SortableList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Save, Plus } from 'lucide-react';

export default function HeroEditor() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<HeroData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'hero'],
    queryFn: () => getData<HeroData>('hero'),
  });

  useEffect(() => {
    if (initialData && !data) {
      setData(initialData);
    }
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: HeroData) => saveData('hero', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'hero'] });
      toast.success('Konten Hero berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (data) saveMutation.mutate(data);
  };

  if (isLoading || !data) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Hero Section</h2>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content */}
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <FormField label="Badge Text">
              <input
                value={data.badge}
                onChange={(e) => setData({ ...data, badge: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none"
              />
            </FormField>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white">Headlines (Rotasi)</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setData({ ...data, headlines: [...data.headlines, { plain: '', accent: '' }] })}
                  className="text-xs h-8 border-white/10 hover:bg-white/5"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah
                </Button>
              </div>
              <SortableList
                items={data.headlines}
                onReorder={(newItems) => setData({ ...data, headlines: newItems })}
                onDelete={(idx) => setData({ ...data, headlines: data.headlines.filter((_, i) => i !== idx) })}
                renderItem={(item, idx) => (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Teks biasa"
                      value={item.plain}
                      onChange={(e) => {
                        const newH = [...data.headlines];
                        newH[idx].plain = e.target.value;
                        setData({ ...data, headlines: newH });
                      }}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-[#FF6B00] outline-none"
                    />
                    <input
                      placeholder="Teks aksen (warna orange)"
                      value={item.accent}
                      onChange={(e) => {
                        const newH = [...data.headlines];
                        newH[idx].accent = e.target.value;
                        setData({ ...data, headlines: newH });
                      }}
                      className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 rounded-xl px-3 py-2 text-sm text-[#FF6B00] focus:border-[#FF6B00] outline-none"
                    />
                  </div>
                )}
              />
            </div>

            <FormField label="Deskripsi">
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={3}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none resize-none"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-white block">CTA Primary</label>
                <input
                  placeholder="Teks Tombol"
                  value={data.ctaPrimary.text}
                  onChange={(e) => setData({ ...data, ctaPrimary: { ...data.ctaPrimary, text: e.target.value } })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white mb-2 outline-none"
                />
                <input
                  placeholder="URL Target"
                  value={data.ctaPrimary.url}
                  onChange={(e) => setData({ ...data, ctaPrimary: { ...data.ctaPrimary, url: e.target.value } })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-white block">CTA Secondary</label>
                <input
                  placeholder="Teks Tombol"
                  value={data.ctaSecondary.text}
                  onChange={(e) => setData({ ...data, ctaSecondary: { ...data.ctaSecondary, text: e.target.value } })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white mb-2 outline-none"
                />
                <input
                  placeholder="URL Target"
                  value={data.ctaSecondary.url}
                  onChange={(e) => setData({ ...data, ctaSecondary: { ...data.ctaSecondary, url: e.target.value } })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                />
              </div>
            </div>
          </section>

          {/* Marquee Slides */}
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Marquee Slides</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setData({ ...data, slides: [...data.slides, { label: 'New', color: '#FF6B00', bg: 'from-transparent', icon: '✨' }] })}
                className="text-xs h-8 border-white/10 hover:bg-white/5"
              >
                <Plus className="w-3 h-3 mr-1" /> Tambah
              </Button>
            </div>
            <SortableList
              items={data.slides}
              onReorder={(newItems) => setData({ ...data, slides: newItems })}
              onDelete={(idx) => setData({ ...data, slides: data.slides.filter((_, i) => i !== idx) })}
              renderItem={(item, idx) => (
                <div className="flex gap-2">
                  <input
                    placeholder="Icon"
                    value={item.icon}
                    onChange={(e) => {
                      const newS = [...data.slides]; newS[idx].icon = e.target.value; setData({ ...data, slides: newS });
                    }}
                    className="w-12 text-center bg-[#0A0A0A] border border-white/10 rounded-xl py-2 text-sm outline-none"
                  />
                  <input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => {
                      const newS = [...data.slides]; newS[idx].label = e.target.value; setData({ ...data, slides: newS });
                    }}
                    className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  />
                  <input
                    type="color"
                    value={item.color}
                    onChange={(e) => {
                      const newS = [...data.slides]; newS[idx].color = e.target.value; setData({ ...data, slides: newS });
                    }}
                    className="w-10 h-10 rounded-xl bg-transparent cursor-pointer"
                  />
                </div>
              )}
            />
          </section>
        </div>

        <div className="space-y-8">
          {/* Mockup */}
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Mockup Preview</h3>
            <FormField label="Gambar Mockup">
              <ImageUpload 
                value={data.mockupImage} 
                onChange={(url) => setData({ ...data, mockupImage: url })} 
              />
            </FormField>
            <FormField label="URL Bar">
              <input
                value={data.mockupUrl}
                onChange={(e) => setData({ ...data, mockupUrl: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </FormField>
            <FormField label="Nama Klien">
              <input
                value={data.mockupClient}
                onChange={(e) => setData({ ...data, mockupClient: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </FormField>
          </section>

          {/* Stats */}
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Statistik</h3>
              <Button variant="ghost" size="sm" onClick={() => setData({ ...data, stats: [...data.stats, { value: '', label: '' }] })} className="h-6 w-6 p-0"><Plus className="w-4 h-4" /></Button>
            </div>
            <SortableList
              items={data.stats}
              onReorder={(newItems) => setData({ ...data, stats: newItems })}
              onDelete={(idx) => setData({ ...data, stats: data.stats.filter((_, i) => i !== idx) })}
              renderItem={(item, idx) => (
                <div className="grid grid-cols-3 gap-2">
                  <input
                    placeholder="100+"
                    value={item.value}
                    onChange={(e) => {
                      const newS = [...data.stats]; newS[idx].value = e.target.value; setData({ ...data, stats: newS });
                    }}
                    className="col-span-1 bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#FF6B00] font-bold rounded-xl px-3 py-1.5 text-sm outline-none"
                  />
                  <input
                    placeholder="Klien"
                    value={item.label}
                    onChange={(e) => {
                      const newS = [...data.stats]; newS[idx].label = e.target.value; setData({ ...data, stats: newS });
                    }}
                    className="col-span-2 bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none"
                  />
                </div>
              )}
            />
          </section>

          {/* Clients */}
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Daftar Klien</h3>
            <TagInput 
              value={data.clients} 
              onChange={(clients) => setData({ ...data, clients })} 
              placeholder="Nama klien, Enter..."
            />
          </section>
        </div>
      </div>
    </div>
  );
}
