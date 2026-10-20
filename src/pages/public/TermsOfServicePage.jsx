export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4 text-on-surface">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-sm text-on-surface-variant">Last updated: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Acceptance</h2>
        <p className="text-sm">
          By using WorkZen ("the Service"), you agree to these Terms of Service. If you do not agree, do not use the Service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Description</h2>
        <p className="text-sm">
          WorkZen is an attendance, payroll, and workforce management platform for companies and their employees and members.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Account Responsibilities</h2>
        <ul className="list-disc space-y-1 pl-6 text-sm">
          <li>You are responsible for maintaining the security of your account credentials.</li>
          <li>You must provide accurate information when registering or accepting an invitation.</li>
          <li>You must not use the Service for unlawful purposes.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Company Admin Obligations</h2>
        <p className="text-sm">
          Company administrators are responsible for the accuracy of attendance records, payroll data, and the
          proper management of employee and member accounts within their organisation.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
        <p className="text-sm">
          WorkZen and its content are owned by the WorkZen team. You may not copy, modify, or distribute
          the platform without permission.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
        <p className="text-sm">
          The Service is provided "as is." We are not liable for any indirect, incidental, or consequential
          damages arising from your use of WorkZen.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">7. Termination</h2>
        <p className="text-sm">
          We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">8. Changes</h2>
        <p className="text-sm">
          We may update these Terms. Continued use after changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">9. Contact</h2>
        <p className="text-sm">
          Questions?{' '}
          <a href="mailto:workzenapps@gmail.com" className="text-primary underline">
            workzenapps@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
