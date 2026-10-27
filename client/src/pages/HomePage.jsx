import React from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { CraftFeaturesTiles } from '../components/home/CraftFeaturesTiles';
import { CategoryTiles } from '../components/home/CategoryTiles';
import { FeaturedCarousel } from '../components/home/FeaturedCarousel';
import { SignatureSpotlight } from '../components/home/SignatureSpotlight';
import { WorkshopTeaser } from '../components/home/WorkshopTeaser';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const HomePage = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      <HeroSlider onNavigate={onNavigate} />

      <ScrollReveal delay={60}>
        <CraftFeaturesTiles onNavigate={onNavigate} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <CategoryTiles onNavigate={onNavigate} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <FeaturedCarousel onNavigate={onNavigate} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <SignatureSpotlight onNavigate={onNavigate} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <WorkshopTeaser onNavigate={onNavigate} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <TestimonialsSection onNavigate={onNavigate} />
      </ScrollReveal>
    </div>
  );
};


