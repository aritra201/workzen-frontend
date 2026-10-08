import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleLogin, useGoogleOAuth } from '@react-oauth/google';
import { getGoogleClientId } from '../../utils/googleClientId.js';

function NotConfiguredMessage() {
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

function GoogleSignInButtonInner({
  onSuccess,
  onError,
  text = 'continue_with',
  disabled = false,
  label = 'Continue with Google',
}) {
  const wrapRef = useRef(null);
  const [btnWidth, setBtnWidth] = useState(320);
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      return undefined;
    }
    const update = () => {
      const w = el.getBoundingClientRect().width;
      setBtnWidth(Math.min(400, Math.max(200, Math.floor(w))));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('orientationchange', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', update);
    };
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
        'Google sign-in was cancelled or blocked. Check that this site URL is an authorized JavaScript origin for your OAuth client.'
      )
    );
  }, [onError]);

  if (!scriptLoadedSuccessfully) {
    return (
      <div
        className="flex h-12 w-full items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-low text-sm text-on-surface-variant"
        aria-busy="true"
      >
        Loading Google Sign-In…
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`google-signin-host w-full ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      aria-label={label}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text}
        shape="rectangular"
        theme="outline"
        size="large"
        width={btnWidth}
        containerProps={{
          className: 'google-signin-container flex w-full min-h-12 items-center justify-center',
          style: { minHeight: 48 },
        }}
      />
    </div>
  );
}

export default function GoogleSignInButton(props) {
  const clientId = getGoogleClientId();
  if (!clientId) {
    return <NotConfiguredMessage />;
  }
  return <GoogleSignInButtonInner {...props} />;
}
