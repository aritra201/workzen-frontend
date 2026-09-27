import Modal, { ModalActions } from '../ui/Modal.jsx';

export default function VerifyShiftConfirmModal({
  open,
  employeeName,
  shiftLabel,
  dateLabel,
  amountLabel,
  loading,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal open={open} title="Verify shift?" onClose={onCancel} closeOnBackdrop={false}>
      <p className="text-sm text-on-surface-variant">
        Mark <strong className="text-on-surface">{shiftLabel || 'this shift'}</strong> as verified
        for <strong className="text-on-surface">{employeeName || 'this employee'}</strong>
        {dateLabel ? (
          <>
            {' '}
            on <strong className="text-on-surface">{dateLabel}</strong>
          </>
        ) : null}
        ?
      </p>
      {amountLabel ? (
        <p className="mt-2 text-sm text-on-surface">
          Amount: <strong>{amountLabel}</strong>
        </p>
      ) : null}
      <p className="mt-2 text-xs text-on-surface-variant">
        This approves the submitted attendance for this shift. You can still use the thread below to
        leave notes for the employee.
      </p>
      <div className="mt-6">
        <ModalActions
          confirmLabel="Yes, verify shift"
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}
