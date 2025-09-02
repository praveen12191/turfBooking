import React from 'react';
import { Calendar, Clock, Users, Trophy } from 'lucide-react';

interface HomepageProps {
  onBookSlot: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onBookSlot }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-green-400" />
              <h1 className="text-2xl font-bold text-white">TurfBooker</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-green-400 transition-colors">Home</a>
              <a href="#" className="text-white hover:text-green-400 transition-colors">Sports</a>
              <a href="#" className="text-white hover:text-green-400 transition-colors">Contact</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Book Your Perfect
              <span className="text-green-400 block">Sports Experience</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Reserve premium sports facilities with just a few clicks. Available 24/7 for all your favorite games.
            </p>
            
            <button
              onClick={onBookSlot}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25"
            >
              Book a Slot
            </button>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-3">
                  <Calendar className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-white font-semibold">Easy Booking</h3>
                <p className="text-gray-300 text-sm">Quick reservations</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-3">
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold">24/7 Access</h3>
                <p className="text-gray-300 text-sm">Round the clock</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mx-auto mb-3">
                  <Users className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold">Multiple Courts</h3>
                <p className="text-gray-300 text-sm">Various options</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-3">
                  <Trophy className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold">Premium Quality</h3>
                <p className="text-gray-300 text-sm">Best facilities</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-gray-400">© 2025 TurfBooker. Premium sports facility booking.</p>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;