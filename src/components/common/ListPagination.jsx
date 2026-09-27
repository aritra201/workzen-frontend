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
    <div className="flex flex-col items-stretch gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-center text-on-surface-variant sm:text-left">
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
