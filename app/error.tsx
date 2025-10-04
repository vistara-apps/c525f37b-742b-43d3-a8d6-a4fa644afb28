'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-text-muted mb-6">{error.message}</p>
        <button onClick={reset} className="btn-primary w-full">
          Try again
        </button>
      </div>
    </div>
  );
}
