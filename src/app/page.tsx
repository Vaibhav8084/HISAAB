'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { ReadAloudButton } from '@/components/ui/ReadAloudButton';
import { Users, ShieldCheck, Scale, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const { t } = useI18n();

  return (
    <main id="main-content" className="flex-1 flex flex-col justify-between max-w-xl mx-auto w-full p-4 sm:p-6 space-y-8">
      {/* Top Bar with Language and Theme */}
      <header className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          <Scale className="w-7 h-7 text-lime" aria-hidden="true" />
          <span className="font-extrabold text-xl tracking-tight text-text">FairShift</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      {/* Hero Welcome */}
      <div className="text-center space-y-3 pt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight leading-tight">
          {t('welcome.title')}
        </h1>
        <p className="text-lg text-grey-300 max-w-md mx-auto leading-relaxed">
          {t('welcome.subtitle')}
        </p>
        <div className="pt-2">
          <ReadAloudButton />
        </div>
      </div>

      {/* Two Big Tiles */}
      <div className="space-y-4">
        {/* Tile 1: I work here */}
        <Link
          href="/login/sector"
          className="glass-card min-h-[110px] w-full p-5 flex items-center gap-5 transition-all duration-200 active:scale-[0.98] border-2 border-lime/40 hover:border-lime bg-lime/5 group rounded-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-lime text-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <Users className="w-9 h-9" aria-hidden="true" />
          </div>
          <div className="flex-1 text-start">
            <h2 className="text-2xl font-bold text-text group-hover:text-lime transition-colors">
              {t('welcome.i_work_here')}
            </h2>
            <p className="text-base text-grey-300 mt-1 leading-snug">
              {t('welcome.i_work_here_desc')}
            </p>
          </div>
        </Link>

        {/* Tile 2: Admin dashboard */}
        <Link
          href="/admin/login"
          className="glass-card min-h-[110px] w-full p-5 flex items-center gap-5 transition-all duration-200 active:scale-[0.98] border border-grey-700 hover:border-grey-500 rounded-2xl group"
        >
          <div className="w-16 h-16 rounded-2xl bg-grey-900 border border-grey-700 text-grey-300 group-hover:text-text flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-9 h-9" aria-hidden="true" />
          </div>
          <div className="flex-1 text-start">
            <h2 className="text-2xl font-bold text-text">
              {t('welcome.admin_dashboard')}
            </h2>
            <p className="text-base text-grey-300 mt-1 leading-snug">
              {t('welcome.admin_dashboard_desc')}
            </p>
          </div>
        </Link>
      </div>

      {/* Bottom Footer & Showcase Link */}
      <footer className="pt-6 border-t border-grey-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-grey-500 gap-3">
        <p className="text-center sm:text-start">{t('app.motto')}</p>
        <Link
          href="/design"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-grey-900/80 text-grey-300 hover:text-lime font-bold border border-grey-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-lime" />
          <span>Design System</span>
        </Link>
      </footer>
    </main>
  );
}
