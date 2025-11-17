'use client';

import React, { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import ToggleButton from '@mui/material/ToggleButton';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = {
  admin: { label: 'Админ', color: 'error' as const },
  user: { label: 'Хэрэглэгч', color: 'default' as const },
  viewer: { label: 'Үзэгч', color: 'info' as const },
};

export default function UsersListView() {
  const theme = useTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'lastLogin'>('recent');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api2/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        let usersData: any[] = [];
        if (result.success && Array.isArray(result.data)) {
          usersData = result.data;
        } else if (result.success && Array.isArray(result.users)) {
          usersData = result.users;
        } else if (Array.isArray(result)) {
          usersData = result;
        }

        // Add computed fields and normalize different schema versions
        usersData = usersData.map((user) => ({
          ...user,
          // Combine firstName and lastName, or use name field
          displayName:
            user.name ||
            `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
            user.username ||
            user.email,
          // Map status to isActive (handle both schemas)
          isActive: user.isActive !== undefined ? user.isActive : user.status === 'active',
          // Ensure premium field exists
          isPremium: user.premium !== undefined ? user.premium : user.isPremium || false,
        }));

        setUsers(usersData);
      } catch (error) {
        console.error('Fetch users error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(query) ||
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((user) => user.isActive === true);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((user) => user.isActive === false);
    } else if (statusFilter === 'premium') {
      filtered = filtered.filter((user) => user.isPremium === true);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return (a.displayName || '').localeCompare(b.displayName || '');
      }
      if (sortBy === 'lastLogin') {
        const aDate = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const bDate = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return bDate - aDate;
      }
      return 0;
    });

    return filtered;
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const premiumUsers = users.filter((u) => u.isPremium).length;
    const adminCount = users.filter((u) => u.role === 'admin').length;
    const recentUsers = users.filter(
      (u) => new Date(u.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    return {
      total: totalUsers,
      active: activeUsers,
      premium: premiumUsers,
      admins: adminCount,
      recent: recentUsers,
    };
  }, [users]);

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          py: { xs: 3, md: 5 },
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        }}
      >
        <Container>
          <Stack spacing={3}>
            <Breadcrumbs
              separator={<Iconify icon="carbon:chevron-right" width={16} />}
              sx={{ color: 'text.secondary' }}
            >
              <Button
                component={RouterLink}
                href={paths.webtoon.cms.dashboard}
                color="inherit"
                startIcon={<Iconify icon="carbon:dashboard" />}
                sx={{ minWidth: 'auto' }}
              >
                Хяналтын самбар
              </Button>
              <Typography color="text.primary">Хэрэглэгчид</Typography>
            </Breadcrumbs>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="carbon:user-multiple"
                    sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                  />
                </Box>

                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Хэрэглэгчид
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {filteredUsers.length} / {users.length} хэрэглэгч
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="carbon:renew" />}
                  onClick={handleRefresh}
                >
                  Шинэчлэх
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  href={paths.webtoon.cms.createUser}
                  startIcon={<Iconify icon="carbon:user-add" />}
                >
                  Шинэ хэрэглэгч
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Statistics & Content */}
      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={4}>
          {/* Statistics Cards */}
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify
                  icon="carbon:user-multiple"
                  sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Нийт
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify
                  icon="carbon:checkmark-outline"
                  sx={{ fontSize: 32, color: 'success.main', mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.active}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Идэвхтэй
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify
                  icon="carbon:star-filled"
                  sx={{ fontSize: 32, color: 'warning.main', mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.premium}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Premium
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify
                  icon="carbon:user-admin"
                  sx={{ fontSize: 32, color: 'error.main', mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.admins}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Админ
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify icon="carbon:time" sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.recent}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  7 хоног
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Search & Filters */}
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Нэр, username эсвэл имэйл хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="carbon:search" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <Iconify icon="carbon:close" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Sort */}
                <ToggleButtonGroup
                  value={sortBy}
                  exclusive
                  onChange={(_, value) => value && setSortBy(value)}
                  size="small"
                  sx={{ flexShrink: 0 }}
                >
                  <ToggleButton value="recent">
                    <Iconify icon="carbon:time" sx={{ mr: 0.5 }} />
                    Сүүлийн
                  </ToggleButton>
                  <ToggleButton value="name">
                    <Iconify icon="carbon:text-align-left" sx={{ mr: 0.5 }} />
                    Нэр
                  </ToggleButton>
                  <ToggleButton value="lastLogin">
                    <Iconify icon="carbon:login" sx={{ mr: 0.5 }} />
                    Нэвтэрсэн
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              {/* Filters */}
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Typography variant="caption" sx={{ alignSelf: 'center', mr: 1 }}>
                  Эрх:
                </Typography>
                <Chip
                  label="Бүгд"
                  color={roleFilter === 'all' ? 'primary' : 'default'}
                  onClick={() => setRoleFilter('all')}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Админ"
                  color={roleFilter === 'admin' ? 'error' : 'default'}
                  onClick={() => setRoleFilter('admin')}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Хэрэглэгч"
                  color={roleFilter === 'user' ? 'default' : 'default'}
                  onClick={() => setRoleFilter('user')}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Үзэгч"
                  color={roleFilter === 'viewer' ? 'info' : 'default'}
                  onClick={() => setRoleFilter('viewer')}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />

                <Box sx={{ width: '1px', height: 24, bgcolor: 'divider', mx: 1 }} />

                <Typography variant="caption" sx={{ alignSelf: 'center', mr: 1 }}>
                  Төлөв:
                </Typography>
                <Chip
                  label="Бүгд"
                  color={statusFilter === 'all' ? 'primary' : 'default'}
                  onClick={() => setStatusFilter('all')}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Идэвхтэй"
                  color={statusFilter === 'active' ? 'success' : 'default'}
                  onClick={() => setStatusFilter('active')}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Идэвхгүй"
                  color={statusFilter === 'inactive' ? 'default' : 'default'}
                  onClick={() => setStatusFilter('inactive')}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Premium"
                  color={statusFilter === 'premium' ? 'warning' : 'default'}
                  onClick={() => setStatusFilter('premium')}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                  icon={<Iconify icon="carbon:star-filled" />}
                />
              </Stack>
            </Stack>
          </Card>

          {/* Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Хэрэглэгч</TableCell>
                    <TableCell>Эрх</TableCell>
                    <TableCell align="center">Premium</TableCell>
                    <TableCell align="center">Төлөв</TableCell>
                    <TableCell>Сүүлд нэвтэрсэн</TableCell>
                    <TableCell>Бүртгэгдсэн</TableCell>
                    <TableCell align="right">Үйлдэл</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Хэрэглэгчдийг уншиж байна...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                        <Iconify
                          icon="carbon:user-multiple"
                          sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                          Хэрэглэгч байхгүй байна
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                          Эхний хэрэглэгчээ нэмнэ үү
                        </Typography>
                        <Button
                          variant="contained"
                          component={RouterLink}
                          href={paths.webtoon.cms.createUser}
                          startIcon={<Iconify icon="carbon:user-add" />}
                        >
                          Хэрэглэгч нэмэх
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && users.length > 0 && filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                        <Iconify
                          icon="carbon:search"
                          sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                          Хэрэглэгч олдсонгүй
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Өөр хайлтаар оролдоно уу
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    filteredUsers.length > 0 &&
                    filteredUsers.map((user) => (
                      <UserTableRow
                        key={user._id || user.id}
                        user={user}
                        onUpdate={() => window.location.reload()}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

type UserTableRowProps = {
  user: any;
  onUpdate: () => void;
};

function UserTableRow({ user, onUpdate }: UserTableRowProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [updating, setUpdating] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTogglePremium = async () => {
    if (updating) return;
    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api2/users/${user._id || user.id}/premium`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ premium: !user.isPremium }),
      });

      const result = await response.json();

      if (result.success) {
        onUpdate();
      } else {
        alert(result.error || result.message || 'Алдаа гарлаа');
      }
    } catch (error) {
      console.error('Toggle premium error:', error);
      alert('Сүлжээний алдаа. Дахин оролдоно уу.');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async () => {
    if (updating) return;
    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const newActive = !user.isActive;
      const response = await fetch(`/api2/users/${user._id || user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newActive }),
      });

      const result = await response.json();

      if (result.success) {
        onUpdate();
      } else {
        alert(result.error || result.message || 'Алдаа гарлаа');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      alert('Сүлжээний алдаа. Дахин оролдоно уу.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    handleClose();

    if (!window.confirm(`"${user.displayName}" хэрэглэгчийг устгах уу?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api2/users/${user._id || user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        alert('Хэрэглэгч амжилттай устгагдлаа!');
        onUpdate();
      } else {
        alert(result.error || result.message || 'Устгахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Сүлжээний алдаа. Дахин оролдоно уу.');
    }
  };

  const getInitials = (displayName: string, username?: string) => {
    const name = displayName || username || '?';
    if (!name || name === '?') return '?';

    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: alpha(theme.palette.primary.main, 0.2),
              color: theme.palette.primary.main,
              fontWeight: 700,
            }}
          >
            {getInitials(user.displayName, user.username)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user.displayName}
              {user.username && (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: 'text.disabled', ml: 1 }}
                >
                  @{user.username}
                </Typography>
              )}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user.email}
            </Typography>
            {user.isEmailVerified && (
              <Iconify
                icon="carbon:checkmark-filled"
                sx={{ color: 'success.main', fontSize: 14, ml: 0.5, verticalAlign: 'middle' }}
              />
            )}
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Chip
          label={ROLE_OPTIONS[user.role as keyof typeof ROLE_OPTIONS]?.label || user.role}
          color={ROLE_OPTIONS[user.role as keyof typeof ROLE_OPTIONS]?.color || 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </TableCell>

      <TableCell align="center">
        <FormControlLabel
          control={
            <Switch
              checked={user.isPremium || false}
              onChange={handleTogglePremium}
              disabled={updating}
              color="warning"
            />
          }
          label=""
          sx={{ m: 0 }}
        />
        {user.isPremium && (
          <Iconify icon="carbon:star-filled" sx={{ color: 'warning.main', ml: 1 }} />
        )}
      </TableCell>

      <TableCell align="center">
        <FormControlLabel
          control={
            <Switch
              checked={user.isActive}
              onChange={handleToggleActive}
              disabled={updating}
              color="success"
            />
          }
          label=""
          sx={{ m: 0 }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {user.lastLogin ? new Date(user.lastLogin).toLocaleString('mn-MN') : 'Хэзээ ч үгүй'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('mn-MN') : '-'}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <IconButton color={open ? 'inherit' : 'default'} onClick={handleClick}>
          <Iconify icon="carbon:overflow-menu-vertical" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {[
            <MenuItem key="view" onClick={handleClose}>
              <Iconify icon="carbon:view" sx={{ mr: 1 }} />
              Дэлгэрэнгүй
            </MenuItem>,
            <MenuItem key="edit" onClick={handleClose}>
              <Iconify icon="carbon:edit" sx={{ mr: 1 }} />
              Засах
            </MenuItem>,
            <MenuItem
              key="premium"
              onClick={() => {
                handleClose();
                handleTogglePremium();
              }}
            >
              <Iconify icon="carbon:star" sx={{ mr: 1 }} />
              {user.isPremium ? 'Premium цуцлах' : 'Premium болгох'}
            </MenuItem>,
            <MenuItem key="delete" onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="carbon:trash-can" sx={{ mr: 1 }} />
              Устгах
            </MenuItem>,
          ]}
        </Menu>
      </TableCell>
    </TableRow>
  );
}
