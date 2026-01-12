import React, { useEffect, useState } from 'react';
import { jobsAPI, applicationsAPI } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import JobApplicationForm from './JobApplicationForm';

const JobDetail = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      const res = await jobsAPI.getJobById(id);
      setJob(res);

      // Check if user has applied
      const appsRes = await applicationsAPI.getUserApplications();
      const applied = appsRes.some(app => app.job._id === id);
      setHasApplied(applied);
    };
    fetchData();
  }, [id, navigate]);

  if (!job) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl mb-4">{job.title}</h1>
      <p className="mb-4">{job.description}</p>
      <p>Company: {job.company}</p>
      <p>Location: {job.location}</p>
      <p>Salary: {job.salary}</p>
      {user && user.role === 'user' && (
        hasApplied ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-green-800 font-semibold">Application Submitted</p>
                <p className="text-green-600 text-sm">Your application for this position has been received. We'll review it and get back to you soon.</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold mt-6"
          >
            Apply for this Job
          </button>
        )
      )}

      {showForm && (
        <JobApplicationForm
          job={job}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            setHasApplied(true);
          }}
        />
      )}
    </div>
  );
};

export default JobDetail;