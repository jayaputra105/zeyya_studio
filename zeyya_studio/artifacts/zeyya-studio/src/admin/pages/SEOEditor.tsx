import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, saveData } from '@/admin/cmsApi';
import type { SEOData } from '@/admin/types';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SEOEditor() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<SEOData | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['data', 'seo'],
    queryFn: () => getData<SEOData>('seo'),
  });

  useEffect(() => {
    if (initialData && !data) setData(initialData);
  }, [initialData, data]);

  const saveMutation = useMutation({
    mutationFn: (updated: SEOData) => saveData('seo', updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'seo'] });
      toast.success('SEO berhasil disimpan');
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menyimpan'),
  });

  const handleSave = () => {
    if (data) saveMutation.mutate(data);
  };

  if (isLoading || !data) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">SEO & Meta Tags</h2>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        <Tabs defaultValue="default" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent h-14 p-0">
            {['default', 'openGraph', 'twitter', 'sitemap', 'analytics'].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="h-full px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B00] data-[state=active]:text-[#FF6B00] text-gray-400 capitalize"
              >
                {tab === 'openGraph' ? 'Open Graph' : tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="p-6">
            <TabsContent value="default" className="space-y-4 m-0 mt-0">
              <FormField label="Site Title">
                <input
                  value={data.default.title}
                  onChange={(e) => setData({ ...data, default: { ...data.default, title: e.target.value } })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </FormField>
              <FormField label="Meta Description">
                <textarea
                  value={data.default.description}
                  onChange={(e) => setData({ ...data, default: { ...data.default, description: e.target.value } })}
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none resize-none"
                />
              </FormField>
              <FormField label="Meta Keywords">
                <input
                  value={data.default.keywords}
                  onChange={(e) => setData({ ...data, default: { ...data.default, keywords: e.target.value } })}
                  placeholder="pisahkan dengan koma"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Canonical URL">
                  <input
                    value={data.default.canonical}
                    onChange={(e) => setData({ ...data, default: { ...data.default, canonical: e.target.value } })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </FormField>
                <FormField label="Robots">
                  <input
                    value={data.default.robots}
                    onChange={(e) => setData({ ...data, default: { ...data.default, robots: e.target.value } })}
                    placeholder="index, follow"
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </FormField>
              </div>
            </TabsContent>

            <TabsContent value="openGraph" className="space-y-4 m-0 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField label="OG Title">
                    <input
                      value={data.openGraph.title}
                      onChange={(e) => setData({ ...data, openGraph: { ...data.openGraph, title: e.target.value } })}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                    />
                  </FormField>
                  <FormField label="OG Description">
                    <textarea
                      value={data.openGraph.description}
                      onChange={(e) => setData({ ...data, openGraph: { ...data.openGraph, description: e.target.value } })}
                      rows={3}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none resize-none"
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField label="OG Type">
                      <input
                        value={data.openGraph.type}
                        onChange={(e) => setData({ ...data, openGraph: { ...data.openGraph, type: e.target.value } })}
                        placeholder="website"
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                      />
                    </FormField>
                    <FormField label="Site Name">
                      <input
                        value={data.openGraph.siteName}
                        onChange={(e) => setData({ ...data, openGraph: { ...data.openGraph, siteName: e.target.value } })}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                      />
                    </FormField>
                  </div>
                </div>
                <div>
                  <FormField label="OG Image">
                    <ImageUpload 
                      value={data.openGraph.image}
                      onChange={(url) => setData({ ...data, openGraph: { ...data.openGraph, image: url } })}
                      className="aspect-video w-full"
                    />
                  </FormField>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="twitter" className="space-y-4 m-0 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField label="Twitter Card Type">
                    <input
                      value={data.twitter.card}
                      onChange={(e) => setData({ ...data, twitter: { ...data.twitter, card: e.target.value } })}
                      placeholder="summary_large_image"
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                    />
                  </FormField>
                  <FormField label="Twitter Title">
                    <input
                      value={data.twitter.title}
                      onChange={(e) => setData({ ...data, twitter: { ...data.twitter, title: e.target.value } })}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                    />
                  </FormField>
                  <FormField label="Twitter Description">
                    <textarea
                      value={data.twitter.description}
                      onChange={(e) => setData({ ...data, twitter: { ...data.twitter, description: e.target.value } })}
                      rows={3}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none resize-none"
                    />
                  </FormField>
                </div>
                <div>
                  <FormField label="Twitter Image">
                    <ImageUpload 
                      value={data.twitter.image}
                      onChange={(url) => setData({ ...data, twitter: { ...data.twitter, image: url } })}
                      className="aspect-video w-full"
                    />
                  </FormField>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sitemap" className="space-y-4 m-0 mt-0 max-w-md">
              <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/10 rounded-xl">
                <div>
                  <h4 className="font-medium text-white">Enable Sitemap</h4>
                  <p className="text-xs text-gray-400">Generate sitemap.xml for search engines</p>
                </div>
                <Switch
                  checked={data.sitemap.enabled}
                  onCheckedChange={(c) => setData({ ...data, sitemap: { ...data.sitemap, enabled: c } })}
                  className="data-[state=checked]:bg-[#FF6B00]"
                />
              </div>
              <FormField label="Change Frequency">
                <input
                  value={data.sitemap.changefreq}
                  onChange={(e) => setData({ ...data, sitemap: { ...data.sitemap, changefreq: e.target.value } })}
                  placeholder="weekly"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
                />
              </FormField>
              <FormField label="Priority">
                <input
                  value={data.sitemap.priority}
                  onChange={(e) => setData({ ...data, sitemap: { ...data.sitemap, priority: e.target.value } })}
                  placeholder="0.8"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
                />
              </FormField>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 m-0 mt-0 max-w-md">
              <FormField label="Google Analytics ID">
                <input
                  value={data.analytics.googleAnalyticsId}
                  onChange={(e) => setData({ ...data, analytics: { ...data.analytics, googleAnalyticsId: e.target.value } })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm outline-none"
                />
              </FormField>
              <FormField label="Google Tag Manager ID">
                <input
                  value={data.analytics.googleTagManagerId}
                  onChange={(e) => setData({ ...data, analytics: { ...data.analytics, googleTagManagerId: e.target.value } })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm outline-none"
                />
              </FormField>
              <FormField label="Facebook Pixel ID">
                <input
                  value={data.analytics.facebookPixelId}
                  onChange={(e) => setData({ ...data, analytics: { ...data.analytics, facebookPixelId: e.target.value } })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm outline-none"
                />
              </FormField>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
