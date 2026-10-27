'use client';

import React from 'react';
import { useTheme, AppTheme } from '@/lib/theme/context';
import { Palette } from 'lucide-react';

const THEME_OPTIONS: Array<{ id: AppTheme; label: string }> = [
  { id: 'obsidian', label: 'Obsidian' },
  { id: 'droplets', label: 'Droplets' },
  { id: 'sketch', label: 'Sketch' },
  { id: 'concrete', label: 'Concrete' },
];

export function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`inline-flex items-center gap-1.5 p-1 rounded-xl bg-grey-900 border border-grey-700 ${className}`}>
      <Palette className="w-4 h-4 text-grey-300 ms-1.5 shrink-0" aria-hidden="true" />
      <div className="flex gap-1">
        {THEME_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            aria-pressed={theme === opt.id}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              theme === opt.id
                ? 'bg-lime text-black shadow'
                : 'text-grey-300 hover:text-text hover:bg-grey-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
