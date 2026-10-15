import Modal, { ModalActions } from '../ui/Modal.jsx';

/**
 * Confirm resending a pending member or employee invitation email.
 */
export default function ResendInviteConfirmModal({
  open,
  kind,
  personLabel,
  email,
  loading,
  onCancel,
  onConfirm,
}) {
  const roleLabel = kind === 'member' ? 'member' : 'employee';

  return (
    <Modal
      open={open}
      title={`Resend ${roleLabel} invitation?`}
      onClose={onCancel}
      closeOnBackdrop={false}
      preventClose={loading}
    >
      <p className="text-sm text-on-surface-variant">
        A new invitation email will be sent to{' '}
        <strong className="text-on-surface">{email || personLabel}</strong>
        {personLabel && email ? (
          <>
            {' '}
            for <strong className="text-on-surface">{personLabel}</strong>
          </>
        ) : null}
        . Any previous invite link may stop working.
      </p>
      <div className="mt-6">
        <ModalActions
          confirmLabel="Send invitation"
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}
