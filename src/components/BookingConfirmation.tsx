import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { Game } from '../types';
import { formatTime } from '../utils/timeUtils';

interface BookingConfirmationProps {
  game: Game;
  timeSlot: string;
  court: number;
  onNewBooking: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  game, 
  timeSlot, 
  court, 
  onNewBooking 
}) => {
  const bookingId = `TB${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-pulse" />
            <div className="absolute inset-0 h-24 w-24 mx-auto bg-green-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your slot has been successfully reserved
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-xl border p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Booking ID</p>
            <p className="text-2xl font-bold text-gray-900">{bookingId}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Sport</p>
                <p className="font-semibold text-gray-900">{game.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold text-gray-900">{formatTime(timeSlot)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Court</p>
                <p className="font-semibold text-gray-900">Court {court + 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Please arrive 10 minutes before your slot</li>
            <li>• Cancellation allowed up to 2 hours before</li>
            <li>• Bring your own equipment if required</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onNewBooking}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            Book Another Slot
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;