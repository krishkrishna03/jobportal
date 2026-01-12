// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL || process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export { SERVER_BASE_URL };

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/auth/resend-otp`,
  FORGET_PASSWORD: `${API_BASE_URL}/auth/forget-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,

  // Jobs
  GET_JOBS: `${API_BASE_URL}/jobs`,
  GET_JOB_BY_ID: (id) => `${API_BASE_URL}/jobs/${id}`,
  CREATE_JOB: `${API_BASE_URL}/jobs`,
  UPDATE_JOB: (id) => `${API_BASE_URL}/jobs/${id}`,
  DELETE_JOB: (id) => `${API_BASE_URL}/jobs/${id}`,

  // Applications
  GET_APPLICATIONS: `${API_BASE_URL}/applications`,
  GET_USER_APPLICATIONS: `${API_BASE_URL}/applications/user`,
  CREATE_APPLICATION: `${API_BASE_URL}/applications`,
  UPDATE_APPLICATION: (id) => `${API_BASE_URL}/applications/${id}`,

  // Users
  GET_USERS: `${API_BASE_URL}/auth/users`,
  GET_USER_PROFILE: `${API_BASE_URL}/auth/profile`,
  UPDATE_USER_PROFILE: `${API_BASE_URL}/auth/profile`,
  UPLOAD_PROFILE_PICTURE: `${API_BASE_URL}/auth/upload-profile-picture`,
  GET_STATS: `${API_BASE_URL}/auth/stats`,

  // Contact
  SEND_CONTACT: `${API_BASE_URL}/contact`,
  SUBSCRIBE_NEWSLETTER: `${API_BASE_URL}/contact/newsletter`,
};

// API Helper Functions
export const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // If headers is explicitly set to empty object, remove Content-Type for FormData
  if (options.headers && Object.keys(options.headers).length === 0) {
    delete config.headers['Content-Type'];
  }

  // Add authorization token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: (data) => apiRequest(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  register: (data) => apiRequest(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  verifyOTP: (data) => apiRequest(API_ENDPOINTS.VERIFY_OTP, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  resendOTP: (data) => apiRequest(API_ENDPOINTS.RESEND_OTP, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  forgetPassword: (data) => apiRequest(API_ENDPOINTS.FORGET_PASSWORD, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  resetPassword: (data) => apiRequest(API_ENDPOINTS.RESET_PASSWORD, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Jobs API calls
export const jobsAPI = {
  getAllJobs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`${API_ENDPOINTS.GET_JOBS}?${queryString}`);
  },

  getJobById: (id) => apiRequest(API_ENDPOINTS.GET_JOB_BY_ID(id)),

  createJob: (data) => apiRequest(API_ENDPOINTS.CREATE_JOB, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateJob: (id, data) => apiRequest(API_ENDPOINTS.UPDATE_JOB(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteJob: (id) => apiRequest(API_ENDPOINTS.UPDATE_JOB(id), {
    method: 'DELETE',
  }),
};

// Applications API calls
export const applicationsAPI = {
  getAllApplications: () => apiRequest(API_ENDPOINTS.GET_APPLICATIONS),

  getUserApplications: () => apiRequest(API_ENDPOINTS.GET_USER_APPLICATIONS),

  createApplication: (formData) => apiRequest(API_ENDPOINTS.CREATE_APPLICATION, {
    method: 'POST',
    body: formData,
    headers: {}, // Override default Content-Type for FormData
  }),

  applyForJob: (applicationData) => apiRequest(API_ENDPOINTS.CREATE_APPLICATION, {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),

  updateApplication: (id, data) => apiRequest(API_ENDPOINTS.UPDATE_APPLICATION(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Users API calls
export const usersAPI = {
  getAllUsers: () => apiRequest(API_ENDPOINTS.GET_USERS),

  getUserProfile: () => apiRequest(API_ENDPOINTS.GET_USER_PROFILE),

  updateUserProfile: (data) => apiRequest(API_ENDPOINTS.UPDATE_USER_PROFILE, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  uploadProfilePicture: (formData) => apiRequest(API_ENDPOINTS.UPLOAD_PROFILE_PICTURE, {
    method: 'POST',
    body: formData,
    headers: {}, // Override default Content-Type for FormData
  }),

  getStats: () => apiRequest(API_ENDPOINTS.GET_STATS),
};

// Contact API calls
export const contactAPI = {
  sendMessage: (data) => apiRequest(API_ENDPOINTS.SEND_CONTACT, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  subscribeNewsletter: (email) => apiRequest(API_ENDPOINTS.SUBSCRIBE_NEWSLETTER, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};

const api = {
  API_BASE_URL,
  SERVER_BASE_URL,
  API_ENDPOINTS,
  apiRequest,
  authAPI,
  jobsAPI,
  applicationsAPI,
  usersAPI,
  contactAPI,
};

export default api;