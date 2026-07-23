import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { AboutData } from '@/admin/types';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { SortableList } from '../components/SortableList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Save, Plus } from 'lucide-react';

export default function AboutEditor() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<AboutData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'about'],
    queryFn: () => getData<AboutData>('about'),
  });

  useEffect(() => {
    if (initialData && !data) setData(initialData);
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: AboutData) => saveData('about', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'about'] });
      toast.success('Halaman About berhasil disimpan');
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
        <h2 className="text-xl font-bold text-white">About Section</h2>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Headline & Story</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Badge">
                <input
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                />
              </FormField>
              <div />
              <FormField label="Judul">
                <input
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                />
              </FormField>
              <FormField label="Judul Aksen (Orange)">
                <input
                  value={data.titleAccent}
                  onChange={(e) => setData({ ...data, titleAccent: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 rounded-xl px-4 py-2 text-sm text-[#FF6B00] outline-none"
                />
              </FormField>
            </div>
            
            <FormField label="Cerita / Paragraf Utama">
              <textarea
                value={data.story}
                onChange={(e) => setData({ ...data, story: e.target.value })}
                rows={5}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
              />
            </FormField>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Visi & Misi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="Judul Misi">
                  <input
                    value={data.missionTitle}
                    onChange={(e) => setData({ ...data, missionTitle: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                  />
                </FormField>
                <FormField label="Teks Misi">
                  <textarea
                    value={data.mission}
                    onChange={(e) => setData({ ...data, mission: e.target.value })}
                    rows={4}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none resize-none"
                  />
                </FormField>
              </div>
              <div className="space-y-4">
                <FormField label="Judul Visi">
                  <input
                    value={data.visionTitle}
                    onChange={(e) => setData({ ...data, visionTitle: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                  />
                </FormField>
                <FormField label="Teks Visi">
                  <textarea
                    value={data.vision}
                    onChange={(e) => setData({ ...data, vision: e.target.value })}
                    rows={4}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none resize-none"
                  />
                </FormField>
              </div>
            </div>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <h3 className="text-lg font-bold text-white">Values (Nilai Perusahaan)</h3>
              <Button variant="outline" size="sm" onClick={() => setData({ ...data, values: [...data.values, { title: 'New Value', description: '' }] })} className="h-8 text-xs border-white/10">
                <Plus className="w-3 h-3 mr-1" /> Tambah
              </Button>
            </div>
            <SortableList
              items={data.values}
              onReorder={(newItems) => setData({ ...data, values: newItems })}
              onDelete={(idx) => setData({ ...data, values: data.values.filter((_, i) => i !== idx) })}
              renderItem={(item, idx) => (
                <div className="space-y-2">
                  <input
                    placeholder="Judul Value"
                    value={item.title}
                    onChange={(e) => {
                      const newV = [...data.values]; newV[idx].title = e.target.value; setData({ ...data, values: newV });
                    }}
                    className="w-full font-bold bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  />
                  <textarea
                    placeholder="Deskripsi singkat"
                    value={item.description}
                    onChange={(e) => {
                      const newV = [...data.values]; newV[idx].description = e.target.value; setData({ ...data, values: newV });
                    }}
                    rows={2}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none resize-none"
                  />
                </div>
              )}
            />
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Founder Profile</h3>
            <FormField label="Foto Profil">
              <ImageUpload 
                value={data.founderImage} 
                onChange={(url) => setData({ ...data, founderImage: url })} 
                className="aspect-square rounded-full w-48 mx-auto"
              />
            </FormField>
            <FormField label="Nama Lengkap">
              <input
                value={data.founderName}
                onChange={(e) => setData({ ...data, founderName: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
              />
            </FormField>
            <FormField label="Jabatan / Role">
              <input
                value={data.founderTitle}
                onChange={(e) => setData({ ...data, founderTitle: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 rounded-xl px-4 py-2 text-sm text-[#FF6B00] outline-none"
              />
            </FormField>
            <FormField label="Bio Singkat">
              <textarea
                value={data.founderBio}
                onChange={(e) => setData({ ...data, founderBio: e.target.value })}
                rows={4}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 outline-none resize-none"
              />
            </FormField>
          </section>

          <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <h3 className="text-lg font-bold text-white">Statistik About</h3>
              <Button variant="ghost" size="sm" onClick={() => setData({ ...data, stats: [...data.stats, { value: '', label: '' }] })} className="h-6 w-6 p-0"><Plus className="w-4 h-4" /></Button>
            </div>
            <SortableList
              items={data.stats}
              onReorder={(newItems) => setData({ ...data, stats: newItems })}
              onDelete={(idx) => setData({ ...data, stats: data.stats.filter((_, i) => i !== idx) })}
              renderItem={(item, idx) => (
                <div className="grid grid-cols-3 gap-2">
                  <input
                    placeholder="Value"
                    value={item.value}
                    onChange={(e) => {
                      const newS = [...data.stats]; newS[idx].value = e.target.value; setData({ ...data, stats: newS });
                    }}
                    className="col-span-1 bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#FF6B00] font-bold rounded-xl px-3 py-1.5 text-sm outline-none"
                  />
                  <input
                    placeholder="Label"
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
        </div>
      </div>
    </div>
  );
}
