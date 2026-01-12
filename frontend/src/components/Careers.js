import React, { useState, useEffect, useCallback } from 'react';
import { jobsAPI, applicationsAPI } from '../api';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    contactNumber: '',
    email: '',
    postApplied: '',
    yearsOfExperience: '',
    additionalDetails: '',
    resume: null
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const categories = ['All', 'IT', 'Non-IT', 'Medical', 'Pharmacy', 'Mechanical', 'Civil', 'Banking'];

  const fetchJobs = useCallback(async () => {
    try {
      const response = await jobsAPI.getAllJobs();
      // Add category field to jobs for demonstration (in real app, this would come from backend)
      const jobsWithCategories = response.map(job => ({
        ...job,
        category: getCategoryFromJob(job)
      }));
      setJobs(jobsWithCategories);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const getCategoryFromJob = (job) => {
    const title = job.title.toLowerCase();
    const description = job.description.toLowerCase();

    if (title.includes('software') || title.includes('developer') || title.includes('engineer') || description.includes('it')) return 'IT';
    if (title.includes('doctor') || title.includes('nurse') || title.includes('medical')) return 'Medical';
    if (title.includes('pharmacist') || title.includes('pharmacy')) return 'Pharmacy';
    if (title.includes('mechanic') || title.includes('mechanical')) return 'Mechanical';
    if (title.includes('civil') || title.includes('construction')) return 'Civil';
    if (title.includes('bank') || title.includes('finance')) return 'Banking';
    return 'Non-IT';
  };

  const filteredJobs = selectedCategory === 'All' ? jobs : jobs.filter(job => job.category === selectedCategory);

  const handleApply = (jobTitle) => {
    setApplicationForm({ ...applicationForm, postApplied: jobTitle });
    setShowApplicationForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm({ ...applicationForm, [name]: value });
  };

  const handleFileChange = (e) => {
    setApplicationForm({ ...applicationForm, resume: e.target.files[0] });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', applicationForm.name);
      formData.append('phone', applicationForm.contactNumber);
      formData.append('email', applicationForm.email);
      formData.append('coverLetter', `Post Applied: ${applicationForm.postApplied}\nYears of Experience: ${applicationForm.yearsOfExperience}\nAdditional Details: ${applicationForm.additionalDetails}`);
      if (applicationForm.resume) {
        formData.append('resume', applicationForm.resume);
      }

      // Find the job by title and get its ID
      const selectedJob = jobs.find(job => job.title === applicationForm.postApplied);
      if (!selectedJob) {
        alert('Selected job not found. Please try again.');
        return;
      }
      formData.append('jobId', selectedJob._id);

      await applicationsAPI.createApplication(formData);

      alert('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationForm({
        name: '',
        contactNumber: '',
        email: '',
        postApplied: '',
        yearsOfExperience: '',
        additionalDetails: '',
        resume: null
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exciting career opportunities and be part of a dynamic team that's shaping the future of education and employment.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Current Openings</h2>
            <p className="text-gray-600">Found {filteredJobs.length} opportunities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map(job => (
              <div key={job._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {job.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.company}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </div>

                    <div className="flex items-center text-green-600 font-semibold">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {job.salary}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {job.description.substring(0, 150)}...
                  </p>

                  <button
                    onClick={() => handleApply(job.title)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Apply Now
                    <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No openings found</h3>
              <p className="text-gray-500">Check back later for new opportunities</p>
            </div>
          )}
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Apply for Position
                  </h2>
                  <p className="text-gray-600">Join our team and start your journey</p>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={applicationForm.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Contact Number *</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={applicationForm.contactNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={applicationForm.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Position Applied For *</label>
                    <select
                      name="postApplied"
                      value={applicationForm.postApplied}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select a position</option>
                      {jobs.map(job => (
                        <option key={job._id} value={job.title}>{job.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Years of Experience *</label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={applicationForm.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      min="0"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Additional Details</label>
                    <textarea
                      name="additionalDetails"
                      value={applicationForm.additionalDetails}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      rows="4"
                      placeholder="Tell us about your relevant experience, skills, and why you're interested in this position..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Resume/CV *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Submit Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Careers;