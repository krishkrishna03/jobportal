import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      category: 'Website Usage',
      questions: [
        {
          question: 'How do I register on the website?',
          answer: 'Click on the "Register" button in the navbar, fill in your details including name, email, password, phone, location, GitHub URL, and LinkedIn URL, then submit the form.'
        },
        {
          question: 'How do I apply for a job?',
          answer: 'Log in as a user, browse available jobs, click on a job to view details, and click "Apply" to fill out the application form with your details and resume.'
        },
        {
          question: 'How do I view my applied jobs?',
          answer: 'Log in and go to your Dashboard to see all jobs you have applied for along with their status.'
        }
      ]
    },
    {
      category: 'Services',
      questions: [
        {
          question: 'What services do you offer?',
          answer: 'We provide job posting for employers and job searching for job seekers. Employers can add, edit, and delete jobs, while users can apply for jobs and track their applications.'
        },
        {
          question: 'Is there a fee for using the platform?',
          answer: 'Currently, our platform is free for both job seekers and employers. However, premium features may be introduced in the future.'
        },
        {
          question: 'How do employers post jobs?',
          answer: 'Employers need to register as admin (contact support for admin access), then log in to the admin dashboard to add, edit, or delete jobs.'
        }
      ]
    },
    {
      category: 'General Queries',
      questions: [
        {
          question: 'How do I contact support?',
          answer: 'You can contact us via email at crsolutions@gmail.com or phone at +1 923-456-982. Our address is 1300 Center Avenue, Fresno, California, United States.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes, we use JWT for authentication and bcrypt for password hashing. All data is stored securely in MongoDB.'
        },
        {
          question: 'Can I update my profile?',
          answer: 'Currently, profile updates are not available in the UI, but you can contact support to update your information.'
        }
      ]
    }
  ];

  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Find answers to common questions about our platform, services, and how to make the most of your experience.</p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white px-6 py-4">
                <h3 className="text-xl font-bold">{category.category}</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0">
                    <button
                      className="w-full text-left px-6 py-5 focus:outline-none hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleFAQ(`${categoryIndex}-${index}`)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</span>
                        <div className="flex-shrink-0">
                          <svg
                            className={`w-6 h-6 text-blue-600 transform transition-transform duration-200 ${
                              activeIndex === `${categoryIndex}-${index}` ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {activeIndex === `${categoryIndex}-${index}` && (
                      <div className="px-6 pb-5 bg-blue-50">
                        <div className="pt-2">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:crsolutions@gmail.com"
              className="flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <a
              href="tel:+1923456982"
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">User Guide</h4>
            <p className="text-gray-600 text-sm mb-4">Step-by-step guide to using our platform</p>
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300">
              Learn More →
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Getting Started</h4>
            <p className="text-gray-600 text-sm mb-4">Quick tips for new users</p>
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300">
              Get Started →
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Help Center</h4>
            <p className="text-gray-600 text-sm mb-4">Browse our knowledge base</p>
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300">
              Browse Help →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;