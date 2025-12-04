export default function DashboardPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">overview</p>
        <h1 className="text-3xl font-semibold text-slate-900">내 만다라트</h1>
        <p className="mt-2 text-sm text-slate-600">
          생성한 모든 만다라트를 연도별로 정리해 확인할 수 있어요.
        </p>
      </header>
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        TODO: 만다라트 전체 목록 UI
      </div>
    </section>
  );
}
