import React, { useEffect, useState } from 'react';
import { jobsAPI, applicationsAPI, usersAPI, SERVER_BASE_URL } from '../api';

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes, userRes] = await Promise.all([
          applicationsAPI.getUserApplications(),
          jobsAPI.getAllJobs(),
          usersAPI.getUserProfile()
        ]);
        setApplications(appsRes);
        setJobs(jobsRes);
        setUser(userRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  }, [token]);

  // Show loading or redirect if not authenticated
  if (!token || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    rejectedApplications: applications.filter(app => app.status === 'rejected').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Dashboard</h1>

        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'jobs', label: 'Browse Jobs', icon: '🔍' },
              { id: 'applications', label: 'My Applications', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Applications</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Under Review</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approvedApplications}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Not Selected</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejectedApplications}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <span className="text-2xl">❌</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span className="mr-2">🔍</span>
                  Browse Jobs
                </button>
                <button 
                  onClick={() => window.location.href = '/profile'}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span className="mr-2">📝</span>
                  Update Profile
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                  <span className="mr-2">📊</span>
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Header with Picture */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                      {user.profilePicture ? (
                        <img
                          src={`${SERVER_BASE_URL}/${user.profilePicture}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => window.location.href = '/profile'}
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">{user.name || 'User'}</h3>
                    <p className="text-gray-500 capitalize">{user.role === 'admin' ? 'Administrator' : 'Job Seeker'}</p>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                    <div className="text-sm text-blue-800 font-medium">Total Applications</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {applications.filter(app => app.status === 'approved').length}
                    </div>
                    <div className="text-sm text-green-800 font-medium">Approved</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {applications.filter(app => app.status === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-800 font-medium">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-3">👤</span>
                  Profile Information
                </h2>
                <button
                  onClick={() => window.location.href = '/profile'}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                >
                  ✏️ Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Details</h3>

                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Full Name</p>
                      <p className="text-lg font-semibold text-gray-800">{user.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email Address</p>
                      <p className="text-lg font-semibold text-gray-800">{user.email || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-800">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                    <div className="bg-orange-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Location</p>
                      <p className="text-lg font-semibold text-gray-800">{user.location || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Professional Details</h3>

                  <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Education Level</p>
                      <p className="text-lg font-semibold text-gray-800">{user.educationLevel || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
                    <div className="bg-teal-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m0 0l-2-2m2 2l2-2m6-6v6m0 0l2 2m-2-2l-2 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Experience</p>
                      <p className="text-lg font-semibold text-gray-800">{user.experience || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-100">
                    <div className="bg-pink-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m0 0l-2-2m2 2l2-2m6-6v6m0 0l2 2m-2-2l-2 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Current Year</p>
                      <p className="text-lg font-semibold text-gray-800">{user.currentYear || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Passout Year</p>
                      <p className="text-lg font-semibold text-gray-800">{user.passoutYear || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(user.githubUrl || user.linkedinUrl) && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">Social Profiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.githubUrl && (
                      <a
                        href={user.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="bg-gray-800 p-3 rounded-full mr-4">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">GitHub Profile</p>
                          <p className="text-blue-600 hover:text-blue-800 font-semibold">View Profile →</p>
                        </div>
                      </a>
                    )}

                    {user.linkedinUrl && (
                      <a
                        href={user.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="bg-blue-600 p-3 rounded-full mr-4">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">LinkedIn Profile</p>
                          <p className="text-blue-600 hover:text-blue-800 font-semibold">View Profile →</p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Type Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                <span className="mr-3">🔐</span>
                Account Type & Security
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Type */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Account Information</h3>

                  <div className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="bg-blue-100 p-4 rounded-full mr-6">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Account Type</p>
                      <p className="text-xl font-bold text-gray-800 capitalize">
                        {user.role === 'admin' ? 'Administrator' : 'Job Seeker'}
                      </p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'
                        }`}></span>
                        {user.role === 'admin' ? 'Admin Access' : 'Standard Access'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="bg-green-100 p-4 rounded-full mr-6">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Account Status</p>
                      <p className="text-xl font-bold text-green-800">Active</p>
                      <p className="text-sm text-gray-600 mt-1">Your account is in good standing</p>
                    </div>
                  </div>
                </div>

                {/* Security & Actions */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Security & Actions</h3>

                  <div className="space-y-4">
                    <button className="w-full flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                      <div className="bg-gray-100 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">Change Password</p>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <button className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">Account Settings</p>
                        <p className="text-sm text-gray-500">Manage your account preferences</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <button className="w-full flex items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">Delete Account</p>
                        <p className="text-sm text-gray-500">Permanently delete your account</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">🔍</span>
                Available Jobs ({jobs.length})
              </h2>
              <div className="text-sm text-gray-500">
                Find your next opportunity
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs available</h3>
                <p className="text-gray-500">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                  <div key={job._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <span className="mr-4">🏢 {job.company}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <span className="mr-4">📍 {job.location}</span>
                        {job.salary && <span className="mr-4">💰 {job.salary}</span>}
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {job.sector}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => window.location.href = `/jobs/${job._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
                      >
                        View Details
                      </button>
                      <span className="text-xs text-gray-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">📋</span>
                My Applications ({applications.length})
              </h2>
              <div className="text-sm text-gray-500">
                Track your job application progress
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6">Start applying to jobs to see your applications here</p>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🔍 Browse Available Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map(app => (
                  <div key={app._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{app.job?.title}</h3>
                        <div className="flex items-center text-gray-600 mb-3">
                          <span className="mr-4">🏢 {app.job?.company}</span>
                          <span className="mr-4">📍 {app.job?.location}</span>
                          {app.job?.salary && <span>💰 {app.job.salary}</span>}
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(app.status)} flex items-center`}>
                        <span className="mr-2">{getStatusIcon(app.status)}</span>
                        {app.status || 'pending'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">📧 Email:</span> {app.email}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">📱 Phone:</span> {app.phone}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">📍 Location:</span> {app.location}
                        </p>
                      </div>
                      <div>
                        {app.githubUrl && app.githubUrl.trim() && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">🐙 GitHub:</span>
                            <a href={app.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                              View Profile
                            </a>
                          </p>
                        )}
                        {app.linkedinUrl && app.linkedinUrl.trim() && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">💼 LinkedIn:</span>
                            <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                              View Profile
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                    

                    {app.coverLetter && (
                      <div className="mb-4">
                        <p className="text-gray-700 font-medium mb-2 text-sm">📝 Cover Letter:</p>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm line-clamp-3">{app.coverLetter}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        {app.resume ? (
                          <>
                            <a
                              href={`${SERVER_BASE_URL}/${app.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                            >
                              👁️ View Resume
                            </a>
                            <a
                              href={`${SERVER_BASE_URL}/${app.resume}`}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
                            >
                              📥 Download Resume
                            </a>
                          </>
                        ) : (
                          <span className="text-red-600 font-medium text-sm">❌ No resume uploaded</span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">
                          Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(app.appliedAt || app.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;