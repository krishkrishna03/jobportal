import React, { useState, useEffect } from 'react';
import { usersAPI, jobsAPI, applicationsAPI } from '../api';

const Analysis = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login again');
        window.location.href = '/login';
        return;
      }

      // Try to get detailed stats (admin only)
      try {
        const [usersRes, jobsRes, appsRes] = await Promise.all([
          usersAPI.getAllUsers(),
          jobsAPI.getAllJobs(),
          applicationsAPI.getAllApplications()
        ]);

        const users = usersRes;
        const jobs = jobsRes;
        const applications = appsRes;

        setStats({
          totalUsers: users.length,
          totalJobs: jobs.length,
          totalApplications: applications.length,
          pendingApplications: applications.filter(app => app.status === 'pending').length,
          approvedApplications: applications.filter(app => app.status === 'approved').length,
          rejectedApplications: applications.filter(app => app.status === 'rejected').length
        });
      } catch (adminError) {
        // If not admin, try to get public stats
        try {
          const publicStats = await usersAPI.getStats();
          setStats({
            totalUsers: publicStats.users,
            totalJobs: publicStats.jobs,
            totalApplications: 0, // Public stats don't include applications
            pendingApplications: 0,
            approvedApplications: 0,
            rejectedApplications: 0
          });
        } catch (statsError) {
          console.error('Error fetching public stats:', statsError);
          alert('Unable to load statistics. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert('Error loading analysis data. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4 mt-24">
      <h1 className="text-4xl font-bold text-center mb-10">Admin Analysis Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded shadow">
          <h3 className="text-2xl font-bold text-blue-600">{stats.totalUsers}</h3>
          <p className="text-gray-700">Total Users</p>
        </div>
        <div className="bg-green-100 p-6 rounded shadow">
          <h3 className="text-2xl font-bold text-green-600">{stats.totalJobs}</h3>
          <p className="text-gray-700">Total Jobs</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded shadow">
          <h3 className="text-2xl font-bold text-yellow-600">{stats.totalApplications}</h3>
          <p className="text-gray-700">Total Applications</p>
        </div>
        <div className="bg-orange-100 p-6 rounded shadow">
          <h3 className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</h3>
          <p className="text-gray-700">Pending Applications</p>
        </div>
        <div className="bg-purple-100 p-6 rounded shadow">
          <h3 className="text-2xl font-bold text-purple-600">{stats.approvedApplications}</h3>
          <p className="text-gray-700">Approved Applications</p>
        </div>
        <div className="bg-red-100 p-6 rounded shadow">
          <h3 className="text-2xl font-bold text-red-600">{stats.rejectedApplications}</h3>
          <p className="text-gray-700">Rejected Applications</p>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = '/admin'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Manage Jobs
          </button>
          <button
            onClick={fetchStats}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Refresh Statistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;