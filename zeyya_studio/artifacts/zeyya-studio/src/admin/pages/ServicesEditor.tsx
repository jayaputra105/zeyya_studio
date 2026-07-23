import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { ServiceItem } from '@/admin/types';
import { FormField } from '../components/FormField';
import { SortableList } from '../components/SortableList';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Plus } from 'lucide-react';

interface ServicesData {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  services: ServiceItem[];
}

export default function ServicesEditor() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<ServicesData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'services'],
    queryFn: () => getData<ServicesData>('services'),
  });

  useEffect(() => {
    if (initialData && !data) setData(initialData);
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: ServicesData) => saveData('services', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'services'] });
      toast.success('Layanan berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (data) saveMutation.mutate(data);
  };

  const addService = () => {
    if (!data) return;
    const newService: ServiceItem = {
      id: `svc-${Date.now()}`,
      title: 'Layanan Baru',
      description: 'Deskripsi layanan baru',
      icon: '✨',
      accent: '#FF6B00',
      size: 'normal',
      published: true
    };
    setData({ ...data, services: [...data.services, newService] });
  };

  if (isLoading || !data) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Services Editor</h2>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Header Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        <FormField label="Deskripsi">
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={2}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none resize-none"
          />
        </FormField>
      </section>

      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Daftar Layanan</h3>
          <Button onClick={addService} size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
            <Plus className="w-4 h-4 mr-1" /> Tambah Layanan
          </Button>
        </div>

        <SortableList
          items={data.services}
          onReorder={(newItems) => setData({ ...data, services: newItems })}
          onDelete={(idx) => setData({ ...data, services: data.services.filter((_, i) => i !== idx) })}
          renderItem={(item, idx) => (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <input
                      placeholder="Icon"
                      value={item.icon}
                      onChange={(e) => {
                        const newS = [...data.services]; newS[idx].icon = e.target.value; setData({ ...data, services: newS });
                      }}
                      className="w-12 text-center bg-[#0A0A0A] border border-white/10 rounded-xl py-2 text-sm outline-none"
                      title="Emoji Icon"
                    />
                    <input
                      placeholder="Nama Layanan"
                      value={item.title}
                      onChange={(e) => {
                        const newS = [...data.services]; newS[idx].title = e.target.value; setData({ ...data, services: newS });
                      }}
                      className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 font-bold text-sm text-white outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Deskripsi layanan"
                    value={item.description}
                    onChange={(e) => {
                      const newS = [...data.services]; newS[idx].description = e.target.value; setData({ ...data, services: newS });
                    }}
                    rows={2}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none resize-none"
                  />
                </div>

                <div className="w-48 space-y-3 shrink-0 bg-[#0A0A0A] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Published</span>
                    <Switch
                      checked={item.published}
                      onCheckedChange={(c) => {
                        const newS = [...data.services]; newS[idx].published = c; setData({ ...data, services: newS });
                      }}
                      className="data-[state=checked]:bg-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Ukuran Card</span>
                    <select
                      value={item.size}
                      onChange={(e) => {
                        const newS = [...data.services]; newS[idx].size = e.target.value; setData({ ...data, services: newS });
                      }}
                      className="w-full bg-[#111111] border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
                    >
                      <option value="normal">Normal</option>
                      <option value="large">Large (2 Kolom)</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Warna Aksen</span>
                    <input
                      type="color"
                      value={item.accent}
                      onChange={(e) => {
                        const newS = [...data.services]; newS[idx].accent = e.target.value; setData({ ...data, services: newS });
                      }}
                      className="w-full h-6 rounded border-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </section>
    </div>
  );
}
