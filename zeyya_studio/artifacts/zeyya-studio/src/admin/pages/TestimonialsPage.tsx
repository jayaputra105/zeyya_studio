import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { TestimonialItem } from '@/admin/types';
import { FormField } from '../components/FormField';
import { SortableList } from '../components/SortableList';
import { ImageUpload } from '../components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Star } from 'lucide-react';

interface TestimonialData {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  items: TestimonialItem[];
}

export default function TestimonialsPage() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<TestimonialData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'testimonial'],
    queryFn: () => getData<TestimonialData>('testimonial'),
  });

  useEffect(() => {
    if (initialData && !data) {
      const sorted = { ...initialData };
      sorted.items = [...sorted.items].sort((a, b) => a.order - b.order);
      setData(sorted);
    }
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: TestimonialData) => {
      updated.items = updated.items.map((item, index) => ({ ...item, order: index + 1 }));
      return saveData('testimonial', updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'testimonial'] });
      toast.success('Testimonial berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (data) saveMutation.mutate(data);
  };

  const addTestimonial = () => {
    if (!data) return;
    const newItem: TestimonialItem = {
      id: `testi-${Date.now()}`,
      quote: 'Layanan yang luar biasa, sangat merekomendasikan Zeyya Studio!',
      author: 'Nama Klien',
      role: 'CEO & Founder',
      avatar: '',
      rating: 5,
      published: true,
      order: data.items.length + 1
    };
    setData({ ...data, items: [...data.items, newItem] });
  };

  if (isLoading || !data) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Testimonials Editor</h2>
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
      </section>

      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Daftar Review</h3>
          <Button onClick={addTestimonial} size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
            <Plus className="w-4 h-4 mr-1" /> Tambah Review
          </Button>
        </div>

        <SortableList
          items={data.items}
          onReorder={(newItems) => setData({ ...data, items: newItems })}
          onDelete={(idx) => setData({ ...data, items: data.items.filter((_, i) => i !== idx) })}
          renderItem={(item, idx) => (
            <div className="flex items-start gap-4">
              <div className="w-24 shrink-0">
                <ImageUpload
                  value={item.avatar}
                  onChange={(url) => {
                    const newItems = [...data.items]; newItems[idx].avatar = url; setData({ ...data, items: newItems });
                  }}
                  className="aspect-square rounded-full w-full object-cover"
                  placeholder="Foto"
                />
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  placeholder="Kutipan review..."
                  value={item.quote}
                  onChange={(e) => {
                    const newItems = [...data.items]; newItems[idx].quote = e.target.value; setData({ ...data, items: newItems });
                  }}
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-medium outline-none focus:border-[#FF6B00] resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Nama Klien"
                    value={item.author}
                    onChange={(e) => {
                      const newItems = [...data.items]; newItems[idx].author = e.target.value; setData({ ...data, items: newItems });
                    }}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF6B00]"
                  />
                  <input
                    placeholder="Jabatan / Perusahaan"
                    value={item.role}
                    onChange={(e) => {
                      const newItems = [...data.items]; newItems[idx].role = e.target.value; setData({ ...data, items: newItems });
                    }}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-400 outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="shrink-0 w-32 space-y-3 bg-[#0A0A0A] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Rating</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          const newItems = [...data.items]; newItems[idx].rating = star; setData({ ...data, items: newItems });
                        }}
                      >
                        <Star className={`w-4 h-4 ${star <= item.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Published</span>
                  <Switch
                    checked={item.published}
                    onCheckedChange={(c) => {
                      const newItems = [...data.items]; newItems[idx].published = c; setData({ ...data, items: newItems });
                    }}
                    className="data-[state=checked]:bg-[#FF6B00]"
                  />
                </div>
              </div>
            </div>
          )}
        />
      </section>
    </div>
  );
}
