import React, { useState, useEffect, useMemo } from 'react';
import { SERVER_BASE_URL } from '../api';
import AboutUs from './AboutUs';
import OurTeam from './OurTeam';
import Milestones from './Milestones';
import Investors from './Investors';
import Discover from './Discover';
import FAQ from './FAQ';
import Contact from './Contact';

const Home = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Background images - you can replace these with your own images
  const backgrounds = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ];

  // Dynamic stats that could be fetched from API
  const [stats, setStats] = useState({
    jobs: 0,
    users: 0,
    companies: 0
  });

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const sections = useMemo(() => [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About Us', component: AboutUs },
    { id: 'team', name: 'Our Team', component: OurTeam },
    { id: 'milestones', name: 'Milestones', component: Milestones },
    { id: 'investors', name: 'Investors', component: Investors },
    { id: 'discover', name: 'Discover', component: Discover },
    { id: 'faq', name: 'FAQ', component: FAQ },
    { id: 'contact', name: 'Contact', component: Contact }
  ], []);

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Background image rotation
    const bgInterval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Change every 5 seconds

    // Check if admin
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeToken(token);
      setIsAdmin(payload && payload.role === 'admin');
    }

    // Fetch initial stats
    fetchStats();

    // Auto-refresh stats every 30 seconds
    const statsInterval = setInterval(() => {
      fetchStats();
    }, 30000); // Update stats every 30 seconds

    // Scroll handler for navigation
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            // Active section tracking removed - not currently used in UI
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(bgInterval);
      clearInterval(statsInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [backgrounds.length, sections]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch real statistics from public endpoint
      const statsResponse = await fetch(`${SERVER_BASE_URL}/api/auth/stats`);
      const statsData = await statsResponse.json();

      setStats({
        jobs: statsData.jobs,
        users: statsData.users,
        companies: statsData.companies
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to some default values if API fails
      setStats({
        jobs: 1267,
        users: 8549,
        companies: 323
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden" id="home">
        {/* Animated Background Images */}
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentBg ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${bg})`,
              filter: 'brightness(0.4) contrast(1.2)'
            }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-indigo-900/80" />

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
                borderRadius: '50%',
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white max-w-7xl mx-auto">
            {/* Animated Title */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-200 border border-white/20 mb-4">
                  Welcome to the Future of Hiring
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  CR Solutions
                </span>
                <br />
                <span className="text-3xl md:text-5xl lg:text-6xl font-light text-blue-200">
                  Job Platform
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-blue-100 font-light leading-relaxed max-w-4xl mx-auto">
                Connecting talented professionals with innovative companies. Your gateway to career excellence and business growth.
              </p>
            </div>

            {/* Animated Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-20 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <a
                href="/careers"
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="flex items-center justify-center relative z-10">
                  Explore Opportunities
                  <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href="/register"
                className="group bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-semibold text-lg border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Join Our Network</span>
              </a>
              <a
                href="/login"
                className="group bg-transparent border-2 border-white/60 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Sign In</span>
              </a>
            </div>

            {/* Dynamic Stats */}
            <div className={`max-w-4xl mx-auto mb-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {isAdmin && (
                <div className="flex justify-center mb-6">
                  <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                  >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {loading ? 'Updating...' : 'Refresh Stats'}
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">
                    {loading ? '...' : stats.jobs.toLocaleString()}+
                  </div>
                  <div className="text-lg font-semibold">Active Jobs</div>
                  <div className="text-sm text-blue-200">Updated live</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold text-green-300 mb-2">
                    {loading ? '...' : stats.users.toLocaleString()}+
                  </div>
                  <div className="text-lg font-semibold">Registered Users</div>
                  <div className="text-sm text-blue-200">Growing community</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold text-purple-300 mb-2">
                    {loading ? '...' : stats.companies}+
                  </div>
                  <div className="text-lg font-semibold">Partner Companies</div>
                  <div className="text-sm text-blue-200">Trusted partners</div>
                </div>
              </div>
            </div>

            {/* Feature Cards with Animation */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="group glass-card p-8 rounded-2xl border border-white/20 hover-lift shadow-2xl animate-float">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-spin transition-all duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">For Job Seekers</h3>
                <p className="text-blue-100 leading-relaxed">Browse thousands of job opportunities and apply with ease. Our advanced matching system helps you find the perfect career fit.</p>
              </div>

              <div className="group glass-card p-8 rounded-2xl border border-white/20 hover-lift shadow-2xl animate-float" style={{animationDelay: '1s'}}>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-spin transition-all duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">For Employers</h3>
                <p className="text-blue-100 leading-relaxed">Post jobs and find the perfect candidates for your team. Access our talent pool and streamline your hiring process.</p>
              </div>

              <div className="group glass-card p-8 rounded-2xl border border-white/20 hover-lift shadow-2xl animate-float" style={{animationDelay: '2s'}}>
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-spin transition-all duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Easy & Secure</h3>
                <p className="text-blue-100 leading-relaxed">Secure platform with advanced features for seamless hiring. Your data is protected with enterprise-grade security.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Other Sections */}
      {sections.slice(1).map(({ id, component: Component }) => {
        if (!Component) return null; // Skip sections without components
        return (
          <section key={id} id={id} className="min-h-screen py-16 bg-gray-50">
            <Component />
          </section>
        );
      })}
    </div>
  );
};

export default Home;