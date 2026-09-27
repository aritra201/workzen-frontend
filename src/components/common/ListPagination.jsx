import Button from '../ui/Button.jsx';

export default function ListPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  loading,
}) {
  const showControls = totalPages > 1 || total > pageSize;
  if (!showControls) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-on-surface-variant">
        Page {page} of {Math.max(totalPages, 1)}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={page >= totalPages || loading}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
