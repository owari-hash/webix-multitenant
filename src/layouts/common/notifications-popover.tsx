import { useState, useEffect, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { fToNow } from 'src/utils/format-time';
import { backendRequest } from 'src/utils/backend-api';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await backendRequest('/notifications');
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const totalUnRead = notifications.filter((item) => item.isUnread === true).length;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnread: false,
      }))
    );
  };

  const handleItemClick = (notification: any) => {
    handleClose();
    if (notification.action) {
      router.push(notification.action);
    }
  };

  return (
    <>
      <IconButton
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Мэдэгдэл</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Танд {totalUnRead} уншаагүй мэдэгдэл байна
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List disablePadding>
            {notifications.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Мэдэгдэл байхгүй байна
                </Typography>
              </Box>
            )}
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleItemClick(notification)}
              />
            ))}
          </List>
        </Scrollbar>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({
  notification,
  onClick,
}: {
  notification: any;
  onClick: () => void;
}) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnread && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: any) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.message}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_order.svg" />,
      title,
    };
  }
  if (notification.type === 'warning') {
    return {
      avatar: <Iconify icon="eva:alert-triangle-fill" sx={{ color: 'warning.main' }} />,
      title,
    };
  }
  if (notification.type === 'error') {
    return {
      avatar: <Iconify icon="eva:alert-circle-fill" sx={{ color: 'error.main' }} />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
