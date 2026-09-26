export default function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="rounded-lg bg-error-container px-3 py-2 text-sm text-on-error-container"
      role="alert"
    >
      {message}
    </div>
  );
}
