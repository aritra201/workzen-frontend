export function formatCurrencyInr(amount) {
  if (amount == null || Number.isNaN(Number(amount))) {
    return '—';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatDateLabel(dateKey, options = {}) {
  if (!dateKey) {
    return '—';
  }
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString('en-IN', {
    weekday: options.weekday ? 'long' : undefined,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
