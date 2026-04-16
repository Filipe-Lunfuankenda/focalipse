import { Navigation } from '@/components/Navigation';
import { SEOHead } from '@/components/SEOHead';
import { HeroSection } from '@/components/HeroSection';
import { EtymologySection } from '@/components/EtymologySection';
import { ConceptSection } from '@/components/ConceptSection';
import { PsychologySection } from '@/components/PsychologySection';
import { StructureSection } from '@/components/StructureSection';
import { TaxonomySection } from '@/components/TaxonomySection';
import { AdvancedTypesSection } from '@/components/AdvancedTypesSection';
import { EffectsSection } from '@/components/EffectsSection';
import { ExamplesSection } from '@/components/ExamplesSection';
import { LongReadsSection } from '@/components/LongReadsSection';
import { Suspense, lazy } from 'react';

// ─── LAZY LOADED SECTIONS ───
// Heavy interactive components and below-the-fold sections are loaded on demand
// This reduces the main bundle size and improves initial page load
const GeneratorSection = lazy(() => import('@/components/GeneratorSection').then(m => ({ default: m.GeneratorSection })));
const VerifierSection = lazy(() => import('@/components/VerifierSection').then(m => ({ default: m.VerifierSection })));
const GroqGeneratorSection = lazy(() => import('@/components/GroqGeneratorSection').then(m => ({ default: m.GroqGeneratorSection })));
const GroqVerifierSection = lazy(() => import('@/components/GroqVerifierSection').then(m => ({ default: m.GroqVerifierSection })));
const FooterSection = lazy(() => import('@/components/FooterSection').then(m => ({ default: m.FooterSection })));

// ─── LAZY LOADING FALLBACK ───
const SectionSkeleton = () => (
  <div className="py-20 md:py-28 px-4 space-y-4">
    <div className="h-12 bg-muted rounded animate-pulse" />
    <div className="h-8 bg-muted rounded animate-pulse" />
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse" />
    </div>
  </div>
);

const Index = () => {
  return (
    <>
      <SEOHead />
      <Navigation />
      <main className="pt-14 md:pt-16">
        <HeroSection />
        <EtymologySection />
        <ConceptSection />
        <PsychologySection />
        <StructureSection />
        <TaxonomySection />
        <AdvancedTypesSection />
        <EffectsSection />
        <ExamplesSection />

        <Suspense fallback={<SectionSkeleton />}>
          <GeneratorSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <VerifierSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <GroqGeneratorSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <GroqVerifierSection />
        </Suspense>

        <LongReadsSection />

        <Suspense fallback={<SectionSkeleton />}>
          <FooterSection />
        </Suspense>
      </main>
    </>
  );
};

export default Index;
