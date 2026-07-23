import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { SocialData } from '@/admin/types';
import { FormField } from '../components/FormField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok, FaTwitter, FaYoutube, FaLinkedin, FaBehance, FaDribbble, FaEnvelope } from 'react-icons/fa';

export default function SocialEditor() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<SocialData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'social'],
    queryFn: () => getData<SocialData>('social'),
  });

  useEffect(() => {
    if (initialData && !data) setData(initialData);
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: SocialData) => saveData('social', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'social'] });
      toast.success('Social Links berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (data) saveMutation.mutate(data);
  };

  if (isLoading || !data) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  const platforms = [
    { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-500', prefix: 'https://wa.me/' },
    { key: 'email', label: 'Email Address', icon: FaEnvelope, color: 'text-gray-400', prefix: 'mailto:' },
    { key: 'instagram', label: 'Instagram URL', icon: FaInstagram, color: 'text-pink-500' },
    { key: 'facebook', label: 'Facebook URL', icon: FaFacebook, color: 'text-blue-500' },
    { key: 'tiktok', label: 'TikTok URL', icon: FaTiktok, color: 'text-white' },
    { key: 'youtube', label: 'YouTube Channel', icon: FaYoutube, color: 'text-red-500' },
    { key: 'twitter', label: 'Twitter / X URL', icon: FaTwitter, color: 'text-blue-400' },
    { key: 'linkedin', label: 'LinkedIn URL', icon: FaLinkedin, color: 'text-blue-600' },
    { key: 'behance', label: 'Behance URL', icon: FaBehance, color: 'text-blue-500' },
    { key: 'dribbble', label: 'Dribbble URL', icon: FaDribbble, color: 'text-pink-400' },
  ] as const;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Social Media Links</h2>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <p className="text-sm text-gray-400 mb-6">Biarkan kosong jika platform tidak digunakan.</p>
        
        <div className="space-y-4">
          {platforms.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1">
                <FormField label={label}>
                  <input
                    value={data[key as keyof SocialData]}
                    onChange={(e) => setData({ ...data, [key]: e.target.value })}
                    placeholder={`Masukkan ${label}`}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-[#FF6B00]"
                  />
                </FormField>
              </div>
            </div>
          ))}

          <div className="pt-4 mt-4 border-t border-white/10 ml-14">
            <FormField label="WhatsApp Default Text (Opsional)">
              <textarea
                value={data.whatsappText}
                onChange={(e) => setData({ ...data, whatsappText: e.target.value })}
                placeholder="Halo, saya ingin konsultasi mengenai pembuatan website..."
                rows={3}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#FF6B00] resize-none"
              />
            </FormField>
            <p className="text-xs text-gray-500 mt-2">Teks ini akan otomatis terisi saat klien mengklik tombol WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
