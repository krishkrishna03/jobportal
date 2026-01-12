import React, { useEffect, useState, useMemo } from 'react';
import { jobsAPI, applicationsAPI, usersAPI, SERVER_BASE_URL } from '../api';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '', company: '', location: '', salary: '', sector: '' });
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      window.location.href = '/login';
    }
  }, [token, user]);

  useEffect(() => {
    if (token && user.role === 'admin') {
      fetchData();
    }
  }, [token, user]);

  const fetchData = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    try {
      const jobsRes = await jobsAPI.getAllJobs();
      setJobs(jobsRes);
      const appsRes = await applicationsAPI.getAllApplications();
      setApplications(appsRes);
      const usersRes = await usersAPI.getAllUsers();
      setUsers(usersRes);
    } catch (error) {
      if (error.message.includes('No token') || error.message.includes('Unauthorized')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser({});
        window.location.href = '/login';
      }
      console.error('Error fetching data:', error);
    }
  };

  const addJob = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      window.location.href = '/login';
      return;
    }
    try {
      await jobsAPI.createJob(newJob);
      setNewJob({ title: '', description: '', company: '', location: '', salary: '', sector: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding job:', error);
      // Don't logout here, just show error
    }
  };

  const editJob = async (e) => {
    e.preventDefault();
    try {
      await jobsAPI.updateJob(editingJob._id, editingJob);
      setEditingJob(null);
      fetchData();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await applicationsAPI.updateApplication(id, { status });
      const res = await applicationsAPI.getAllApplications();
      setApplications(res);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const groupedApplications = useMemo(() => {
    const groups = {};
    applications.forEach(app => {
      const jobId = app.job?._id;
      if (!groups[jobId]) {
        groups[jobId] = {
          job: app.job,
          applications: []
        };
      }
      groups[jobId].applications.push(app);
    });
    return Object.values(groups);
  }, [applications]);

  const downloadJobApplications = (job) => {
    const jobApplications = groupedApplications.find(g => g.job?._id === job._id)?.applications || [];
    if (jobApplications.length === 0) {
      alert('No applications for this job');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Location', 'GitHub URL', 'LinkedIn URL', 'Status', 'Applied Date'];
    const csvContent = [
      headers.join(','),
      ...jobApplications.map(app => [
        `"${app.name || ''}"`,
        `"${app.email || ''}"`,
        `"${app.phone || ''}"`,
        `"${app.location || ''}"`,
        `"${app.githubUrl || ''}"`,
        `"${app.linkedinUrl || ''}"`,
        `"${app.status || ''}"`,
        `"${new Date(app.createdAt || Date.now()).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${job.title}_${job.company}_applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadApplications = () => {
    if (applications.length === 0) {
      alert('No applications to download');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Location', 'GitHub URL', 'LinkedIn URL', 'Job Title', 'Company', 'Status', 'Applied Date'];
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        `"${app.name || ''}"`,
        `"${app.email || ''}"`,
        `"${app.phone || ''}"`,
        `"${app.location || ''}"`,
        `"${app.githubUrl || ''}"`,
        `"${app.linkedinUrl || ''}"`,
        `"${app.job?.title || ''}"`,
        `"${app.job?.company || ''}"`,
        `"${app.status || ''}"`,
        `"${new Date(app.createdAt || Date.now()).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    totalJobs: jobs.length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'jobs', label: 'Manage Jobs', icon: '💼' },
              { id: 'applications', label: 'Applications', icon: '📋' },
              { id: 'users', label: 'User Profiles', icon: '👥' }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Jobs</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalJobs}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">💼</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalApplications}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending Review</p>
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
                  <p className="text-3xl font-bold text-purple-600">{stats.approvedApplications}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            {/* Add Job Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">➕</span>
                Add New Job
              </h2>
              <form onSubmit={addJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    name="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe the job requirements, responsibilities, and qualifications..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    name="company"
                    placeholder="e.g., Tech Corp"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    name="location"
                    placeholder="e.g., New York, NY"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <input
                    name="salary"
                    placeholder="e.g., $80,000 - $120,000"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                  <select
                    name="sector"
                    value={newJob.sector}
                    onChange={(e) => setNewJob({ ...newJob, sector: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select Sector</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">💼</span>
                Active Jobs ({jobs.length})
              </h2>
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                        <div className="flex items-center text-gray-600 mb-3">
                          <span className="mr-4">🏢 {job.company}</span>
                          <span className="mr-4">📍 {job.location}</span>                            <span className="mr-4">🏷️ {job.sector}</span>                          {job.salary && <span>💰 {job.salary}</span>}
                        </div>
                        <p className="text-gray-700 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingJob(job)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteJob(job._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Job Modal */}
            {editingJob && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl mx-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Job</h3>
                  <form onSubmit={editJob} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        name="title"
                        value={editingJob.title}
                        onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={editingJob.description}
                        onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                          name="company"
                          value={editingJob.company}
                          onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          name="location"
                          value={editingJob.location}
                          onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                        <select
                          name="sector"
                          value={editingJob.sector}
                          onChange={(e) => setEditingJob({ ...editingJob, sector: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Sector</option>
                          <option value="IT">IT</option>
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                        <input
                          name="salary"
                          value={editingJob.salary}
                          onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                      >
                        ✅ Update Job
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingJob(null)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {selectedJob ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center mb-2"
                    >
                      ← Back to Jobs
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <span className="mr-3">📋</span>
                      Applications for: {selectedJob.title} at {selectedJob.company}
                    </h2>
                    <p className="text-gray-600">{selectedJob.applications.length} application{selectedJob.applications.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => downloadJobApplications(selectedJob)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                  >
                    <span className="mr-2">📥</span>
                    Download CSV
                  </button>
                </div>

                <div className="space-y-6">
                  {selectedJob.applications.map(app => (
                    <div key={app._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{app.name}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={app.status || 'pending'}
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="approved">✅ Approved</option>
                            <option value="rejected">❌ Rejected</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600"><span className="font-medium">📧 Email:</span> {app.email}</p>
                          <p className="text-gray-600"><span className="font-medium">📱 Phone:</span> {app.phone}</p>
                          <p className="text-gray-600"><span className="font-medium">📍 Location:</span> {app.location}</p>
                        </div>
                        <div>
                          {app.githubUrl && (
                            <p className="text-gray-600">
                              <span className="font-medium">🐙 GitHub:</span>
                              <a href={app.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                                {app.githubUrl}
                              </a>
                            </p>
                          )}
                          {app.linkedinUrl && (
                            <p className="text-gray-600">
                              <span className="font-medium">💼 LinkedIn:</span>
                              <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                                {app.linkedinUrl}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>

                      {app.coverLetter && (
                        <div className="mb-4">
                          <p className="text-gray-700 font-medium mb-2">📝 Cover Letter:</p>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{app.coverLetter}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {app.resume ? (
                            <>
                              <a
                                href={`${SERVER_BASE_URL}/${app.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                              >
                                👁️ View Resume
                              </a>
                              <a
                                href={`${SERVER_BASE_URL}/${app.resume}`}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 font-medium flex items-center"
                              >
                                📥 Download Resume
                              </a>
                            </>
                          ) : (
                            <span className="text-red-600 font-medium">❌ No resume uploaded</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">
                          Applied: {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-3">💼</span>
                    Posted Jobs ({groupedApplications.length})
                  </h2>
                  <button
                    onClick={downloadApplications}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                  >
                    <span className="mr-2">📥</span>
                    Download All CSV
                  </button>
                </div>

                <div className="space-y-4">
                  {groupedApplications.map(group => (
                    <div key={group.job?._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300 cursor-pointer" onClick={() => setSelectedJob(group)}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{group.job?.title}</h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <span className="mr-4">🏢 {group.job?.company}</span>
                            <span className="mr-4">📍 {group.job?.location}</span>
                            <span className="mr-4">🏷️ {group.job?.sector}</span>
                            {group.job?.salary && <span>💰 {group.job.salary}</span>}
                          </div>
                          <p className="text-gray-700 mb-3">{group.job?.description}</p>
                          <p className="text-blue-600 font-medium">{group.applications.length} application{group.applications.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadJobApplications(group.job); }}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            📥 Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            {/* Users Management Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-3">👥</span>
                  User Profiles Management
                </h2>
                <div className="text-sm text-gray-500">
                  Total Users: {users.length}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                  <div key={user._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100">
                        {user.profilePicture ? (
                          <img
                            src={`http://localhost:5000/${user.profilePicture}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{user.name || 'No Name'}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Administrator' : 'Job Seeker'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {user.phone || 'No phone'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {user.location || 'No location'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {user.educationLevel || 'No education info'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m0 0l-2-2m2 2l2-2m6-6v6m0 0l2 2m-2-2l-2 2" />
                        </svg>
                        {user.experience || 'No experience info'}
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      {user.githubUrl && (
                        <a
                          href={user.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          GitHub
                        </a>
                      )}
                      {user.linkedinUrl && (
                        <a
                          href={user.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users Found</h3>
                  <p className="text-gray-500">There are no registered users in the system yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;