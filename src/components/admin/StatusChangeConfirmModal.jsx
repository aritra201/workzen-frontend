import Modal, { ModalActions } from '../ui/Modal.jsx';

/**
 * Confirm activate / deactivate for members and employees.
 */
export default function StatusChangeConfirmModal({
  open,
  kind,
  personLabel,
  nextActive,
  loading,
  onCancel,
  onConfirm,
}) {
  const action = nextActive ? 'activate' : 'deactivate';
  const title = nextActive ? `Activate ${kind}?` : `Deactivate ${kind}?`;

  return (
    <Modal open={open} title={title} onClose={onCancel} closeOnBackdrop={false} preventClose={loading}>
      <p className="text-sm text-on-surface-variant">
        {nextActive ? (
          <>
            This will restore access for <strong className="text-on-surface">{personLabel}</strong>.
            They will be able to sign in again.
          </>
        ) : (
          <>
            This will revoke access for <strong className="text-on-surface">{personLabel}</strong>.
            Active sessions will be ended. You can activate them again later.
          </>
        )}
      </p>
      <div className="mt-6">
        <ModalActions
          confirmLabel={nextActive ? 'Yes, activate' : 'Yes, deactivate'}
          confirmVariant={nextActive ? 'primary' : 'danger'}
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}
