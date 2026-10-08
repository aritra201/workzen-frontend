import Modal, { ModalActions } from '../ui/Modal.jsx';

export default function ExtraShiftDeclareConfirmModal({
  open,
  employeeName,
  date,
  shiftLabels,
  loading,
  onCancel,
  onConfirm,
}) {
  const shiftsText = shiftLabels?.length ? shiftLabels.join(' and ') : 'selected shifts';

  return (
    <Modal
      open={open}
      title="Confirm extra shift declaration"
      onClose={onCancel}
      closeOnBackdrop={false}
      preventClose={loading}
    >
      <p className="text-sm text-on-surface-variant">
        Declare <strong className="text-on-surface">{shiftsText}</strong> for{' '}
        <strong className="text-on-surface">{employeeName || 'this employee'}</strong> on{' '}
        <strong className="text-on-surface">{date}</strong>?
      </p>
      <p className="mt-2 text-xs text-on-surface-variant">
        The employee will be able to mark attendance for these extra shifts after you confirm.
      </p>
      <div className="mt-6">
        <ModalActions
          confirmLabel="Yes, declare"
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}
