import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _webtoonCategories = [
  { id: '1', name: 'Action', slug: 'action', color: '#ff6b6b' },
  { id: '2', name: 'Romance', slug: 'romance', color: '#ff9ff3' },
  { id: '3', name: 'Fantasy', slug: 'fantasy', color: '#54a0ff' },
  { id: '4', name: 'Comedy', slug: 'comedy', color: '#5f27cd' },
  { id: '5', name: 'Drama', slug: 'drama', color: '#00d2d3' },
  { id: '6', name: 'Horror', slug: 'horror', color: '#ff9f43' },
  { id: '7', name: 'Slice of Life', slug: 'slice-of-life', color: '#10ac84' },
  { id: '8', name: 'Thriller', slug: 'thriller', color: '#ee5a24' },
];

export const _webtoonStatus = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'hiatus', label: 'Hiatus' },
];

export const _webtoonGenres = [
  { value: 'action', label: 'Action' },
  { value: 'romance', label: 'Romance' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'horror', label: 'Horror' },
  { value: 'slice-of-life', label: 'Slice of Life' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'sports', label: 'Sports' },
  { value: 'supernatural', label: 'Supernatural' },
  { value: 'historical', label: 'Historical' },
];

// ----------------------------------------------------------------------

export const _webtoons = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.description(index),
  author: _mock.fullName(index),
  artist: _mock.fullName(index + 1),
  status: _webtoonStatus[index % 3].value,
  genre: _webtoonGenres[index % 12].value,
  rating: _mock.number.rating(index),
  views: _mock.number.nativeL(index),
  likes: _mock.number.nativeM(index),
  chapters: _mock.number.nativeS(index) + 10,
  isNew: index < 6,
  isPopular: index < 8,
  isCompleted: index % 3 === 1,
  updatedAt: _mock.time(index),
  publishedAt: _mock.time(index + 5),
  tags: _webtoonGenres.slice(0, 3).map((item) => item.label),
}));

// Featured webtoons for hero carousel - using custom images
export const _featuredWebtoons = [
  {
    ..._webtoons[0],
    coverUrl: '/assets/images/cover/webt1.jpg',
  },
  {
    ..._webtoons[1],
    coverUrl: '/assets/images/cover/webt2.jpeg',
  },
  {
    ..._webtoons[2],
    coverUrl: '/assets/images/cover/webt3.jpg',
  },
  ..._webtoons.slice(3, 6),
];

export const _popularWebtoons = _webtoons
  .filter((webtoon) => webtoon.isPopular)
  .sort((a, b) => b.views - a.views);

export const _newWebtoons = _webtoons
  .filter((webtoon) => webtoon.isNew)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const _completedWebtoons = _webtoons
  .filter((webtoon) => webtoon.isCompleted)
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

// ----------------------------------------------------------------------

export const _webtoonStats = {
  totalWebtoons: _webtoons.length,
  totalViews: _webtoons.reduce((sum, webtoon) => sum + webtoon.views, 0),
  totalLikes: _webtoons.reduce((sum, webtoon) => sum + webtoon.likes, 0),
  totalChapters: _webtoons.reduce((sum, webtoon) => sum + webtoon.chapters, 0),
  averageRating: Number(
    (_webtoons.reduce((sum, webtoon) => sum + webtoon.rating, 0) / _webtoons.length).toFixed(1)
  ),
};

export const _webtoonReviews = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  webtoonId: _webtoons[index % 6].id,
  user: {
    id: _mock.id(index),
    name: _mock.fullName(index),
    avatar: _mock.image.avatar(index),
  },
  rating: _mock.number.rating(index),
  comment: _mock.sentence(index),
  createdAt: _mock.time(index),
  isHelpful: _mock.boolean(index),
  helpfulCount: _mock.number.nativeS(index),
}));
