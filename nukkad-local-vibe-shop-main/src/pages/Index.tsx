import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { CategoriesSection } from '@/components/CategoriesSection';
import { NearbyStoresSection } from '@/components/NearbyStoresSection';
import { DealsSection } from '@/components/DealsSection';
import { RecommendationsSection } from '@/components/RecommendationsSection';
import { Footer } from '@/components/Footer';
import { ScrollAnimations } from '@/components/ScrollAnimations';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollAnimations />
      <Navigation />
      <HeroSection />
      <CategoriesSection />
      <NearbyStoresSection />
      <DealsSection />
      <RecommendationsSection />
      <Footer />
    </div>
  );
};

export default Index;
