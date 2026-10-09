import Button from '../ui/Button.jsx';
import { isMobileUserAgent, mobileInviteDeepLink } from '../../utils/mobileAppInvite.js';

export default function OpenInMobileAppBanner({ kind, token }) {
  if (!token || !isMobileUserAgent()) {
    return null;
  }

  const appUrl = mobileInviteDeepLink(kind, token);

  return (
    <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-medium text-on-surface">Using the WorkZen mobile app?</p>
      <p className="mt-1 text-xs text-on-surface-variant">
        Invitation links from email open the website by default. Open the app to accept here.
      </p>
      <Button
        type="button"
        className="mt-3 w-full"
        onClick={() => {
          window.location.href = appUrl;
        }}
      >
        Open in WorkZen app
      </Button>
    </div>
  );
}
