/** Join selected employee ids for API query (comma-separated). */
export function employeeIdsQueryParam(selectedIds) {
  const ids = (selectedIds || []).map(String).filter(Boolean);
  return ids.length ? ids.join(',') : undefined;
}
