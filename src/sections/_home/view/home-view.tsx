'use client';

import { useScroll } from 'framer-motion';

import ScrollProgress from 'src/components/scroll-progress';
import { _newWebtoons, _popularWebtoons, _featuredWebtoons } from 'src/_mock';

import HomeWebtoonHero from '../home-webtoon-hero';
import HomeWebtoonStats from '../home-webtoon-stats';
import HomeWebtoonFeatured from '../home-webtoon-featured';
import HomeWebtoonTrending from '../home-webtoon-trending';
import HomeWebtoonNewsletter from '../home-webtoon-newsletter';
import HomeWebtoonCategories from '../home-webtoon-categories';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      {/* Hero Section */}
      <HomeWebtoonHero />

      {/* Featured Webtoons */}
      <HomeWebtoonFeatured data={_featuredWebtoons} />

      {/* Platform Statistics */}
      <HomeWebtoonStats />

      {/* Trending Webtoons */}
      <HomeWebtoonTrending title="Trending This Week" data={_popularWebtoons} type="trending" />

      {/* Categories */}
      <HomeWebtoonCategories />

      {/* New Releases */}
      <HomeWebtoonTrending title="New Releases" data={_newWebtoons} type="new" />

      {/* Newsletter */}
      <HomeWebtoonNewsletter />
    </>
  );
}
