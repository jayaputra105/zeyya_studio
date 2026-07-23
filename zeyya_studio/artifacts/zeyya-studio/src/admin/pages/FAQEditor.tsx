import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { FAQItem } from '@/admin/types';
import { FormField } from '../components/FormField';
import { SortableList } from '../components/SortableList';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Plus } from 'lucide-react';

interface FAQData {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  items: FAQItem[];
}

export default function FAQEditor() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<FAQData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'faq'],
    queryFn: () => getData<FAQData>('faq'),
  });

  useEffect(() => {
    if (initialData && !data) {
      // sort items by order just in case
      const sorted = { ...initialData };
      sorted.items = [...sorted.items].sort((a, b) => a.order - b.order);
      setData(sorted);
    }
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: FAQData) => {
      // Ensure order matches array index before save
      updated.items = updated.items.map((item, index) => ({ ...item, order: index + 1 }));
      return saveData('faq', updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'faq'] });
      toast.success('FAQ berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (data) saveMutation.mutate(data);
  };

  const addFAQ = () => {
    if (!data) return;
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'Pertanyaan baru?',
      answer: 'Jawaban dari pertanyaan...',
      published: true,
      order: data.items.length + 1
    };
    setData({ ...data, items: [...data.items, newItem] });
  };

  if (isLoading || !data) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">FAQ Editor</h2>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
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
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
          <FormField label="Teks Tombol CTA">
            <input
              value={data.ctaText}
              onChange={(e) => setData({ ...data, ctaText: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
            />
          </FormField>
          <FormField label="URL Target CTA">
            <input
              value={data.ctaUrl}
              onChange={(e) => setData({ ...data, ctaUrl: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
            />
          </FormField>
        </div>
      </section>

      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Daftar Pertanyaan</h3>
          <Button onClick={addFAQ} size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
            <Plus className="w-4 h-4 mr-1" /> Tambah FAQ
          </Button>
        </div>

        <SortableList
          items={data.items}
          onReorder={(newItems) => setData({ ...data, items: newItems })}
          onDelete={(idx) => setData({ ...data, items: data.items.filter((_, i) => i !== idx) })}
          renderItem={(item, idx) => (
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Pertanyaan"
                  value={item.question}
                  onChange={(e) => {
                    const newItems = [...data.items]; newItems[idx].question = e.target.value; setData({ ...data, items: newItems });
                  }}
                  className="w-full font-semibold bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF6B00]"
                />
                <textarea
                  placeholder="Jawaban"
                  value={item.answer}
                  onChange={(e) => {
                    const newItems = [...data.items]; newItems[idx].answer = e.target.value; setData({ ...data, items: newItems });
                  }}
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none focus:border-[#FF6B00] resize-none"
                />
              </div>
              <div className="shrink-0 pt-2 flex items-center gap-2 bg-[#0A0A0A] px-3 py-2 rounded-xl border border-white/5">
                <span className="text-xs text-gray-400">Live</span>
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
    </div>
  );
}
