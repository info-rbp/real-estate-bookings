import React from 'react';

interface MarketingHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

export const MarketingHero: React.FC<MarketingHeroProps> = ({ title, subtitle, ctaText, ctaLink }) => {
  return (
    <div className="relative overflow-hidden bg-surface-variant py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-display font-medium tracking-tight text-on-surface sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            {subtitle}
          </p>
          {ctaText && (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href={ctaLink || '#'} className="terris-btn-primary">
                {ctaText}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
