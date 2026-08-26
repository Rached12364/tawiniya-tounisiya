import HeroSlider from '../components/home/HeroSlider';
import AboutSection from '../components/home/AboutSection';
import SponsorsSection from '../components/home/SponsorsSection';
import StatsSection from '../components/home/StatsSection';
import ServicesSection from '../components/home/ServicesSection';
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <SponsorsSection />
      <StatsSection />
      <ServicesSection />
    </>
  );
}