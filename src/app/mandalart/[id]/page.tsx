type MandalartDetailPageProps = {
  params: {
    id: string;
  };
};

export default function MandalartDetailPage({ params }: MandalartDetailPageProps) {
  const { id } = params;

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">mandalart</p>
        <h1 className="text-3xl font-semibold text-slate-900">만다라트 #{id}</h1>
        <p className="text-sm text-slate-600">
          해당 만다라트의 상세 내용을 불러와 수정하거나 기록할 수 있는 페이지입니다.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-[1fr,300px]">
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          TODO: 만다라트 상세/수정 UI
        </div>
        <aside className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          TODO: 메모, 태그, 이력 등 사이드 정보
        </aside>
      </div>
    </section>
  );
}
