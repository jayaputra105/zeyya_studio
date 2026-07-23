import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { NavigationData, NavItem } from '@/admin/types';
import { FormField } from '../components/FormField';
import { SortableList } from '../components/SortableList';
import { ImageUpload } from '../components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Plus } from 'lucide-react';

export default function NavigationEditor() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<NavigationData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'navigation'],
    queryFn: () => getData<NavigationData>('navigation'),
  });

  useEffect(() => {
    if (initialData && !data) {
      const sorted = { ...initialData };
      sorted.items = [...sorted.items].sort((a, b) => a.order - b.order);
      setData(sorted);
    }
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: NavigationData) => {
      updated.items = updated.items.map((item, index) => ({ ...item, order: index + 1 }));
      return saveData('navigation', updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'navigation'] });
      toast.success('Navigasi berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (data) saveMutation.mutate(data);
  };

  const addItem = () => {
    if (!data) return;
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      href: '/',
      published: true,
      order: data.items.length + 1
    };
    setData({ ...data, items: [...data.items, newItem] });
  };

  if (isLoading || !data) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Navigation Settings</h2>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Brand & Logo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField label="Nama Brand">
            <input
              value={data.brand}
              onChange={(e) => setData({ ...data, brand: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
            />
          </FormField>
          <FormField label="Logo Image">
            <ImageUpload 
              value={data.logoUrl}
              onChange={(url) => setData({ ...data, logoUrl: url })}
              className="h-24 w-full"
            />
          </FormField>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Menu Items</h3>
            <Button onClick={addItem} size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
              <Plus className="w-4 h-4 mr-1" /> Tambah Menu
            </Button>
          </div>

          <SortableList
            items={data.items}
            onReorder={(newItems) => setData({ ...data, items: newItems })}
            onDelete={(idx) => setData({ ...data, items: data.items.filter((_, i) => i !== idx) })}
            renderItem={(item, idx) => (
              <div className="flex items-center gap-4">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    placeholder="Label Menu"
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...data.items]; newItems[idx].label = e.target.value; setData({ ...data, items: newItems });
                    }}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-medium outline-none"
                  />
                  <input
                    placeholder="URL (contoh: /about atau #services)"
                    value={item.href}
                    onChange={(e) => {
                      const newItems = [...data.items]; newItems[idx].href = e.target.value; setData({ ...data, items: newItems });
                    }}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-400 outline-none font-mono"
                  />
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <Switch
                    checked={item.published}
                    onCheckedChange={(c) => {
                      const newItems = [...data.items]; newItems[idx].published = c; setData({ ...data, items: newItems });
                    }}
                    className="data-[state=checked]:bg-[#FF6B00]"
                  />
                </div>
              </div>
            )}
          />
        </section>

        <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 h-max space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Tombol CTA (Header)</h3>
          <FormField label="Teks CTA">
            <input
              value={data.ctaText}
              onChange={(e) => setData({ ...data, ctaText: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            />
          </FormField>
          <FormField label="Target URL">
            <input
              value={data.ctaUrl}
              onChange={(e) => setData({ ...data, ctaUrl: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono"
            />
          </FormField>
          <FormField label="Style">
            <select
              value={data.ctaStyle}
              onChange={(e) => setData({ ...data, ctaStyle: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            >
              <option value="primary">Primary (Orange Solid)</option>
              <option value="outline">Outline (Ghost)</option>
              <option value="hidden">Sembunyikan CTA</option>
            </select>
          </FormField>
        </section>
      </div>
    </div>
  );
}
