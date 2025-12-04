import { MandalartBoard } from '@/widgets/mandalart-board/ui/MandalartBoard';

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-6 py-6">
      <div className="w-full max-w-xl mx-auto">
        <MandalartBoard />
      </div>
    </main>
  );
}
