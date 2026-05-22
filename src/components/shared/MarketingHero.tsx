import React from 'react';

import { Link } from 'react-router-dom';

interface MarketingHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export const MarketingHero: React.FC<MarketingHeroProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink
}) => {
  return (
    <div className="relative overflow-hidden bg-surface-variant py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-display font-medium tracking-tight text-on-surface sm:text-6xl leading-tight">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant max-w-xl mx-auto">
            {subtitle}
          </p>
          {(ctaText || secondaryCtaText) && (
            <div className="mt-10 flex items-center justify-center gap-6">
              {ctaText && (
                <Link to={ctaLink || '/login'} className="terris-btn-primary px-8">
                  {ctaText}
                </Link>
              )}
              {secondaryCtaText && (
                <Link to={secondaryCtaLink || '/services'} className="terris-btn-outline px-8">
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
