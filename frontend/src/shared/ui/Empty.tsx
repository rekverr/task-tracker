export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed bg-white p-10 text-center">
      <p className="font-bold">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}
