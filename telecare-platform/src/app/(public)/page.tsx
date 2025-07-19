import { BaseLayout } from "@/components/layout";
import {
  Hero,
  Features,
  HowItWorks,
  ProblemStatement,
  ImpactMetrics,
  Testimonials,
  Partners,
  CTA,
  Donation,
  FAQ,
} from "@/components/landing";

export default function Home() {
  return (
    <BaseLayout>
      <Hero />
      <ProblemStatement />
      <Features />
      <HowItWorks />
      <ImpactMetrics />
      <Testimonials />
      <Partners />
      <CTA />
      <Donation />
      <FAQ />
    </BaseLayout>
  );
}
