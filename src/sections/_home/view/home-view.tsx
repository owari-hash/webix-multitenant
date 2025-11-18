'use client';

import { useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import ScrollProgress from 'src/components/scroll-progress';

import HomeWebtoonHero from '../home-webtoon-hero';
import HomeWebtoonStats from '../home-webtoon-stats';
import HomeWebtoonFeatured from '../home-webtoon-featured';
import HomeWebtoonTrending from '../home-webtoon-trending';
import HomeWebtoonNewsletter from '../home-webtoon-newsletter';
import HomeWebtoonCategories from '../home-webtoon-categories';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('/api2/webtoon/comics');
        const result = await response.json();
        
        if (result.success && result.comics) {
          setComics(result.comics);
        }
      } catch (error) {
        console.error('Failed to fetch comics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  // Sort and filter comics
  const featuredComics = comics
    .filter((comic) => comic.status === 'ongoing')
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 15); // 3 slides × 5 cards = 15 comics

  const trendingComics = comics
    .filter((comic) => comic.status === 'ongoing')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const newComics = comics
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      {/* Hero Section */}
      <HomeWebtoonHero />

      {/* Featured Webtoons */}
      <HomeWebtoonFeatured data={featuredComics} />

      {/* Platform Statistics */}
      <HomeWebtoonStats comics={comics} />

      {/* Trending Webtoons */}
      <HomeWebtoonTrending
        title="Энэ долоо хоногийн тренд"
        data={trendingComics}
        type="trending"
      />

      {/* Categories */}
      <HomeWebtoonCategories />

      {/* New Releases */}
      <HomeWebtoonTrending title="Шинэ гарсан" data={newComics} type="new" />

      {/* Newsletter */}
      <HomeWebtoonNewsletter />
    </>
  );
}
