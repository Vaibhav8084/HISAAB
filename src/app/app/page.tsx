'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  CheckCircle,
  Clock,
  ThermometerSun,
  ShieldCheck,
  Award,
  AlertTriangle,
  QrCode,
  MapPin,
  Camera,
} from 'lucide-react';

export default function WorkerHomePage() {
  const { t } = useI18n();
  const { showToast } = useToast();

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [shiftHoursElapsed, setShiftHoursElapsed] = useState(7.5); // Near end-of-shift window
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isStillWorkingActive, setIsStillWorkingActive] = useState(false);
  const [zone, setZone] = useState('Hostel Block A & B (Sanitation)');

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setIsCheckInModalOpen(false);
    showToast('Checked in successfully! Shift registered on tamper-evident ledger.', 'success');
  };

  const handleStillWorkingTap = () => {
    setIsStillWorkingActive(true);
    showToast('Logged: "Still working" consensus ping submitted.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Worker Greeting */}
      <div className="text-start space-y-1">
        <h1 className="text-2xl font-extrabold text-text">
          {t('worker.greeting')}, Sunita ji!
        </h1>
        <p className="text-sm text-grey-300">
          Worksite: <span className="font-semibold text-lime">{zone}</span>
        </p>
      </div>

      {/* Main Check-In / Status Action */}
      {!isCheckedIn ? (
        <div className="space-y-2">
          {/* Huge Lime 72px Check In Button */}
          <Button
            variant="huge"
            onClick={() => setIsCheckInModalOpen(true)}
            className="flex items-center justify-center gap-3 text-2xl font-extrabold shadow-2xl"
          >
            <CheckCircle className="w-8 h-8" />
            <span>{t('worker.check_in_button')}</span>
          </Button>
          <p className="text-xs text-center text-grey-500">
            One-tap check-in reads coarse zone once &bull; No live background tracking
          </p>
        </div>
      ) : (
        <Card className="border-2 border-lime/40 bg-lime/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-lime animate-ping" />
              <span className="font-bold text-lime text-base">{t('worker.checked_in_status')}</span>
            </div>
            <Chip status="MATCH" label="ACTIVE SHIFT" />
          </div>

          <div className="flex items-center justify-between py-2 border-y border-grey-700/50">
            <div>
              <span className="text-xs text-grey-500 uppercase block">Check-in time</span>
              <span className="text-lg font-bold">07:00 AM</span>
            </div>
            <div className="text-end">
              <span className="text-xs text-grey-500 uppercase block">Elapsed</span>
              <span className="text-lg font-bold text-lime">{shiftHoursElapsed}h logged</span>
            </div>
          </div>

          {/* End-of-shift window: "I am still working" button */}
          <div className="pt-1">
            <Button
              variant={isStillWorkingActive ? 'secondary' : 'primary'}
              onClick={handleStillWorkingTap}
              className="w-full text-lg"
            >
              {isStillWorkingActive
                ? 'Still working logged (Consensus active)'
                : t('worker.still_working_button')}
            </Button>
            <p className="text-xs text-center text-grey-500 mt-2">
              If 3+ coworkers in your zone tap this, unlogged overtime is flagged automatically.
            </p>
          </div>
        </Card>
      )}

      {/* Readiness Check Card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-lime" />
            <span>{t('worker.readiness_title')}</span>
          </h2>
          <Chip status="MATCH" label="FIT FOR WORK" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Rest Hours Indicator */}
          <div className="p-3.5 rounded-xl bg-grey-900 border border-grey-700 space-y-1">
            <div className="flex items-center gap-1.5 text-grey-300 text-xs font-semibold">
              <Clock className="w-4 h-4 text-lime" />
              <span>{t('worker.rest_hours_label')}</span>
            </div>
            <p className="text-2xl font-extrabold text-lime">14.5h</p>
            <p className="text-[11px] text-grey-500">Exceeds 10h statutory rest</p>
          </div>

          {/* Heat Stress Level */}
          <div className="p-3.5 rounded-xl bg-grey-900 border border-grey-700 space-y-1">
            <div className="flex items-center gap-1.5 text-grey-300 text-xs font-semibold">
              <ThermometerSun className="w-4 h-4 text-warn" />
              <span>{t('worker.heat_stress_label')}</span>
            </div>
            <p className="text-2xl font-extrabold text-warn">31°C</p>
            <p className="text-[11px] text-grey-500">10m shade rest / hour</p>
          </div>
        </div>

        {/* Optional PPE verification */}
        <div className="p-3 rounded-xl bg-grey-900/60 border border-grey-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-grey-300" />
            <span className="text-grey-300">Safety Gear Photo (Optional)</span>
          </div>
          <span className="text-lime font-bold">Gloves & Apron Verified</span>
        </div>
      </Card>

      {/* Skill Passport Progress Card */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-lime" />
            <h2 className="text-lg font-bold text-text">{t('worker.skill_passport_title')}</h2>
          </div>
          <span className="text-xs font-bold text-lime">LEVEL 2 OPERATOR</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-grey-300">
            <span>{t('worker.safe_hours_progress')}</span>
            <span className="font-bold text-text">188 / 200 hours</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-3 bg-grey-900 rounded-full overflow-hidden border border-grey-700">
            <div
              className="h-full bg-lime rounded-full transition-all duration-500"
              style={{ width: '94%' }}
            />
          </div>
          <p className="text-xs text-grey-500 pt-0.5">
            12 safe hours to Senior Operator certification badge
          </p>
        </div>
      </Card>

      {/* Check In Modal */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title={t('worker.check_in_button')}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-grey-900 border border-grey-700 text-start space-y-2">
            <div className="flex items-center gap-2 text-lime font-bold text-base">
              <MapPin className="w-5 h-5" />
              <span>Assigned Worksite Zone</span>
            </div>
            <p className="text-lg font-extrabold text-text">{zone}</p>
            <p className="text-xs text-grey-500">
              Coarsened location stamp attached to tamper-evident blockchain receipt.
            </p>
          </div>

          <Button variant="huge" onClick={handleCheckIn} className="w-full text-xl font-extrabold">
            Confirm check-in for shift
          </Button>

          <Button variant="ghost" onClick={() => setIsCheckInModalOpen(false)} className="w-full">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
