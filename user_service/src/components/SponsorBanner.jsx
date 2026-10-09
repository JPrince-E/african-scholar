import React from 'react';
import BannerCarousel from './BannerCarousel';

export default function SponsorBanner({ placement = 'HERO_BANNER', className = '' }) {
  return <BannerCarousel placement={placement} className={className} />;
}

