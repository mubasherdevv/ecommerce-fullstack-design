import React from 'react';
import AdminAnalytics from '../components/AdminAnalytics';
import RecentOrdersList from '../components/RecentOrdersList';

export default function AdminDashboardPage() {
  return (
    <div className="container-custom py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-dark">Store Overview</h1>
      </div>

      <AdminAnalytics />
      <RecentOrdersList />
      
    </div>
  );
}
