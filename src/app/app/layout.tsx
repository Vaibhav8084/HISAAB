'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { Modal } from '@/components/ui/Modal';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { ReadAloudButton } from '@/components/ui/ReadAloudButton';
import { Button } from '@/components/ui/Button';
import {
  Home,
  IndianRupee,
  ShieldAlert,
  Megaphone,
  BookOpen,
  Settings,
  LogOut,
  MapPin,
  WifiOff,
} from 'lucide-react';

export default function WorkerAppLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { skyEffects, setSkyEffects } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [useLocationEnabled, setUseLocationEnabled] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const savedLoc = localStorage.getItem('fairshift_custom_location');
    if (savedLoc) setUseLocationEnabled(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleLocation = () => {
    if (!useLocationEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const roundedLat = Number(pos.coords.latitude.toFixed(2));
            const roundedLon = Number(pos.coords.longitude.toFixed(2));
            localStorage.setItem(
              'fairshift_custom_location',
              JSON.stringify({ lat: roundedLat, lon: roundedLon })
            );
            setUseLocationEnabled(true);
          },
          () => {
            // Permission denied or unavailable
          }
        );
      }
    } else {
      localStorage.removeItem('fairshift_custom_location');
      setUseLocationEnabled(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (e) {
      router.push('/');
    }
  };

  const navItems = [
    { href: '/app', label: t('nav.home'), icon: Home },
    { href: '/app/money', label: t('nav.money'), icon: IndianRupee },
    { href: '/app/safety', label: t('nav.safety'), icon: ShieldAlert },
    { href: '/app/speak-up', label: t('nav.speak_up'), icon: Megaphone },
    { href: '/app/rights', label: t('nav.rights'), icon: BookOpen },
  ];

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full min-h-screen pb-20">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div
          role="alert"
          className="bg-warn text-black px-4 py-2 text-sm font-bold flex items-center justify-between shadow sticky top-0 z-40"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>{t('worker.offline_banner')}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="p-4 flex items-center justify-between border-b border-grey-900 bg-obsidian/40 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lime text-black flex items-center justify-center font-extrabold text-base shadow">
            SD
          </div>
          <div>
            <span className="text-xs font-semibold text-grey-500 uppercase tracking-wider block">
              SRMIST Campus &bull; Housekeeping
            </span>
            <span className="text-lg font-bold text-text">Sunita Devi</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ReadAloudButton className="p-2" />
          <button
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
            className="p-2 rounded-xl bg-grey-900 border border-grey-700 text-grey-300 hover:text-text active:scale-95"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <div className="flex-1 p-4">{children}</div>

      {/* Bottom Navigation (Strictly 64px high with Icon AND Text) */}
      <nav
        aria-label="Main application tabs"
        className="fixed bottom-0 start-0 end-0 z-40 bg-obsidian/95 border-t border-grey-700 backdrop-blur-xl h-16 max-w-md mx-auto flex items-center justify-around px-2"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center h-full gap-0.5 select-none transition-colors active:scale-95 ${
                isActive ? 'text-lime font-bold' : 'text-grey-300 hover:text-text'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} aria-hidden="true" />
              <span className="text-[11px] leading-tight text-center truncate max-w-[68px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t('settings.title')}>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-grey-300 mb-2 block">{t('settings.language')}</label>
            <LanguageSwitcher className="w-full justify-between" />
          </div>

          <div>
            <label className="text-sm font-bold text-grey-300 mb-2 block">{t('settings.theme')}</label>
            <ThemeSwitcher className="w-full justify-between" />
          </div>

          <div>
            <label className="text-sm font-bold text-grey-300 mb-2 block">{t('settings.sky_effects')}</label>
            <div className="flex gap-2">
              {(['auto', 'reduced', 'off'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSkyEffects(mode)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border capitalize transition-all ${
                    skyEffects === mode
                      ? 'bg-lime text-black border-lime'
                      : 'bg-grey-900 text-grey-300 border-grey-700'
                  }`}
                >
                  {t(`settings.sky_${mode}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-grey-900 border border-grey-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-lime" />
              <div className="text-start">
                <span className="text-sm font-bold block">{t('settings.use_location')}</span>
                <span className="text-xs text-grey-500">Coarsened to 2 decimals &bull; Never stored on server</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={useLocationEnabled}
              onChange={handleToggleLocation}
              aria-label="Use coarse location"
              className="w-5 h-5 accent-lime rounded cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-grey-700">
            <Button
              variant="danger"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>{t('settings.logout')}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
