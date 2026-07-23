import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Star } from 'lucide-react';

interface StatusBadgeProps {
  type: 'published' | 'draft' | 'featured';
  className?: string;
}

export function StatusBadge({ type, className }: StatusBadgeProps) {
  if (type === 'published') {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20", className)}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        Live
      </span>
    );
  }
  
  if (type === 'featured') {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20", className)}>
        <Star className="w-3.5 h-3.5 fill-[#FF6B00]" />
        Featured
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-gray-400 border border-white/10", className)}>
      <Circle className="w-3.5 h-3.5" />
      Draft
    </span>
  );
}
