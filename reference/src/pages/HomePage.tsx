import React from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { TrustStrip } from '../components/home/TrustStrip';
import { CategoryTiles } from '../components/home/CategoryTiles';
import { FeaturedCarousel } from '../components/home/FeaturedCarousel';
import { SignatureSpotlight } from '../components/home/SignatureSpotlight';
import { WorkshopTeaser } from '../components/home/WorkshopTeaser';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      <HeroSlider onNavigate={onNavigate} />
      <TrustStrip />
      <CategoryTiles onNavigate={onNavigate} />
      <FeaturedCarousel onNavigate={onNavigate} />
      <SignatureSpotlight onNavigate={onNavigate} />
      <WorkshopTeaser onNavigate={onNavigate} />
      <TestimonialsSection onNavigate={onNavigate} />
    </div>
  );
};
