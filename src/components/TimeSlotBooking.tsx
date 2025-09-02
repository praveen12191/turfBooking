import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { Game, TimeSlot } from '../types';
import { generateTimeSlots } from '../utils/timeSlots';
import { formatTime, getCurrentTime } from '../utils/timeUtils';

interface TimeSlotBookingProps {
  game: Game;
  onBack: () => void;
  onBookingConfirm: (timeSlot: string, court: number) => void;
}

const TimeSlotBooking: React.FC<TimeSlotBookingProps> = ({ game, onBack, onBookingConfirm }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const timeSlots = useMemo(() => generateTimeSlots(game.courts), [game.courts]);
  const currentTime = getCurrentTime();

  const isSlotAvailable = (timeSlot: TimeSlot, courtIndex: number): boolean => {
    return timeSlot.courtAvailability[courtIndex];
  };

  const isSlotPast = (time: string): boolean => {
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    
    if (selectedDateObj.toDateString() !== today.toDateString()) {
      return false;
    }
    
    return time < currentTime;
  };

  const handleSlotSelect = (time: string, courtIndex: number) => {
    // Clear previous selection and set new one
    setSelectedTimeSlot(time);
    setSelectedCourt(courtIndex);
  };

  const handleBooking = () => {
    if (selectedTimeSlot && selectedCourt !== null) {
      onBookingConfirm(selectedTimeSlot, selectedCourt);
    }
  };

  // Group time slots by hour for clock-like display
  const groupedSlots = useMemo(() => {
    const groups: { [hour: string]: TimeSlot[] } = {};
    timeSlots.forEach(slot => {
      const hour = slot.time.split(':')[0];
      if (!groups[hour]) {
        groups[hour] = [];
      }
      groups[hour].push(slot);
    });
    return groups;
  }, [timeSlots]);

  const getClockPosition = (hour: number) => {
    const angle = (hour % 12) * 30 - 90; // 30 degrees per hour, start from top
    const radius = 140;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{game.name} Booking</h1>
                <p className="text-gray-600">Select your preferred time slot</p>
              </div>
            </div>
            
            {/* Date Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimeSlot(null);
                  setSelectedCourt(null);
                }}
                min={new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Game Info Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={game.image}
              alt={game.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
              <div className="flex items-center space-x-4 text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{game.courts} Court{game.courts > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>30-min slots</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clock-like Time Slots */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Select Time Slot</h3>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">Past/Unavailable</span>
            </div>
          </div>

          {/* Clock Interface */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Clock Display */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-80 h-80 mx-auto">
                {/* Clock Face */}
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full bg-gradient-to-br from-white to-gray-50"></div>
                
                {/* Hour Markers */}
                {Array.from({ length: 12 }, (_, i) => {
                  const hour = i === 0 ? 12 : i;
                  const position = getClockPosition(i);
                  return (
                    <div
                      key={i}
                      className="absolute w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-700 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `calc(50% + ${position.x}px)`,
                        top: `calc(50% + ${position.y}px)`
                      }}
                    >
                      {hour}
                    </div>
                  );
                })}

                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Clock Hands for Current Time */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div 
                    className="absolute w-1 bg-gray-600 origin-bottom"
                    style={{
                      height: '60px',
                      transform: `rotate(${(parseInt(currentTime.split(':')[0]) % 12) * 30}deg) translateY(-50%)`
                    }}
                  ></div>
                  <div 
                    className="absolute w-0.5 bg-gray-400 origin-bottom"
                    style={{
                      height: '80px',
                      transform: `rotate(${parseInt(currentTime.split(':')[1]) * 6}deg) translateY(-50%)`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Time Slots List */}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Slots</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {Object.entries(groupedSlots).map(([hour, slots]) => (
                  <div key={hour} className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      {parseInt(hour) === 0 ? '12' : parseInt(hour) > 12 ? parseInt(hour) - 12 : hour}:00 {parseInt(hour) >= 12 ? 'PM' : 'AM'}
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {slots.map((slot) => (
                        <div key={slot.time} className="space-y-1">
                          <p className="text-xs text-gray-600 text-center">{formatTime(slot.time)}</p>
                          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${game.courts}, 1fr)` }}>
                            {Array.from({ length: game.courts }, (_, courtIndex) => {
                              const isAvailable = isSlotAvailable(slot, courtIndex);
                              const isPast = isSlotPast(slot.time);
                              const isSelected = selectedTimeSlot === slot.time && selectedCourt === courtIndex;
                              
                              let buttonClass = "w-full h-8 rounded text-xs font-medium transition-all duration-200 ";
                              
                              if (isPast || !isAvailable) {
                                buttonClass += "bg-gray-300 text-gray-500 cursor-not-allowed";
                              } else if (isSelected) {
                                buttonClass += "bg-blue-500 text-white ring-2 ring-blue-300 shadow-lg";
                              } else {
                                buttonClass += "bg-green-500 text-white hover:bg-green-600 hover:shadow-md transform hover:scale-105";
                              }

                              return (
                                <button
                                  key={courtIndex}
                                  onClick={() => !isPast && isAvailable && handleSlotSelect(slot.time, courtIndex)}
                                  disabled={isPast || !isAvailable}
                                  className={buttonClass}
                                >
                                  C{courtIndex + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary - Only show when exactly one slot is selected */}
        {selectedTimeSlot !== null && selectedCourt !== null && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sport</p>
                  <p className="font-semibold text-gray-900">{game.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900">{formatTime(selectedTimeSlot)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Court</p>
                  <p className="font-semibold text-gray-900">Court {selectedCourt + 1}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleBooking}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TimeSlotBooking;