export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-text-muted">Loading HustleScope...</p>
      </div>
    </div>
  );
}
