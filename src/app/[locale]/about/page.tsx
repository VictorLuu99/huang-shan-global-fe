import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import OptimizedLoader from '@/components/shared/OptimizedLoader';

const AboutPage = dynamic(() => import('@/components/AboutPage'), {
  loading: () => <OptimizedLoader message="Loading about page..." />
});

export default function About() {
  return (
    <Suspense fallback={<OptimizedLoader message="Preparing about page..." />}>
      <AboutPage />
    </Suspense>
  );
}