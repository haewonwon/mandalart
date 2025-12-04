type DashboardYearPageProps = {
  params: {
    year: string;
  };
};

export default function DashboardYearPage({ params }: DashboardYearPageProps) {
  const { year } = params;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{year}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{year} 만다라트 모음</h1>
        <p className="mt-2 text-sm text-slate-600">
          해당 연도에 작성한 만다라트 프로젝트를 모아 보여줄 예정입니다.
        </p>
      </header>
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        TODO: {year} 리스트 UI
      </div>
    </section>
  );
}
