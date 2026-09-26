import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { getGoogleClientId } from '../../utils/googleClientId.js';

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'continue_with',
  disabled = false,
  label = 'Continue with Google',
}) {
  const clientId = getGoogleClientId();
  const wrapRef = useRef(null);
  const [btnWidth, setBtnWidth] = useState(320);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      return undefined;
    }
    const update = () => {
      const w = el.getBoundingClientRect().width;
      // Google Identity Services only accepts 200–400px button width.
      setBtnWidth(Math.min(400, Math.max(200, Math.floor(w))));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleSuccess = useCallback(
    (response) => {
      if (!response?.credential) {
        onError?.(new Error('Google did not return a sign-in token'));
        return;
      }
      onSuccess?.(response);
    },
    [onSuccess, onError]
  );

  const handleError = useCallback(() => {
    onError?.(
      new Error(
        'Google sign-in was cancelled or blocked. Check that http://localhost:3000 is an authorized JavaScript origin for your OAuth client.'
      )
    );
  }, [onError]);

  if (!clientId) {
    return (
      <div
        className="rounded-lg border border-dashed border-tertiary/50 bg-surface-container-low px-4 py-3 text-left text-sm text-on-surface-variant"
        role="status"
      >
        <p className="font-semibold text-on-surface">Google Sign-In not configured</p>
        <p className="mt-1 text-xs leading-relaxed">
          Copy <span className="font-mono">.env.example</span> to{' '}
          <span className="font-mono">.env</span>, set{' '}
          <span className="font-mono">VITE_GOOGLE_CLIENT_ID</span> (no quotes), then restart{' '}
          <span className="font-mono">npm run dev</span>.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${disabled ? 'pointer-events-none opacity-60' : ''}`}
    >
      <div
        className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-surface-container-low text-sm font-semibold text-on-surface shadow-sm transition-colors hover:bg-surface-container"
        aria-hidden
      >
        <GoogleMark />
        <span>{label}</span>
      </div>

      {/* GIS renders an iframe; overlay it on our Stitch-styled row. */}
      <div className="absolute inset-0 z-10 flex items-stretch justify-center overflow-hidden opacity-0 [&_div]:!h-full [&_iframe]:!min-h-12 [&_iframe]:!w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text={text}
          shape="rectangular"
          theme="outline"
          size="large"
          width={btnWidth}
        />
      </div>
    </div>
  );
}
