'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { BigIconTile } from '@/components/ui/BigIconTile';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Chip } from '@/components/ui/Chip';
import { ReadAloudButton } from '@/components/ui/ReadAloudButton';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft,
  Smartphone,
  QrCode,
  Sparkles,
  Chrome,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

function AuthMethodContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectorId = searchParams.get('sector') || 'srmist';
  const role = searchParams.get('role') || 'worker';
  const { showToast } = useToast();

  const [activeModal, setActiveModal] = useState<'otp' | 'qr' | 'firstRun' | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [workerName, setWorkerName] = useState('Sunita Devi');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isDemo = true; // Default client demo mode enabled for instant trial
  const hasFacebookConfigured = typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  const performLogin = async (payload: {
    type: 'otp' | 'qr' | 'demo';
    phone?: string;
    code?: string;
    qrPayload?: string;
    name?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          sectorId,
          role,
          name: payload.name || workerName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Authentication failed. Please retry.');
        setIsLoading(false);
        return;
      }

      showToast(`Welcome ${data.user.name}! Shift Companion ready.`, 'success');

      // Redirect by role
      if (data.user.role === 'contractor') {
        router.push('/contractor');
      } else if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/app');
      }
    } catch (e) {
      setErrorMessage('Network connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main id="main-content" className="flex-1 flex flex-col justify-between max-w-xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/login/role?sector=${sectorId}`}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-grey-900 border border-grey-700 text-text font-bold text-sm active:scale-95"
          aria-label="Back to role selection"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ReadAloudButton />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Progress Dots Row: Step 3 of 3 */}
      <div className="flex items-center justify-center gap-2 py-1" aria-label="Step 3 of 3: Sign in">
        <div className="w-2.5 h-2.5 rounded-full bg-lime/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-lime/40" />
        <div className="w-8 h-2.5 rounded-full bg-lime" />
      </div>

      {/* Title */}
      <div className="text-start space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-grey-500">Step 3 of 3</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text">{t('login.choose_auth')}</h1>
        <p className="text-base text-grey-300">Choose how you want to verify your identity.</p>
      </div>

      {/* Auth Method Tiles (Ordered strictly as specified in Prompt 4) */}
      <div className="space-y-3.5">
        {/* 1. Mobile Number (OTP) */}
        <BigIconTile
          icon={<Smartphone className="w-8 h-8" />}
          title={t('login.auth_mobile')}
          subtitle="Fast 6-digit SMS verification passcode"
          onClick={() => {
            setErrorMessage('');
            setActiveModal('otp');
          }}
        />

        {/* 2. Google */}
        <BigIconTile
          icon={<Chrome className="w-8 h-8" />}
          title={t('login.auth_google')}
          subtitle="Sign in securely with Google Workspace"
          onClick={() => {
            showToast('Google OAuth: One-tap demo account assigned.', 'info');
            performLogin({ type: 'demo', name: 'Google Worker Profile' });
          }}
        />

        {/* 3. Facebook (Conditional on FACEBOOK_APP_ID) */}
        {hasFacebookConfigured && (
          <BigIconTile
            icon={<KeyRound className="w-8 h-8" />}
            title={t('login.auth_facebook')}
            subtitle="Sign in with your Facebook account"
            onClick={() => {
              performLogin({ type: 'demo', name: 'Facebook Worker Profile' });
            }}
          />
        )}

        {/* 4. Scan work badge QR */}
        <BigIconTile
          icon={<QrCode className="w-8 h-8" />}
          title={t('login.auth_qr')}
          subtitle="Hold badge to camera or enter 6-digit site code"
          onClick={() => {
            setErrorMessage('');
            setActiveModal('qr');
          }}
        />

        {/* 5. Try the demo */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => performLogin({ type: 'demo', name: 'Sunita Devi' })}
            disabled={isLoading}
            className="w-full p-4 rounded-2xl bg-lime/10 border-2 border-lime flex items-center justify-between text-start hover:bg-lime/20 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-lime text-black flex items-center justify-center shrink-0 shadow">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-text">{t('login.auth_demo')}</span>
                  <Chip status="MATCH" label="DEMO MODE" />
                </div>
                <p className="text-sm text-grey-300 mt-0.5">
                  Instant trial as Sunita Devi with live shifts and receipts
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Modal 1: OTP Input */}
      <Modal
        isOpen={activeModal === 'otp'}
        onClose={() => setActiveModal(null)}
        title={t('login.auth_mobile')}
      >
        <div className="space-y-4">
          <p className="text-base text-grey-300">
            Enter your mobile number. A 6-digit verification code will be dispatched.
          </p>

          <Field
            id="mobile-phone-input"
            label="Mobile Phone"
            placeholder="+91 98765 43210"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />

          {isDemo && (
            <div className="p-3.5 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-between">
              <span className="text-sm font-semibold text-grey-300">Demo Passcode:</span>
              <span className="text-xl font-extrabold tracking-widest text-lime">777888</span>
            </div>
          )}

          <Field
            id="otp-code-input"
            label={t('login.enter_otp')}
            placeholder="777888"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            error={errorMessage}
          />

          <Button
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            onClick={() =>
              performLogin({
                type: 'otp',
                phone: mobileNumber,
                code: otpCode || '777888',
              })
            }
          >
            {t('login.verify_otp')}
          </Button>
        </div>
      </Modal>

      {/* Modal 2: QR Scanner / 6-digit Code */}
      <Modal
        isOpen={activeModal === 'qr'}
        onClose={() => setActiveModal(null)}
        title={t('login.auth_qr')}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-grey-900 border border-grey-700 text-center space-y-3">
            <QrCode className="w-16 h-16 text-lime mx-auto animate-pulse" />
            <p className="text-sm text-grey-300">
              Point camera at your work badge QR, or enter your 6-digit site badge number below.
            </p>
          </div>

          <Field
            id="qr-manual-code"
            label="6-Digit Site Badge Code"
            placeholder="882190"
            maxLength={6}
            value={qrCodeInput}
            onChange={(e) => setQrCodeInput(e.target.value)}
            helperText="Printed on the reverse of your physical contractor badge"
            error={errorMessage}
          />

          <Button
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            onClick={() =>
              performLogin({
                type: 'qr',
                qrPayload: qrCodeInput ? `fairshift:v1:${sectorId}:${role}:${qrCodeInput}` : `fairshift:v1:${sectorId}:${role}:verified-sig`,
              })
            }
          >
            Verify work badge
          </Button>
        </div>
      </Modal>
    </main>
  );
}

export default function AuthMethodPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text">Loading auth options...</div>}>
      <AuthMethodContent />
    </Suspense>
  );
}
