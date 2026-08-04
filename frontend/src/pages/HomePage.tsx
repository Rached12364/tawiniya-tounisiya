import HeroSlider from '../components/home/HeroSlider';
import AboutSection from '../components/home/AboutSection';
import SponsorsSection from '../components/home/SponsorsSection';
import StatsSection from '../components/home/StatsSection';
import ServicesSection from '../components/home/ServicesSection';
import FeaturedTechniciensSection from '../components/home/FeaturedTechniciensSection';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <SponsorsSection />
      <StatsSection />
      <ServicesSection />
      <FeaturedTechniciensSection />
    </>
  );
}
