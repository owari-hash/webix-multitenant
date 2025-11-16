'use client';

import { useScroll } from 'framer-motion';

import ScrollProgress from 'src/components/scroll-progress';

import AdminHero from '../admin-hero';
import AdminDashboardStats from '../admin-dashboard-stats';
import AdminComicsManagement from '../admin-comics-management';
import AdminUsersOverview from '../admin-users-overview';
import AdminAnalyticsChart from '../admin-analytics-chart';
import AdminNotifications from '../admin-notifications';

// ----------------------------------------------------------------------

export default function AdminView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      {/* Hero Section */}
      <AdminHero />

      {/* Dashboard Statistics */}
      <AdminDashboardStats />

      {/* Comics Management */}
      <AdminComicsManagement />

      {/* Users Overview */}
      <AdminUsersOverview />

      {/* Analytics Chart */}
      <AdminAnalyticsChart />

      {/* Notifications & Updates */}
      <AdminNotifications />
    </>
  );
}
