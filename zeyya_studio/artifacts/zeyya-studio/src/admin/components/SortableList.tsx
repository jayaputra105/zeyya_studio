import React from 'react';
import { ArrowUp, ArrowDown, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SortableListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  onDelete?: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function SortableList<T>({ items, onReorder, onDelete, renderItem, className }: SortableListProps<T>) {
  
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    onReorder(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    onReorder(newItems);
  };

  if (items.length === 0) {
    return (
      <div className="py-8 text-center border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02]">
        <p className="text-gray-500 text-sm">Tidak ada item.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3 p-3 bg-[#111111] border border-white/10 rounded-xl group hover:border-white/20 transition-colors">
          <div className="flex flex-col gap-1 pt-1 opacity-20 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="p-1 hover:bg-white/10 rounded text-white disabled:opacity-30"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => moveDown(index)}
              disabled={index === items.length - 1}
              className="p-1 hover:bg-white/10 rounded text-white disabled:opacity-30"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 min-w-0">
            {renderItem(item, index)}
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
