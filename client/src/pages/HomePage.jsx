import React from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategoryTiles } from '../components/home/CategoryTiles';
import { FeaturedCarousel } from '../components/home/FeaturedCarousel';
import { SignatureSpotlight } from '../components/home/SignatureSpotlight';
import { WorkshopTeaser } from '../components/home/WorkshopTeaser';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

export const HomePage = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      <HeroSlider onNavigate={onNavigate} />
      <CategoryTiles onNavigate={onNavigate} />
      <FeaturedCarousel onNavigate={onNavigate} />
      <SignatureSpotlight onNavigate={onNavigate} />
      <WorkshopTeaser onNavigate={onNavigate} />
      <TestimonialsSection onNavigate={onNavigate} />
    </div>
  );
};

