export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4 text-on-surface">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-on-surface-variant">Last updated: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>WorkZen collects the following information to provide attendance, payroll, and workforce management services:</p>
        <ul className="list-disc space-y-1 pl-6 text-sm">
          <li>Account information: name, email address, password (hashed).</li>
          <li>Attendance data: shift confirmations, geolocation (when marking attendance), work photos uploaded by employees.</li>
          <li>Payroll data: daily wage amounts, payroll reports.</li>
          <li>Usage data: login timestamps, activity logs for verification actions.</li>
          <li>If you sign in with Google: your Google account email, name, and profile picture provided by Google OAuth.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <ul className="list-disc space-y-1 pl-6 text-sm">
          <li>To authenticate you and manage your account.</li>
          <li>To record and display attendance, shifts, and payroll for your company.</li>
          <li>To send transactional emails (verification codes, invitations, unlock request notifications).</li>
          <li>To improve the service and diagnose technical issues.</li>
        </ul>
        <p className="text-sm">We do not sell your personal data to third parties.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Data Storage</h2>
        <p className="text-sm">
          Your data is stored on secure cloud infrastructure (MongoDB Atlas). Work photos are stored on Cloudinary.
          We retain your data for as long as your account is active.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Google Sign-In</h2>
        <p className="text-sm">
          When you use "Continue with Google," we receive your Google email and name via Google OAuth 2.0.
          We do not receive your Google password. You can revoke access at any time from your{' '}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Google account permissions
          </a>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Location Data</h2>
        <p className="text-sm">
          The mobile app may request your device location when you mark attendance. Location is only captured
          at the moment of check-in and is not tracked continuously. You may deny location permission; some
          attendance features may be limited.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">6. Cookies &amp; Local Storage</h2>
        <p className="text-sm">
          The web app uses browser local storage to keep you signed in (JWT tokens). No third-party
          advertising cookies are used.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">7. Your Rights</h2>
        <p className="text-sm">
          You may request deletion of your account and associated data by contacting us at{' '}
          <a href="mailto:workzenapps@gmail.com" className="text-primary underline">
            workzenapps@gmail.com
          </a>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
        <p className="text-sm">
          We may update this policy. Continued use of WorkZen after changes means you accept the updated policy.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">9. Contact</h2>
        <p className="text-sm">
          Questions? Email us at{' '}
          <a href="mailto:workzenapps@gmail.com" className="text-primary underline">
            workzenapps@gmail.com
          </a>.
        </p>
      </section>
    </div>
  );
}
