import Modal, { ModalActions } from '../ui/Modal.jsx';

/**
 * Confirm cancelling a pending member or employee invitation (before accept).
 */
export default function CancelInviteConfirmModal({
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
      title={`Cancel ${roleLabel} invitation?`}
      onClose={onCancel}
      closeOnBackdrop={false}
      preventClose={loading}
    >
      <p className="text-sm text-on-surface-variant">
        This removes the pending invitation for{' '}
        <strong className="text-on-surface">{email || personLabel}</strong>
        {personLabel && email ? (
          <>
            {' '}
            (<strong className="text-on-surface">{personLabel}</strong>)
          </>
        ) : null}
        . The invite link will stop working and they will disappear from your list until you invite
        them again. Only works before they accept.
      </p>
      <div className="mt-6">
        <ModalActions
          confirmLabel="Cancel invitation"
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}
