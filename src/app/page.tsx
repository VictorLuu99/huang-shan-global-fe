import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import OptimizedLoader from '@/components/shared/OptimizedLoader';

const LogisticsLandingPage = dynamic(() => import('@/components/LogisticsLandingPage'), {
  loading: () => <OptimizedLoader message="Loading home page..." />
});

export default function Home() {
  return (
    <Suspense fallback={<OptimizedLoader message="Preparing page..." />}>
      <LogisticsLandingPage />
    </Suspense>
  );
}
