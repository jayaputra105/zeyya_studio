import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { getMedia, type MediaFile } from '@/admin/cmsApi';
import { Loader2, Search, ImageIcon, FileIcon } from 'lucide-react';

interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (path: string) => void;
}

export function MediaPickerModal({ open, onOpenChange, onSelect }: MediaPickerModalProps) {
  const [search, setSearch] = useState('');

  const { data: media = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: getMedia,
    enabled: open,
  });

  const filteredMedia = media.filter(m => 
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b border-white/10 shrink-0">
          <DialogTitle>Pilih Media</DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b border-white/10 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Cari file..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
              <p>Tidak ada media ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((file) => (
                <div 
                  key={file.filename}
                  onClick={() => {
                    onSelect(file.path);
                    onOpenChange(false);
                  }}
                  className="group relative aspect-square bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#FF6B00] transition-colors"
                >
                  {file.type === 'image' ? (
                    <img 
                      src={file.url} 
                      alt={file.filename} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5">
                      <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-400 font-mono uppercase">{file.ext}</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-white truncate" title={file.filename}>
                      {file.filename}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
