'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { SEED_USERS, SEED_SHIFTS, SEED_CORRECTIONS } from '@/lib/storage/seedData';
import {
  Users,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  TrendingUp,
  Clock,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export default function ContractorPortalPage() {
  const { t } = useI18n();
  const { showToast } = useToast();

  const [corrections, setCorrections] = useState([...SEED_CORRECTIONS]);
  const [selectedCorrection, setSelectedCorrection] = useState<any>(null);
  const [contractorResponseNote, setContractorResponseNote] = useState('');
  const [isPayEntryModalOpen, setIsPayEntryModalOpen] = useState(false);
  const [payEntryWorker, setPayEntryWorker] = useState('worker-sunita');
  const [payEntryHours, setPayEntryHours] = useState('9');
  const [payEntryAmount, setPayEntryAmount] = useState('1080');

  const contractorCrew = SEED_USERS.filter((u) => u.sectorId === 'srmist' && u.role === 'worker');

  const handleResolveCorrection = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setCorrections((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: action,
              contractorComment: contractorResponseNote || (action === 'APPROVED' ? 'Approved by agency' : 'Hours not corroborated'),
            }
          : c
      )
    );
    setSelectedCorrection(null);
    setContractorResponseNote('');
    showToast(
      action === 'APPROVED'
        ? 'Correction approved! Worker receipt reconciled to MATCH.'
        : 'Correction rejected with supervisor remark.',
      action === 'APPROVED' ? 'success' : 'info'
    );
  };

  const handleCreatePayEntry = () => {
    showToast(`Wage disbursement of ₹${payEntryAmount} logged for ${payEntryHours} hours. Paid record created!`, 'success');
    setIsPayEntryModalOpen(false);
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-grey-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-grey-500 hover:text-lime">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">{t('contractor.title')}</h1>
          <p className="text-sm text-grey-300">
            Balaji Facility Services (Thekedar) &bull; SRMIST Campus Sanitation Contract
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsPayEntryModalOpen(true)}
            className="flex items-center gap-1.5 text-sm"
          >
            <DollarSign className="w-4 h-4" />
            <span>{t('contractor.enter_pay')}</span>
          </Button>
        </div>
      </header>

      {/* Scorecard Overview */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-grey-500">
          {t('contractor.scorecard')} (Verified by Principal Employer)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="text-center p-4">
            <span className="text-xs text-grey-500 uppercase block">Pay Accuracy</span>
            <span className="text-2xl font-black text-lime mt-1 block">94.2%</span>
            <span className="text-[11px] text-grey-500">2 open corrections</span>
          </Card>
          <Card className="text-center p-4">
            <span className="text-xs text-grey-500 uppercase block">Disbursement Time</span>
            <span className="text-2xl font-black text-lime mt-1 block">&lt; 24h</span>
            <span className="text-[11px] text-grey-500">Fast clearance</span>
          </Card>
          <Card className="text-center p-4">
            <span className="text-xs text-grey-500 uppercase block">Hazard Closure</span>
            <span className="text-2xl font-black text-warn mt-1 block">88%</span>
            <span className="text-[11px] text-grey-500">1 awaiting After photo</span>
          </Card>
          <Card className="text-center p-4">
            <span className="text-xs text-grey-500 uppercase block">Crew Trust Score</span>
            <span className="text-2xl font-black text-lime mt-1 block">4.6 / 5</span>
            <span className="text-[11px] text-grey-500">Zero urgent walkouts</span>
          </Card>
        </div>
      </section>

      {/* Corrections Inbox */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-grey-500">
            Corrections Inbox (Worker Wage Review Requests)
          </h2>
          <span className="text-xs font-bold text-warn">
            {corrections.filter((c) => c.status === 'PENDING').length} Action(s) Required
          </span>
        </div>

        <div className="space-y-3">
          {corrections.map((corr) => (
            <Card key={corr.id} className="space-y-3 border-grey-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-text">{corr.workerName}</span>
                  <span className="text-xs text-grey-500 block">Shift Date: {corr.shiftDate}</span>
                </div>
                <Chip
                  status={corr.status === 'PENDING' ? 'NEEDS_REVIEW' : 'MATCH'}
                  label={corr.status}
                />
              </div>

              <div className="p-3 rounded-xl bg-grey-900 border border-grey-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-grey-500">Claimed: {corr.claimedHours}h vs Paid: {corr.paidHours}h</span>
                  <span className="font-extrabold text-danger">Unpaid Difference: ₹{corr.claimedDifferenceRupees}</span>
                </div>
                <p className="text-grey-300 italic pt-1">Worker note: &quot;{corr.workerNote}&quot;</p>
              </div>

              {corr.status === 'PENDING' ? (
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setSelectedCorrection(corr)}
                    className="text-xs text-grey-300"
                  >
                    Respond & Remark
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleResolveCorrection(corr.id, 'APPROVED')}
                    className="text-xs"
                  >
                    Approve & Disburse ₹{corr.claimedDifferenceRupees}
                  </Button>
                </div>
              ) : (
                <div className="text-xs text-lime font-bold">
                  Status: {corr.status} &bull; Comment: {corr.contractorComment || 'Settled'}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Crew List & Attendance Approvals */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-grey-500">
          {t('contractor.crew')} ({contractorCrew.length} Active Personnel)
        </h2>
        <div className="space-y-2.5">
          {contractorCrew.map((worker) => (
            <Card key={worker.id} className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-grey-900 border border-grey-700 flex items-center justify-center text-lg">
                  {worker.avatar || '👷'}
                </div>
                <div>
                  <span className="text-base font-bold text-text block">{worker.name}</span>
                  <span className="text-xs text-grey-500">
                    Rate: ₹{worker.hourlyRate}/h &bull; {worker.phone}
                  </span>
                </div>
              </div>
              <div className="text-end">
                <span className="text-xs font-bold text-lime block">Muster Active</span>
                <span className="text-xs text-grey-500">{worker.safeHoursLogged} safe hours</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Modal: Log Wage Disbursement */}
      <Modal
        isOpen={isPayEntryModalOpen}
        onClose={() => setIsPayEntryModalOpen(false)}
        title={t('contractor.enter_pay')}
      >
        <div className="space-y-4">
          <p className="text-sm text-grey-300">
            Log wage settlement. This creates the official tamper-evident &quot;Paid&quot; record on the shift ledger.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-grey-300">Select Worker</label>
            <select
              value={payEntryWorker}
              onChange={(e) => setPayEntryWorker(e.target.value)}
              className="w-full min-h-[48px] px-3 rounded-xl bg-grey-900 border border-grey-700 text-text text-sm focus:ring-2 focus:ring-lime"
            >
              {contractorCrew.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (₹{c.hourlyRate}/h)
                </option>
              ))}
            </select>
          </div>

          <Field
            id="pay-entry-hours"
            label="Hours to Pay"
            type="number"
            value={payEntryHours}
            onChange={(e) => {
              setPayEntryHours(e.target.value);
              setPayEntryAmount(String(Number(e.target.value) * 120));
            }}
          />

          <Field
            id="pay-entry-amount"
            label="Disbursed Rupee Amount (₹)"
            type="number"
            value={payEntryAmount}
            onChange={(e) => setPayEntryAmount(e.target.value)}
          />

          <Button variant="primary" className="w-full" onClick={handleCreatePayEntry}>
            Commit disbursement record
          </Button>
        </div>
      </Modal>

      {/* Modal: Respond to Correction */}
      <Modal
        isOpen={!!selectedCorrection}
        onClose={() => setSelectedCorrection(null)}
        title="Respond to Worker Correction"
      >
        {selectedCorrection && (
          <div className="space-y-4">
            <p className="text-sm text-grey-300">
              Provide a supervisor reason before resolving this correction.
            </p>
            <textarea
              rows={3}
              value={contractorResponseNote}
              onChange={(e) => setContractorResponseNote(e.target.value)}
              placeholder="e.g., Verified with CCTV gate pass; approved 1 hour overtime..."
              className="w-full p-3 rounded-xl bg-grey-900 border border-grey-700 text-text text-sm focus:ring-2 focus:ring-lime"
            />
            <div className="flex gap-2">
              <Button
                variant="danger"
                className="flex-1 text-xs"
                onClick={() => handleResolveCorrection(selectedCorrection.id, 'REJECTED')}
              >
                Reject claim
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-xs"
                onClick={() => handleResolveCorrection(selectedCorrection.id, 'APPROVED')}
              >
                Approve claim
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
