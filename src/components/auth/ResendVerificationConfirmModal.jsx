import Modal, { ModalActions } from '../ui/Modal.jsx';

export default function ResendVerificationConfirmModal({
  open,
  email,
  loading,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      open={open}
      title="Resend verification code?"
      onClose={onCancel}
      closeOnBackdrop={false}
      preventClose={loading}
    >
      <p className="text-sm text-on-surface-variant">
        We will send a new 4-digit code to{' '}
        <strong className="text-on-surface">{email || 'your email'}</strong> if the account is
        registered and not yet verified.
      </p>
      <div className="mt-6">
        <ModalActions
          confirmLabel="Send code"
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}
