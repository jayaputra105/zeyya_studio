import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData, changePassword } from '@/admin/cmsApi';
import type { SettingsData } from '@/admin/types';
import { FormField } from '../components/FormField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Lock, Save, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['data', 'settings'],
    queryFn: () => getData<SettingsData>('settings'),
  });

  const saveMutation = useMutation({
    mutationFn: (updated: SettingsData) => saveData('settings', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'settings'] });
      toast.success('Pengaturan berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan pengaturan'),
  });

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!settings) return;

    const updated: SettingsData = {
      ...settings,
      siteName: formData.get('siteName') as string,
      tagline: formData.get('tagline') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      publishConfig: {
        ...settings.publishConfig,
        secret: formData.get('secret') as string,
        githubOwner: formData.get('githubOwner') as string,
        githubRepo: formData.get('githubRepo') as string,
        githubBranch: formData.get('githubBranch') as string,
      }
    };

    saveMutation.mutate(updated);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    changePassword(newPassword);
    toast.success('Password admin berhasil diubah');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;
  if (!settings) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      
      {/* General Settings */}
      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Pengaturan Umum</h2>
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nama Website">
              <input
                name="siteName"
                defaultValue={settings.siteName}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none"
              />
            </FormField>
            <FormField label="Tagline">
              <input
                name="tagline"
                defaultValue={settings.tagline}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none"
              />
            </FormField>
            <FormField label="Email Kontak">
              <input
                name="email"
                type="email"
                defaultValue={settings.email}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none"
              />
            </FormField>
            <FormField label="No. Telepon / WhatsApp">
              <input
                name="phone"
                defaultValue={settings.phone}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none"
              />
            </FormField>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Publish Configuration
            </h3>
            <p className="text-sm text-gray-400 mb-6">Konfigurasi ini diperlukan agar tombol "Publish" dapat bekerja memicu deploy ke Vercel via GitHub API.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="GitHub Personal Access Token (Secret)">
                <input
                  name="secret"
                  type="password"
                  defaultValue={settings.publishConfig.secret}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none font-mono text-sm"
                />
              </FormField>
              <FormField label="GitHub Owner (Username / Org)">
                <input
                  name="githubOwner"
                  defaultValue={settings.publishConfig.githubOwner}
                  placeholder="zeyyastudio"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none font-mono text-sm"
                />
              </FormField>
              <FormField label="GitHub Repository">
                <input
                  name="githubRepo"
                  defaultValue={settings.publishConfig.githubRepo}
                  placeholder="zeyya-website"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none font-mono text-sm"
                />
              </FormField>
              <FormField label="Branch">
                <input
                  name="githubBranch"
                  defaultValue={settings.publishConfig.githubBranch || 'main'}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none font-mono text-sm"
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Pengaturan
            </Button>
          </div>
        </form>
      </section>

      {/* Security Settings */}
      <section className="bg-[#111111] border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-red-500" />
          Keamanan Akun
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
          <FormField label="Password Baru">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none"
            />
          </FormField>
          <FormField label="Konfirmasi Password Baru">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none"
            />
          </FormField>
          
          <Button type="submit" variant="destructive" className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
            Ganti Password
          </Button>
        </form>
      </section>

    </div>
  );
}
