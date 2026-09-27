import Modal, { ModalActions } from '../ui/Modal.jsx';

export default function ShiftConfirmModal({
  open,
  shiftLabel,
  dateLabel,
  loading,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal open={open} title="Confirm shift?" onClose={onCancel} closeOnBackdrop={false}>
      <p className="text-sm text-on-surface-variant">
        Confirm <strong className="text-on-surface">{shiftLabel || 'this shift'}</strong>
        {dateLabel ? (
          <>
            {' '}
            for <strong className="text-on-surface">{dateLabel}</strong>
          </>
        ) : null}
        ?
      </p>
      <p className="mt-2 text-xs text-on-surface-variant">
        After confirming, enter shift amount or work comment (or both), add optional proof photos if
        you want, then submit for verification. Only confirm if you worked this shift.
      </p>
      <div className="mt-6">
        <ModalActions
          confirmLabel="Yes, confirm shift"
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}
