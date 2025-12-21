'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { backendRequest } from 'src/utils/backend-api';

// ----------------------------------------------------------------------

interface SearchResult {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  genre?: string[];
  status?: string;
  views?: number;
  likes?: number;
  type: 'comic' | 'novel' | 'chapter' | 'novel-chapter';
  relevanceScore?: number;
  comicTitle?: string;
  comicCover?: string;
  novelTitle?: string;
  novelCover?: string;
  comicId?: string;
  novelId?: string;
  chapterNumber?: number;
  createdAt?: string;
}

const SEARCH_TYPES = [
  { value: 'all', label: 'Бүгд', icon: 'solar:widget-5-bold' },
  { value: 'comic', label: 'Комик', icon: 'solar:book-2-bold' },
  { value: 'novel', label: 'Роман', icon: 'solar:document-text-bold' },
  { value: 'chapter', label: 'Бүлэг', icon: 'solar:bookmark-bold' },
];

export default function SearchPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState({
    comics: 0,
    novels: 0,
    chapters: 0,
    novelChapters: 0,
  });

  const performSearch = useCallback(
    async (searchQuery: string, type: string = 'all') => {
      if (!searchQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        setTotal(0);
        return;
      }

      console.log('🚀 Performing search:', { searchQuery, type });
      setLoading(true);
      setHasSearched(true);

      try {
        const response = await backendRequest<{
          results?: SearchResult[];
          total?: number;
          breakdown?: {
            comics: number;
            novels: number;
            chapters: number;
            novelChapters: number;
          };
        }>(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${type}&limit=50`);

        console.log('✅ Search response:', response);

        if (response.success && response.results) {
          setResults(response.results || []);
          setTotal(response.total || 0);
          setBreakdown(response.breakdown || {
            comics: 0,
            novels: 0,
            chapters: 0,
            novelChapters: 0,
          });
        } else {
          console.warn('⚠️ Search failed:', response);
          setResults([]);
          setTotal(0);
          setBreakdown({
            comics: 0,
            novels: 0,
            chapters: 0,
            novelChapters: 0,
          });
        }
      } catch (error) {
        console.error('❌ Search error:', error);
        setResults([]);
        setTotal(0);
        setBreakdown({
          comics: 0,
          novels: 0,
          chapters: 0,
          novelChapters: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Perform search when query changes from URL (only on initial load or URL change)
  useEffect(() => {
    const urlQuery = searchParams?.get('q') || '';
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      if (urlQuery.trim().length >= 2) {
        performSearch(urlQuery, searchType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Real-time search with debouncing - search as user types
  useEffect(() => {
    // Don't search on initial mount if query is empty
    if (!query.trim()) {
      // Clear results if query becomes empty
      if (hasSearched) {
        setResults([]);
        setHasSearched(false);
        setTotal(0);
        setBreakdown({
          comics: 0,
          novels: 0,
          chapters: 0,
          novelChapters: 0,
        });
        // Clear URL query param
        window.history.pushState({}, '', window.location.pathname);
      }
      return;
    }

    // Only search if query is at least 2 characters
    if (query.trim().length < 2) {
      return;
    }

    console.log('🔍 Real-time search triggered:', query);
    const timeoutId = setTimeout(() => {
      console.log('⏰ Debounce timeout completed, calling performSearch');
      performSearch(query, searchType);
      // Update URL without navigation
      const newUrl = `${window.location.pathname}?q=${encodeURIComponent(query.trim())}`;
      window.history.pushState({}, '', newUrl);
    }, 500); // 500ms debounce delay

    return () => {
      console.log('🧹 Cleaning up timeout');
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchType]);

  const handleSearch = () => {
    if (query.trim()) {
      // Update URL without navigation
      const newUrl = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
      window.history.pushState({}, '', newUrl);
      performSearch(query, searchType);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTypeChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchType(newValue);
    if (query.trim()) {
      performSearch(query, newValue);
    }
  };

  const getResultLink = (result: SearchResult) => {
    if (result.type === 'comic') {
      return paths.webtoon.comic(result._id);
    }
    if (result.type === 'novel') {
      return paths.webtoon.novel(result._id);
    }
    if (result.type === 'chapter' && result.comicId) {
      return paths.webtoon.chapter(result.comicId, result._id);
    }
    if (result.type === 'novel-chapter' && result.novelId) {
      return paths.webtoon.novelChapter(result.novelId, result._id);
    }
    return '#';
  };

  const getResultTitle = (result: SearchResult) => {
    if (result.type === 'chapter') {
      return `${result.comicTitle || 'Комик'} - ${result.title}`;
    }
    if (result.type === 'novel-chapter') {
      return `${result.novelTitle || 'Роман'} - ${result.title}`;
    }
    return result.title;
  };

  const getResultCover = (result: SearchResult) => {
    if (result.type === 'chapter' && result.comicCover) {
      return result.comicCover;
    }
    if (result.type === 'novel-chapter' && result.novelCover) {
      return result.novelCover;
    }
    return result.coverImage;
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      comic: 'Комик',
      novel: 'Роман',
      chapter: 'Бүлэг',
      'novel-chapter': 'Романы бүлэг',
    };
    return typeMap[type] || type;
  };

  const getStatusLabel = (status?: string) => {
    const statusMap: Record<string, string> = {
      ongoing: 'Үргэлжлэх',
      completed: 'Дууссан',
      hiatus: 'Түр зогссон',
    };
    return statusMap[status || ''] || status;
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 3,
            textAlign: 'center',
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          Хайлт
        </Typography>

        {/* Search Input */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: theme.customShadows.z8,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // Clear results immediately if query is cleared
                if (!e.target.value.trim()) {
                  setResults([]);
                  setHasSearched(false);
                  setTotal(0);
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Комик, роман, бүлэг хайх..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="carbon:search" width={24} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {loading ? (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    ) : (
                      query && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setQuery('');
                            setResults([]);
                            setHasSearched(false);
                            setTotal(0);
                          }}
                        >
                          <Iconify icon="carbon:close" width={20} />
                        </IconButton>
                      )
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              startIcon={<Iconify icon="carbon:search" />}
              sx={{
                minWidth: { xs: '100%', sm: 140 },
                borderRadius: 2,
                height: 56,
              }}
            >
              Хайх
            </Button>
          </Stack>
        </Card>

        {/* Search Type Tabs */}
        {query && (
          <Box sx={{ mt: 3 }}>
            <Tabs
              value={searchType}
              onChange={handleTypeChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 48,
                  borderRadius: 2,
                  mx: 0.5,
                },
              }}
            >
              {SEARCH_TYPES.map((type) => (
                <Tab
                  key={type.value}
                  value={type.value}
                  label={type.label}
                  icon={<Iconify icon={type.icon} width={20} />}
                  iconPosition="start"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Tabs>
          </Box>
        )}
      </Box>

      {/* Results */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      )}

      {!loading && hasSearched && (
        <>
          {results.length > 0 ? (
            <>
              {/* Results Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>{total}</strong> үр дүн олдлоо
                  {breakdown.comics > 0 && ` • ${breakdown.comics} комик`}
                  {breakdown.novels > 0 && ` • ${breakdown.novels} роман`}
                  {breakdown.chapters > 0 && ` • ${breakdown.chapters} бүлэг`}
                </Typography>
              </Box>

              {/* Results Grid */}
              <Grid container spacing={3}>
                {results.map((result) => (
                  <Grid item xs={12} sm={6} md={4} key={`${result.type}-${result._id}`}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.customShadows.z24,
                        },
                      }}
                      onClick={() => router.push(getResultLink(result))}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={getResultCover(result) || '/assets/images/placeholder.jpg'}
                          alt={getResultTitle(result)}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                          }}
                        />
                        <Chip
                          label={getTypeLabel(result.type)}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: alpha(theme.palette.background.paper, 0.9),
                            backdropFilter: 'blur(8px)',
                          }}
                        />
                      </Box>

                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {getResultTitle(result)}
                        </Typography>

                        {result.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 1.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {result.description}
                          </Typography>
                        )}

                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                          {result.status && (
                            <Chip
                              label={getStatusLabel(result.status)}
                              size="small"
                              variant="outlined"
                              color={
                                result.status === 'completed'
                                  ? 'success'
                                  : result.status === 'ongoing'
                                  ? 'primary'
                                  : 'default'
                              }
                            />
                          )}
                          {result.views !== undefined && (
                            <Chip
                              icon={<Iconify icon="solar:eye-bold" width={14} />}
                              label={result.views.toLocaleString()}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {result.likes !== undefined && result.likes > 0 && (
                            <Chip
                              icon={<Iconify icon="solar:heart-bold" width={14} />}
                              label={result.likes.toLocaleString()}
                              size="small"
                              variant="outlined"
                              color="error"
                            />
                          )}
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
              }}
            >
              <Iconify
                icon="solar:magnifer-bug-bold"
                width={80}
                sx={{ color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Үр дүн олдсонгүй
              </Typography>
              <Typography variant="body2" color="text.secondary">
                "{query}" хайлтад тохирох зүйл олдсонгүй. Өөр үг ашиглаж үзнэ үү.
              </Typography>
            </Box>
          )}
        </>
      )}

      {!loading && !hasSearched && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Iconify
            icon="solar:magnifer-bug-bold"
            width={80}
            sx={{ color: 'text.disabled', mb: 2 }}
          />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Хайлт эхлүүлэх
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Дээрх хайлтын талбарт үг оруулаад хайна уу
          </Typography>
        </Box>
      )}
    </Container>
  );
}

