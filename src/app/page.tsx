'use client';

import Hero from '@/components/Hero';
import CalculateSection from '@/components/CalculateSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <section id='calculate'>
      <CalculateSection />
      </section>
    </main>
  );
}