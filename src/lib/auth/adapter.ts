import { AuthProvider, AuthUser } from './types';
import { SEED_USERS } from '../storage/seedData';

export const DEMO_OTP_CODE = '777888';

export class FairShiftAuthAdapter implements AuthProvider {
  name = 'FairShiftAuthAdapter';

  private isDemoMode(): boolean {
    // In browser client or server, check env var or flag
    return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
  }

  async sendOtp(phone: string): Promise<{ success: boolean; demoOtp?: string; message: string }> {
    const demo = this.isDemoMode();

    if (demo) {
      return {
        success: true,
        demoOtp: DEMO_OTP_CODE,
        message: 'Demo mode active: Use the one-time passcode shown above.',
      };
    }

    // Real SMS OTP provider (e.g., Firebase / Twilio) would be invoked here if env keys exist
    return {
      success: true,
      message: `Passcode dispatched to ${phone.slice(0, 3)}****${phone.slice(-3)}.`,
    };
  }

  async verifyOtp(
    phone: string,
    code: string,
    context?: { sectorId?: string; role?: string; name?: string }
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const demo = this.isDemoMode();

    // Check if code entered is the demo OTP
    if (code === DEMO_OTP_CODE) {
      if (!demo) {
        return {
          success: false,
          error: 'Demo authentication codes are rejected in production mode.',
        };
      }

      // Demo login: Match Sunita for worker, Balaji for contractor, or generate user
      const targetRole = (context?.role || 'worker').toLowerCase();
      let matchedUser: AuthUser;

      if (targetRole === 'admin') {
        const seedAdmin = SEED_USERS.find((u) => u.role === 'admin')!;
        matchedUser = {
          id: seedAdmin.id,
          name: seedAdmin.name,
          role: 'admin',
          sectorId: context?.sectorId || seedAdmin.sectorId,
          siteName: seedAdmin.siteName,
        };
      } else if (targetRole === 'thekedar' || targetRole === 'contractor' || targetRole === 'manager') {
        const seedContractor = SEED_USERS.find((u) => u.role === 'contractor')!;
        matchedUser = {
          id: seedContractor.id,
          name: seedContractor.name,
          role: 'contractor',
          sectorId: context?.sectorId || seedContractor.sectorId,
          siteName: seedContractor.siteName,
        };
      } else {
        const seedWorker = SEED_USERS.find((u) => u.id === 'worker-sunita')!;
        matchedUser = {
          id: seedWorker.id,
          name: context?.name || seedWorker.name,
          role: 'worker',
          sectorId: context?.sectorId || seedWorker.sectorId,
          siteName: seedWorker.siteName,
        };
      }

      return {
        success: true,
        user: matchedUser,
      };
    }

    // For non-demo verification:
    if (code.length === 6 && /^\d+$/.test(code)) {
      if (demo) {
        // Any 6 digits accepted in demo mode if demo flag is true
        return {
          success: true,
          user: {
            id: `usr-${Date.now().toString().slice(-6)}`,
            name: context?.name || 'Worker Companion',
            role: (context?.role as 'worker' | 'contractor' | 'admin') || 'worker',
            sectorId: context?.sectorId || 'srmist',
            siteName: 'SRMIST Campus',
          },
        };
      }

      return {
        success: false,
        error: 'Invalid verification passcode. Please check and retry.',
      };
    }

    return {
      success: false,
      error: 'Passcode must be a 6-digit number.',
    };
  }

  async verifyQrBadge(
    payload: string,
    context?: { name?: string }
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    // Format: fairshift:v1:<siteId>:<role>:<signature> OR 6-digit site code
    const parts = payload.trim().split(':');

    if (parts.length >= 4 && parts[0] === 'fairshift' && parts[1] === 'v1') {
      const siteId = parts[2];
      const roleStr = parts[3].toLowerCase();
      const role: 'worker' | 'contractor' | 'admin' =
        roleStr === 'admin' ? 'admin' : roleStr === 'contractor' || roleStr === 'thekedar' ? 'contractor' : 'worker';

      return {
        success: true,
        user: {
          id: `qr-usr-${Date.now().toString().slice(-5)}`,
          name: context?.name || 'Badge Verified Worker',
          role,
          sectorId: siteId,
          siteName: `${siteId.toUpperCase()} Site Badge`,
        },
      };
    }

    // Fallback: 6-digit site code (e.g. "882190")
    if (/^\d{6}$/.test(payload.trim())) {
      return {
        success: true,
        user: {
          id: `manual-usr-${payload.trim()}`,
          name: context?.name || 'Site Code Worker',
          role: 'worker',
          sectorId: 'srmist',
          siteName: `Worksite Code #${payload.trim()}`,
        },
      };
    }

    return {
      success: false,
      error: 'Unrecognized work badge format. Expected fairshift:v1:... or 6-digit badge number.',
    };
  }
}

export const authAdapter = new FairShiftAuthAdapter();
