import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { PricingPackage } from '@/admin/types';
import { FormField } from '../components/FormField';
import { TagInput } from '../components/TagInput';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingData {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  packages: PricingPackage[];
}

export default function PricingEditor() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<PricingData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'pricing'],
    queryFn: () => getData<PricingData>('pricing'),
  });

  useEffect(() => {
    if (initialData && !data) setData(initialData);
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: PricingData) => saveData('pricing', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'pricing'] });
      toast.success('Paket harga berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (data) saveMutation.mutate(data);
  };

  const addPackage = () => {
    if (!data) return;
    const newPkg: PricingPackage = {
      id: `pkg-${Date.now()}`,
      name: 'Paket Baru',
      price: '0',
      period: '/ project',
      description: 'Deskripsi singkat paket',
      features: ['Fitur 1', 'Fitur 2'],
      highlighted: false,
      badge: '',
      ctaText: 'Pilih Paket',
      published: true
    };
    setData({ ...data, packages: [...data.packages, newPkg] });
  };

  const updatePackage = (idx: number, updates: Partial<PricingPackage>) => {
    if (!data) return;
    const newPkgs = [...data.packages];
    newPkgs[idx] = { ...newPkgs[idx], ...updates };
    setData({ ...data, packages: newPkgs });
  };

  const deletePackage = (idx: number) => {
    if (!data) return;
    setData({ ...data, packages: data.packages.filter((_, i) => i !== idx) });
  };

  if (isLoading || !data) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Pricing Editor</h2>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormField label="Badge">
            <input
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
            />
          </FormField>
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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Daftar Paket</h3>
          <Button onClick={addPackage} size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
            <Plus className="w-4 h-4 mr-1" /> Tambah Paket
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {data.packages.map((pkg, idx) => (
            <div key={pkg.id} className={cn(
              "bg-[#111111] border rounded-2xl p-5 relative transition-colors",
              pkg.highlighted ? "border-[#FF6B00]" : "border-white/10"
            )}>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Switch
                  checked={pkg.published}
                  onCheckedChange={(c) => updatePackage(idx, { published: c })}
                  className="data-[state=checked]:bg-green-500"
                  title="Published"
                />
                <button
                  onClick={() => deletePackage(idx)}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 mt-2">
                <FormField label="Nama Paket">
                  <input
                    value={pkg.name}
                    onChange={(e) => updatePackage(idx, { name: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 font-bold text-white outline-none"
                  />
                </FormField>
                
                <div className="grid grid-cols-2 gap-2">
                  <FormField label="Harga (Rp)">
                    <input
                      value={pkg.price}
                      onChange={(e) => updatePackage(idx, { price: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </FormField>
                  <FormField label="Periode / Info">
                    <input
                      value={pkg.period}
                      onChange={(e) => updatePackage(idx, { period: e.target.value })}
                      placeholder="misal: / project"
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-400 outline-none"
                    />
                  </FormField>
                </div>

                <FormField label="Deskripsi">
                  <textarea
                    value={pkg.description}
                    onChange={(e) => updatePackage(idx, { description: e.target.value })}
                    rows={2}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none resize-none"
                  />
                </FormField>

                <FormField label="Daftar Fitur">
                  <TagInput
                    value={pkg.features}
                    onChange={(features) => updatePackage(idx, { features })}
                    placeholder="Ketik fitur lalu Enter"
                  />
                </FormField>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-sm text-white">Jadikan Rekomendasi (Highlight)</span>
                    <Switch
                      checked={pkg.highlighted}
                      onCheckedChange={(c) => updatePackage(idx, { highlighted: c })}
                      className="data-[state=checked]:bg-[#FF6B00]"
                    />
                  </div>
                  
                  {pkg.highlighted && (
                    <FormField label="Teks Badge Highlight">
                      <input
                        value={pkg.badge}
                        onChange={(e) => updatePackage(idx, { badge: e.target.value })}
                        placeholder="Most Popular"
                        className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 rounded-xl px-3 py-2 text-sm text-[#FF6B00] outline-none"
                      />
                    </FormField>
                  )}

                  <FormField label="Teks Tombol CTA">
                    <input
                      value={pkg.ctaText}
                      onChange={(e) => updatePackage(idx, { ctaText: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </FormField>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
