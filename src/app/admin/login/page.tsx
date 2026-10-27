'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Chip } from '@/components/ui/Chip';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ReadAloudButton } from '@/components/ui/ReadAloudButton';
import { ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [adminPin, setAdminPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = async (useDemoPin = false) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin',
          code: useDemoPin ? '777888' : adminPin,
          sectorId: 'srmist',
          role: 'admin',
          name: 'Principal Workplace Inspector',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Admin authentication failed.');
        setIsLoading(false);
        return;
      }

      router.push('/admin');
    } catch (e) {
      setErrorMessage('Network connection error.');
      setIsLoading(false);
    }
  };

  return (
    <main id="main-content" className="flex-1 flex flex-col justify-between max-w-lg mx-auto w-full p-4 sm:p-6 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-grey-900 border border-grey-700 text-text font-bold text-sm active:scale-95"
          aria-label="Back to welcome page"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ReadAloudButton />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Admin Login Card */}
      <div className="glass-card p-6 sm:p-8 space-y-6 border-2 border-grey-700 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-grey-900 border border-grey-700 flex items-center justify-center mx-auto text-lime shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
            {t('welcome.admin_dashboard')}
          </h1>
          <p className="text-base text-grey-300">
            Employer Command Cockpit & Statutory Compliance
          </p>
          <div className="pt-1">
            <Chip status="OPEN" label="PRINCIPAL EMPLOYER PORTAL" />
          </div>
        </div>

        <div className="space-y-4">
          <Field
            id="admin-security-pin"
            type="password"
            label="Admin Security PIN"
            placeholder="••••••"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            helperText="Enter 6-digit administrative security credential"
            error={errorMessage}
          />

          <Button
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            onClick={() => handleAdminLogin(false)}
          >
            Authenticate admin
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-grey-700"></div>
            <span className="flex-shrink mx-4 text-xs font-bold uppercase text-grey-500">
              Demo Quick Access
            </span>
            <div className="flex-grow border-t border-grey-700"></div>
          </div>

          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2 border-lime/40 text-lime"
            isLoading={isLoading}
            onClick={() => handleAdminLogin(true)}
          >
            <KeyRound className="w-5 h-5" />
            <span>Launch demo admin cockpit</span>
          </Button>
        </div>
      </div>

      <div className="text-center text-xs text-grey-500">
        SDG 8 Workplace Compliance &bull; Audit-Ready Inspection Records
      </div>
    </main>
  );
}
