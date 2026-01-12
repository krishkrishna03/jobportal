import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import Analysis from './components/Analysis';
import Careers from './components/Careers';
import UserProfile from './components/UserProfile';
import ForgetPassword from './components/ForgetPassword';
import FAQ from './components/FAQ';
import Investors from './components/Investors';
import AboutUs from './components/AboutUs';
import Discover from './components/Discover';
import OurTeam from './components/OurTeam';
import Milestones from './components/Milestones';
import Contact from './components/Contact';
import LoadingPage from './components/LoadingPage';

function AppContent() {
  const location = useLocation();
  const isLoadingPage = location.pathname === '/loading';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!isLoadingPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </main>
      {!isLoadingPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;