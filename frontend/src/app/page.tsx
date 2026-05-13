import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/landing/Hero";
import FeatureGrid from "./components/landing/FeatureGrid";
import WorkflowSection from "./components/landing/WorkflowSection";
import CTASection from "./components/landing/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-(--c-ink) text-(--c-snow)">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <WorkflowSection />
      <CTASection />
      <Footer />
    </main>
  );
}
