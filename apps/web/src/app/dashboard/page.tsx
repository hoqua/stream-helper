'use client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    async function setupUser() {
      try {
        const res = await fetch('/api/auth/callback');
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data = (await res.json()) as { redirect: string };

        router.push(data.redirect);
      } catch (error) {
        console.log(error);
        router.push(`/error?message=Unauthorized`);
      }
    }
    setupUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
