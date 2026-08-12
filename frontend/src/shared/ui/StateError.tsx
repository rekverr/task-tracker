export function StateError({
  error,
  retry,
}: {
  error: string;
  retry: () => void;
}) {
  return (
    <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
      <p className="font-semibold">Couldn’t load this page</p>
      <p className="mt-1 text-sm">{error}</p>
      <button
        className="mt-3 text-sm font-bold underline"
        onClick={() => void retry()}
      >
        Try again
      </button>
    </div>
  );
}
