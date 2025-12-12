'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import { getAuthHeaders } from 'src/utils/auth';

// ----------------------------------------------------------------------

interface UserStats {
  xp: number;
  level: number;
  xpProgress: {
    current: number;
    total: number;
    percentage: number;
  };
  profileBorder: {
    color: string;
    name: string;
    gradient: string;
  };
  totalChaptersRead: number;
  totalNovelChaptersRead: number;
  totalComments: number;
  totalLikesGiven: number;
  totalLikesReceived: number;
  achievements: Array<{
    achievement: {
      _id: string;
      name: string;
      description: string;
      icon: string;
      badgeColor: string;
      type: string;
      requirement: number;
    };
    unlockedAt: string;
  }>;
  dailyStreak: number;
  lastActivity?: string;
}

interface ProfileBorderProps {
  userId?: string;
  size?: number;
  showLevel?: boolean;
  level?: number;
  borderColor?: string;
  borderGradient?: string;
  borderName?: string;
}

/**
 * Profile Avatar with Level Border
 */
export function ProfileBorder({
  userId,
  size = 40,
  showLevel = true,
  level,
  borderColor,
  borderGradient,
  borderName,
}: ProfileBorderProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(!!userId);

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api2/achievements/stats/${userId}`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  const displayLevel = level ?? stats?.level ?? 1;
  const displayBorder = borderGradient ?? stats?.profileBorder?.gradient ?? 'linear-gradient(135deg, #90EE90 0%, #32CD32 100%)';
  const displayBorderName = borderName ?? stats?.profileBorder?.name ?? 'Beginner';

  if (loading) {
    return (
      <Avatar
        sx={{
          width: size,
          height: size,
          border: '2px solid',
          borderColor: 'divider',
        }}
      />
    );
  }

  return (
    <Tooltip title={`Level ${displayLevel} - ${displayBorderName}`} arrow>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          showLevel ? (
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                border: '2px solid',
                borderColor: 'background.paper',
              }}
            >
              {displayLevel}
            </Box>
          ) : null
        }
      >
        <Avatar
          sx={{
            width: size,
            height: size,
            border: '3px solid',
            borderImage: displayBorder,
            borderImageSlice: 1,
            background: displayBorder,
            padding: '2px',
            '& > img': {
              borderRadius: '50%',
            },
          }}
        />
      </Badge>
    </Tooltip>
  );
}

/**
 * Level Progress Bar Component
 */
interface LevelProgressProps {
  userId?: string;
  compact?: boolean;
}

export function LevelProgress({ userId, compact = false }: LevelProgressProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint = userId
          ? `/api2/achievements/stats/${userId}`
          : '/api2/achievements/stats';
        const response = await fetch(endpoint, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading || !stats) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (compact) {
    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
        <Typography variant="caption" sx={{ minWidth: 40 }}>
          Lv.{stats.level}
        </Typography>
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={stats.xpProgress.percentage}
            sx={{
              height: 6,
              borderRadius: 1,
              bgcolor: 'background.neutral',
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>
          {stats.xpProgress.current}/{stats.xpProgress.total} XP
        </Typography>
      </Stack>
    );
  }

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Level {stats.level}</Typography>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: 'primary.lighter',
                color: 'primary.darker',
                fontWeight: 'bold',
              }}
            >
              {stats.profileBorder.name}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {stats.xp} XP
          </Typography>
        </Stack>

        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Progress to Level {stats.level + 1}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.xpProgress.current} / {stats.xpProgress.total} XP
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={stats.xpProgress.percentage}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'background.neutral',
            }}
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6">{stats.totalChaptersRead + stats.totalNovelChaptersRead}</Typography>
            <Typography variant="caption" color="text.secondary">
              Chapters Read
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6">{stats.totalComments}</Typography>
            <Typography variant="caption" color="text.secondary">
              Comments
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6">{stats.dailyStreak}</Typography>
            <Typography variant="caption" color="text.secondary">
              Day Streak
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

/**
 * Achievement Badge Component
 */
interface AchievementBadgeProps {
  achievement: {
    _id: string;
    name: string;
    description: string;
    icon: string;
    badgeColor: string;
    type: string;
    requirement: number;
  };
  unlocked?: boolean;
  unlockedAt?: string;
  size?: 'small' | 'medium' | 'large';
}

export function AchievementBadge({
  achievement,
  unlocked = false,
  unlockedAt,
  size = 'medium',
}: AchievementBadgeProps) {
  const sizeMap = {
    small: 40,
    medium: 64,
    large: 96,
  };

  const iconSize = sizeMap[size];

  const getFontSize = () => {
    if (size === 'small') return '1.5rem';
    if (size === 'medium') return '2rem';
    return '3rem';
  };

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2">{achievement.name}</Typography>
          <Typography variant="caption">{achievement.description}</Typography>
          {unlocked && unlockedAt && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Unlocked: {new Date(unlockedAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      }
      arrow
    >
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: 2,
          bgcolor: unlocked ? achievement.badgeColor : 'background.neutral',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: getFontSize(),
          opacity: unlocked ? 1 : 0.5,
          border: '2px solid',
          borderColor: unlocked ? achievement.badgeColor : 'divider',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: unlocked ? 4 : 1,
          },
        }}
      >
        {achievement.icon || '🏆'}
      </Box>
    </Tooltip>
  );
}

/**
 * Achievements Gallery Component
 */
interface AchievementsGalleryProps {
  userId?: string;
}

export function AchievementsGallery({ userId }: AchievementsGalleryProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [allAchievements, setAllAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, achievementsResponse] = await Promise.all([
          fetch(userId ? `/api2/achievements/stats/${userId}` : '/api2/achievements/stats', {
            headers: getAuthHeaders(),
          }),
          fetch('/api2/achievements/list', {
            headers: getAuthHeaders(),
          }),
        ]);

        const statsResult = await statsResponse.json();
        const achievementsResult = await achievementsResponse.json();

        if (statsResult.success) {
          setStats(statsResult.data);
        }

        if (achievementsResult.success) {
          setAllAchievements(achievementsResult.data);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography>Loading achievements...</Typography>
      </Card>
    );
  }

  const unlockedAchievementIds = new Set(
    stats?.achievements?.map((a) => a.achievement._id) || []
  );

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Achievements ({stats?.achievements?.length || 0} / {allAchievements.length})
      </Typography>

      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
        {allAchievements.map((achievement) => {
          const unlocked = unlockedAchievementIds.has(achievement._id);
          const unlockedData = stats?.achievements?.find(
            (a) => a.achievement._id === achievement._id
          );

          return (
            <AchievementBadge
              key={achievement._id}
              achievement={achievement}
              unlocked={unlocked}
              unlockedAt={unlockedData?.unlockedAt}
              size="medium"
            />
          );
        })}
      </Stack>
    </Card>
  );
}

