import { useEffect, useState } from 'react';
import { listCompanyAttendance } from '../api/companyAttendance.js';
import { listUnlockRequestsAdmin } from '../api/unlockRequests.js';

export function useAdminBadges() {
  const [badges, setBadges] = useState({ verification: 0, unlock: 0 });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [attendance, unlocks] = await Promise.all([
          listCompanyAttendance({ status: 'pending_verification', limit: 1, page: 1 }),
          listUnlockRequestsAdmin({ status: 'pending', limit: 1, page: 1 }),
        ]);
        if (cancelled) return;
        setBadges({
          verification: attendance?.total ?? 0,
          unlock: unlocks?.total ?? unlocks?.requests?.length ?? 0,
        });
      } catch {
        /* ignore badge errors */
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return badges;
}
