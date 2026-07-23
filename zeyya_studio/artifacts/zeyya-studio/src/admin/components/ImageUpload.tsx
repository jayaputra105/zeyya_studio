import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadFile } from '@/admin/cmsApi';
import { MediaPickerModal } from './MediaPickerModal';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, className, placeholder = "Upload atau pilih gambar" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadFile(file);
      onChange(res.path);
      toast.success("Gambar berhasil diupload");
    } catch (err: any) {
      toast.error(err.message || "Gagal upload gambar");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    try {
      setIsUploading(true);
      const res = await uploadFile(file);
      onChange(res.path);
      toast.success("Gambar berhasil diupload");
    } catch (err: any) {
      toast.error(err.message || "Gagal upload gambar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "relative border-2 border-dashed border-white/20 rounded-xl overflow-hidden bg-[#0A0A0A] hover:bg-white/[0.02] transition-colors group",
          !value && "aspect-video",
          className
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="relative group/image">
            <img src={value} alt="Preview" className="w-full h-auto max-h-[300px] object-contain bg-black/50" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                title="Ganti gambar"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                title="Upload baru"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                title="Hapus gambar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-gray-500">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-[#FF6B00]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-medium">Mengupload...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-white/5 rounded-full">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-300">{placeholder}</p>
                  <p className="text-xs text-gray-500">Drag & drop atau klik tombol di bawah</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Pilih Media
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-3 py-1.5 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 text-[#FF6B00] rounded-lg transition-colors"
                  >
                    Upload File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      <MediaPickerModal 
        open={pickerOpen} 
        onOpenChange={setPickerOpen} 
        onSelect={onChange} 
      />
    </>
  );
}
