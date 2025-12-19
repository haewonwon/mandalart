import { createServerClient } from '@/shared/lib';
import { LandingHero } from '@/widgets/landing-hero/ui/LandingHero';
import { redirect } from 'next/navigation';

export const HomePage = async () => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex w-full flex-1 flex-col">
      <LandingHero />
    </main>
  );
};
