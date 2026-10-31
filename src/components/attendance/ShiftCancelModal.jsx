import Modal, { ModalActions } from '../ui/Modal.jsx';

export default function ShiftCancelModal({
  open,
  shiftLabel,
  dateLabel,
  loading,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      open={open}
      title="Cancel shift confirmation?"
      onClose={onClose}
      closeOnBackdrop={false}
      preventClose={loading}
    >
      <p className="text-sm text-on-surface-variant">
        Remove your confirmation for{' '}
        <strong className="text-on-surface">{shiftLabel || 'this shift'}</strong>
        {dateLabel ? (
          <>
            {' '}
            on <strong className="text-on-surface">{dateLabel}</strong>
          </>
        ) : null}
        ? You can confirm again if you still worked this shift.
      </p>
      <p className="mt-2 text-xs text-on-surface-variant">
        Only available before your admin verifies this shift. Comments and work photos for this
        shift will be cleared.
      </p>
      <div className="mt-6">
        <ModalActions
          confirmLabel="Yes, cancel shift"
          loading={loading}
          onCancel={onClose}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}
