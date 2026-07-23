import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMedia, deleteMedia, uploadFile, type MediaFile } from '@/admin/cmsApi';
import { Upload, Search, Trash2, Copy, Image as ImageIcon, FileIcon, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { cn } from '@/lib/utils';

export default function MediaLibrary() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<MediaFile | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaFile | null>(null);

  const { data: media = [], isLoading, refetch } = useQuery({
    queryKey: ['media'],
    queryFn: getMedia,
  });

  const deleteMutation = useMutation({
    mutationFn: (filename: string) => deleteMedia(filename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success('Media berhasil dihapus');
      setSelectedItem(null);
    },
    onError: (err: any) => toast.error(err.message || 'Gagal menghapus media'),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadFile(file);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success('File berhasil diupload');
    } catch (err: any) {
      toast.error(err.message || 'Gagal upload file');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Path dicopy ke clipboard');
  };

  const filteredMedia = media.filter(m => 
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Cari file..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-[#FF6B00] outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => refetch()} className="text-gray-400 hover:text-white" disabled={isLoading}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
            <div className="relative">
              <Button className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl">
                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload File
              </Button>
              <input 
                type="file" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload file"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-gray-300">Belum ada media</p>
              <p className="text-sm mt-1">Upload gambar atau file untuk mulai.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-max">
              {filteredMedia.map((file) => (
                <div 
                  key={file.filename}
                  onClick={() => setSelectedItem(file)}
                  className={cn(
                    "group relative aspect-square bg-[#111111] border rounded-xl overflow-hidden cursor-pointer transition-colors",
                    selectedItem?.filename === file.filename ? "border-[#FF6B00] ring-1 ring-[#FF6B00]" : "border-white/10 hover:border-white/30"
                  )}
                >
                  {file.type === 'image' ? (
                    <img 
                      src={file.url} 
                      alt={file.filename} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5">
                      <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-[10px] text-gray-400 font-mono uppercase bg-white/10 px-2 py-0.5 rounded">{file.ext}</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-[10px] text-white truncate font-medium" title={file.filename}>
                      {file.filename}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Detail */}
      {selectedItem && (
        <div className="w-80 bg-[#111111] border-l border-white/[0.08] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
            <h3 className="font-semibold text-white">Detail Media</h3>
            <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white">
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="aspect-video bg-[#0A0A0A] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden mb-6">
              {selectedItem.type === 'image' ? (
                <img src={selectedItem.url} alt={selectedItem.filename} className="max-w-full max-h-full object-contain" />
              ) : (
                <FileIcon className="w-12 h-12 text-gray-500" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Filename</label>
                <p className="text-sm text-white break-all">{selectedItem.filename}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Type</label>
                  <p className="text-sm text-white">{selectedItem.mimetype || selectedItem.type}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Size</label>
                  <p className="text-sm text-white">{formatSize(selectedItem.size)}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Uploaded</label>
                <p className="text-sm text-white">{formatDate(selectedItem.createdAt)}</p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm border-white/10 hover:bg-white/5"
                  onClick={() => copyToClipboard(selectedItem.path)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Path
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm border-white/10 hover:bg-white/5"
                  onClick={() => copyToClipboard(selectedItem.url)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Full URL
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start text-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-transparent"
                  onClick={() => setDeleteItem(selectedItem)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete File
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Hapus Media?"
        description={`Apakah Anda yakin ingin menghapus "${deleteItem?.filename}"? Aksi ini tidak dapat dibatalkan.`}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.filename)}
      />
    </div>
  );
}
