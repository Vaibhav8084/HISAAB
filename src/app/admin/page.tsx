'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { useToast } from '@/components/ui/Toast';
import { SECTORS } from '@/config/sectors';
import { SEED_USERS, SEED_HAZARDS, SEED_COMPLAINTS, SEED_CORRECTIONS } from '@/lib/storage/seedData';
import { evaluateEscrowGroup } from '@/core/escrow';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  Users,
  Download,
  Building2,
  HardHat,
  Stethoscope,
  TrendingUp,
  Clock,
  CheckCircle2,
  Megaphone,
  Printer,
  ChevronRight,
  LogOut,
  Flame,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminCommandCockpitPage() {
  const { t } = useI18n();
  const { showToast } = useToast();

  const [activeSectorId, setActiveSectorId] = useState('srmist');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'paygaps' | 'safety' | 'voice' | 'overtime' | 'contractors' | 'people' | 'compliance'
  >('overview');

  const currentSector = SECTORS[activeSectorId] || SECTORS.srmist;

  // Impact metrics
  const rupeesRecovered = 18450;
  const hazardsFixed = 14;
  const restHoursProtected = 328;
  const decentWorkIndex = 87; // SDG 8 target composite score

  // Voice: Only show unlocked collective alerts (locked complaints are strictly hidden!)
  const unlockedComplaints = SEED_COMPLAINTS.filter((c) => {
    const group = SEED_COMPLAINTS.filter((item) => item.targetId === c.targetId);
    const evalResult = evaluateEscrowGroup(c.targetId, group);
    return evalResult.isUnlocked;
  });

  const handleDownloadCsv = (type: 'muster' | 'overtime' | 'wage') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'muster') {
      csvContent += 'Worker ID,Name,Sector,Zone,Muster Date,Status,Verified By\n';
      csvContent += 'worker-sunita,Sunita Devi,SRMIST,Hostel Block A,2026-10-25,PRESENT,Two-Key Shift\n';
      csvContent += 'worker-rajesh,Rajesh Kumar,SRMIST,Hostel Block A,2026-10-25,PRESENT,Two-Key Shift\n';
      csvContent += 'worker-priya,Priya Nair,SRMIST,Hostel Block B,2026-10-25,PRESENT,Two-Key Shift\n';
    } else if (type === 'overtime') {
      csvContent += 'Worker ID,Name,Date,Standard Hours,Overtime Hours,Overtime Multiplier,Pay Due (INR)\n';
      csvContent += 'worker-sunita,Sunita Devi,2026-10-22,8.0,2.0,2.0x,480\n';
      csvContent += 'worker-amit,Amit Verma,2026-10-24,8.0,3.0,2.0x,960\n';
    } else {
      csvContent += 'Worker ID,Name,Gross Wages,Overtime,Deductions,Net Disbursed,Receipt Status\n';
      csvContent += 'worker-sunita,Sunita Devi,1080,240,50,1270,MATCH\n';
      csvContent += 'worker-priya,Priya Nair,960,0,0,960,MATCH\n';
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FairShift_${type}_register_${activeSectorId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded ${type} register as statutory CSV.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-black text-text">
      {/* Desktop Left Sidebar */}
      <aside className="w-full md:w-64 bg-obsidian border-b md:border-b-0 md:border-r border-grey-800 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <Scale className="w-7 h-7 text-lime" />
            <div>
              <span className="font-extrabold text-lg text-text block leading-none">FairShift</span>
              <span className="text-[10px] font-bold text-grey-500 uppercase tracking-widest">
                Command Cockpit
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview & SDG 8', icon: TrendingUp },
              { id: 'paygaps', label: 'Pay Gaps Queue', icon: Scale },
              { id: 'safety', label: 'Safety & Clock SLAs', icon: ShieldCheck },
              { id: 'voice', label: 'Collective Voice Vault', icon: Megaphone },
              { id: 'overtime', label: 'Consensus Overtime', icon: Clock },
              { id: 'contractors', label: 'Thekedar Scorecards', icon: Building2 },
              { id: 'people', label: 'Burnout & Risk Radar', icon: Flame },
              { id: 'compliance', label: 'Inspection Pack', icon: FileSpreadsheet },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-start ${
                    isActive
                      ? 'bg-lime text-black shadow'
                      : 'text-grey-300 hover:text-text hover:bg-grey-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-grey-800 flex items-center justify-between text-xs">
          <Link href="/" className="flex items-center gap-1.5 text-grey-500 hover:text-danger font-bold">
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </Link>
          <span className="text-[10px] text-grey-600">UN SDG 8</span>
        </div>
      </aside>

      {/* Main Command Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Bar with Sector Switcher, Theme & Language */}
        <header className="p-4 sm:px-8 border-b border-grey-800 bg-obsidian/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Sector Switcher (Campus Staff vs Metro Construction vs Hospital) */}
            <label className="text-xs font-bold uppercase text-grey-500">Sector Profile:</label>
            <select
              value={activeSectorId}
              onChange={(e) => {
                setActiveSectorId(e.target.value);
                showToast(`Switched workplace sector to ${SECTORS[e.target.value]?.name}`, 'info');
              }}
              className="bg-grey-900 border border-grey-700 text-lime font-bold text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-lime cursor-pointer"
            >
              <option value="srmist">SRMIST Campus Facility & Hostel Staff</option>
              <option value="metro">Metro Rail Construction (Line 4)</option>
              <option value="hospital">District General Hospital Support</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 space-y-8 flex-1 max-w-6xl w-full mx-auto">
          {/* TAB 1: OVERVIEW & SDG 8 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-text">Workplace Fairness Impact</h2>
                <p className="text-sm text-grey-300">
                  Measuring real-time compliance with UN SDG 8: Decent Work & Economic Growth
                </p>
              </div>

              {/* Impact Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-grey-500 block">
                    Decent Work Index
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-lime">{decentWorkIndex}</span>
                    <span className="text-sm font-semibold text-lime">/ 100</span>
                  </div>
                  <p className="text-xs text-grey-300 mt-2">Mapped to SDG 8.5 & 8.8 Targets</p>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-grey-500 block">
                    Wages Reconciled
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-text">₹{rupeesRecovered}</span>
                  </div>
                  <p className="text-xs text-grey-300 mt-2">Zero unacknowledged arrears</p>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-grey-500 block">
                    Hazards Verifiably Fixed
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-lime">{hazardsFixed}</span>
                    <span className="text-sm text-grey-300">closed</span>
                  </div>
                  <p className="text-xs text-grey-300 mt-2">100% Two-Key worker authenticated</p>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-grey-500 block">
                    Rest Hours Protected
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-text">{restHoursProtected}h</span>
                  </div>
                  <p className="text-xs text-grey-300 mt-2">Mandatory 10h rest enforced</p>
                </Card>
              </div>

              {/* SDG 8 Breakdown Graphic (Inline SVG) */}
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-text">UN SDG 8 Sub-Target Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Target 8.5: Equal Pay for Work of Equal Value</span>
                      <span className="text-lime">92%</span>
                    </div>
                    <div className="w-full h-3 bg-grey-900 rounded-full overflow-hidden">
                      <div className="h-full bg-lime rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Target 8.8: Protect Labour Rights & Safe Working Environments</span>
                      <span className="text-lime">88%</span>
                    </div>
                    <div className="w-full h-3 bg-grey-900 rounded-full overflow-hidden">
                      <div className="h-full bg-lime rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Target 8.7: Eradicate Forced & Precarious Undercompensated Labor</span>
                      <span className="text-lime">96%</span>
                    </div>
                    <div className="w-full h-3 bg-grey-900 rounded-full overflow-hidden">
                      <div className="h-full bg-lime rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: PAY GAPS QUEUE */}
          {activeTab === 'paygaps' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-text">Wage Discrepancy & Correction Queue</h2>
              <div className="space-y-3">
                {SEED_CORRECTIONS.map((c) => (
                  <Card key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-text">{c.workerName}</span>
                        <Chip status={c.status === 'PENDING' ? 'NEEDS_REVIEW' : 'MATCH'} label={c.status} />
                      </div>
                      <p className="text-xs text-grey-500">
                        Shift: {c.shiftDate} &bull; Claimed: {c.claimedHours}h vs Paid: {c.paidHours}h
                      </p>
                      <p className="text-sm text-grey-300 mt-1">&quot;{c.workerNote}&quot;</p>
                    </div>
                    <div className="text-end shrink-0">
                      <span className="text-xs text-grey-500 uppercase block">Pending Settlement</span>
                      <span className="text-2xl font-black text-danger">₹{c.claimedDifferenceRupees}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SAFETY & CLOCK SLAs */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-text">Hazard Escalation Clock & SLAs</h2>
              <div className="space-y-3">
                {SEED_HAZARDS.map((h) => (
                  <Card key={h.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-text">{h.title}</span>
                      <Chip status={h.severity === 'URGENT' ? 'URGENT' : 'OPEN'} label={h.severity} />
                    </div>
                    <p className="text-sm text-grey-300">{h.description}</p>
                    <div className="p-2.5 rounded bg-grey-900 border border-grey-800 flex items-center justify-between text-xs">
                      <span>Zone: {h.zone}</span>
                      <span className="font-bold text-warn">Corroborators: {h.corroboratorCount} workers</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COLLECTIVE VOICE VAULT */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-text">Collective Escrow Alerts (Unlocked Only)</h2>
              <p className="text-xs text-grey-500">
                Note: In accordance with differential privacy rules, locked reports under the K=3 threshold are completely hidden from this admin cockpit.
              </p>
              <div className="space-y-3">
                {unlockedComplaints.map((c) => (
                  <Card key={c.id} className="p-4 space-y-2 border-lime/40 bg-lime/5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lime text-base">{c.targetId}</span>
                      <Chip status={c.isUrgent ? 'URGENT' : 'MATCH'} label="UNLOCKED GROUP ALERT" />
                    </div>
                    <p className="text-sm text-text">{c.sanitizedSummary}</p>
                    <div className="text-[11px] text-grey-500 pt-1 border-t border-grey-800">
                      Anonymized & scrubbed &bull; Threshold of 3+ distinct workers verified
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONSENSUS OVERTIME */}
          {activeTab === 'overtime' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-text">Consensus Overtime Anomalies</h2>
              <Card className="p-5 border-warn/40 bg-warn/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warn" />
                    <span className="font-bold text-base text-text">Hostel Block A Sanitation Crew</span>
                  </div>
                  <Chip status="NEEDS_REVIEW" label="3 PEERS CONFIRMED" />
                </div>
                <p className="text-sm text-grey-300">
                  3 distinct workers tapped &quot;Still working&quot; within 20 minutes after the scheduled 16:00 shift end.
                  Contractor muster roll logged 8 hours. Potential unrecorded 1h overtime anomaly.
                </p>
              </Card>
            </div>
          )}

          {/* TAB 6: THEKEDAR SCORECARDS */}
          {activeTab === 'contractors' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-text">Contractor (Thekedar) Accountability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Balaji Facility Services</h3>
                    <Chip status="MATCH" label="TIER 1 RATED" />
                  </div>
                  <p className="text-xs text-grey-500">SRMIST Campus Sanitation Contract</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-grey-300">Pay Accuracy</span>
                      <span className="font-bold text-lime">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grey-300">Hazard Resolution SLA</span>
                      <span className="font-bold text-lime">88.0%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Sharma Rail Infra</h3>
                    <Chip status="NEEDS_REVIEW" label="EARLY WARNING" />
                  </div>
                  <p className="text-xs text-grey-500">Metro Line 4 Substructure Contract</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-grey-300">Pay Accuracy</span>
                      <span className="font-bold text-warn">81.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grey-300">Hazard Resolution SLA</span>
                      <span className="font-bold text-danger">64.0%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 7: BURNOUT & RISK RADAR */}
          {activeTab === 'people' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-text">Crew Burnout & Quit-Risk Radar</h2>
              <p className="text-xs text-grey-500">
                Aggregates with fewer than 3 people are automatically suppressed to protect privacy.
              </p>
              <div className="space-y-3">
                <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-base text-text block">Hostel Block A Sanitation Shift</span>
                    <p className="text-xs text-grey-500 mt-0.5">Aggregate: 4 workers</p>
                    <p className="text-sm text-warn mt-1">
                      <strong>Why:</strong> Average rest between back-to-back shifts was 8.2 hours (statutory minimum is 10 hours).
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <span className="text-xs font-bold text-lime block">Suggested Action:</span>
                    <span className="text-xs text-grey-300">Enforce 10h rest interval before morning roster.</span>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 8: COMPLIANCE INSPECTION-READY PACK */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-text">Inspection-Ready Pack</h2>
                <p className="text-sm text-grey-300">
                  One-tap statutory registers exportable as CSV and printable audit dossiers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-text">Muster Roll Register</h3>
                    <p className="text-xs text-grey-500 mt-1">Form D attendance and Two-Key verification stamps</p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => handleDownloadCsv('muster')}>
                    Download Muster CSV
                  </Button>
                </Card>

                <Card className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-text">Overtime Register</h3>
                    <p className="text-xs text-grey-500 mt-1">Form IV overtime hours and statutory 2x rate calculations</p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => handleDownloadCsv('overtime')}>
                    Download Overtime CSV
                  </Button>
                </Card>

                <Card className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-text">Wage Disbursement Register</h3>
                    <p className="text-xs text-grey-500 mt-1">Form B wages, deductions, and verified net settlements</p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => handleDownloadCsv('wage')}>
                    Download Wage CSV
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
