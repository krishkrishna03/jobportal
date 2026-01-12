import React from 'react';

const OurTeam = () => {
  const teamMembers = [
    {
      name: 'Alice Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former HR Director with 15+ years of experience in talent acquisition.',
      image: 'https://via.placeholder.com/150',
      contact: 'alice@jobportal.com'
    },
    {
      name: 'Bob Smith',
      role: 'CTO & Co-Founder',
      bio: 'Tech entrepreneur with expertise in web development and AI-driven solutions.',
      image: 'https://via.placeholder.com/150',
      contact: 'bob@jobportal.com'
    },
    {
      name: 'Carol Davis',
      role: 'Head of Marketing',
      bio: 'Marketing strategist passionate about connecting people with opportunities.',
      image: 'https://via.placeholder.com/150',
      contact: 'carol@jobportal.com'
    },
    {
      name: 'David Wilson',
      role: 'Lead Developer',
      bio: 'Full-stack developer with a focus on creating intuitive user experiences.',
      image: 'https://via.placeholder.com/150',
      contact: 'david@jobportal.com'
    },
    {
      name: 'Eva Brown',
      role: 'HR Manager',
      bio: 'Dedicated to fostering positive work environments and career growth.',
      image: 'https://via.placeholder.com/150',
      contact: 'eva@jobportal.com'
    },
    {
      name: 'Frank Miller',
      role: 'Customer Support Lead',
      bio: 'Ensuring our users have the best experience with our platform.',
      image: 'https://via.placeholder.com/150',
      contact: 'frank@jobportal.com'
    }
  ];

  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">Our Team</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Meet the passionate professionals behind our platform, dedicated to connecting talent with opportunity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-100"
                  />
                  <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold text-lg mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                <div className="flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors duration-300">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{member.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-8">Our Impact in Numbers</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-blue-100">Years Combined Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Successful Placements</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;