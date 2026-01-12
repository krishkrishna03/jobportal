import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p>We are CR Solutions, an educational and job platform connecting talented individuals with top companies. Find your dream job or hire the best talent.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Useful Links</h3>
            <ul>
              <li><Link to="/about-us" className="hover:text-blue-400">About Us</Link></li>
              <li><Link to="/our-team" className="hover:text-blue-400">Our Team</Link></li>
              <li><Link to="/milestones" className="hover:text-blue-400">Milestones</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400">Careers</Link></li>
              <li><Link to="/investors" className="hover:text-blue-400">Investors</Link></li>
              <li><Link to="/discover" className="hover:text-blue-400">Discover</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400">FAQ</Link></li>
              <li><a href="#" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <p>Address: 1300 Center Avenue, Fresno, California, United States</p>
            <p>Phone: +1 923-456-982</p>
            <p>Email: crsolutions@gmail.com</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Facebook</a>
              <a href="#" className="hover:text-blue-400">Instagram</a>
              <a href="#" className="hover:text-blue-400">LinkedIn</a>
              <a href="#" className="hover:text-blue-400">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>&copy; 2025 CR Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;