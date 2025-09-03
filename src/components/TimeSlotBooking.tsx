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
    if (selectedTimeSlot === time && selectedCourt === courtIndex) {
      // Deselect if clicking the same slot
      setSelectedTimeSlot(null);
      setSelectedCourt(null);
    } else {
      // Select new slot
      setSelectedTimeSlot(time);
      setSelectedCourt(courtIndex);
    }
  };

  const handleBooking = () => {
    if (selectedTimeSlot && selectedCourt !== null) {
      onBookingConfirm(selectedTimeSlot, selectedCourt);
    }
  };

  // Group slots by 2-hour periods for better organization
  const groupedSlots = useMemo(() => {
    const groups: { [key: string]: TimeSlot[] } = {};
    timeSlots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      const period = Math.floor(hour / 2) * 2;
      const key = `${period.toString().padStart(2, '0')}:00`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(slot);
    });
    return groups;
  }, [timeSlots]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
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

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded ring-2 ring-blue-300"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm text-gray-600">Past/Unavailable</span>
            </div>
          </div>
        </div>

        {/* Innovative Horizontal Time Slots */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Select Time & Court</h3>
          
          <div className="space-y-8">
            {Object.entries(groupedSlots).map(([periodStart, slots]) => {
              const startHour = parseInt(periodStart.split(':')[0]);
              const endHour = startHour + 2;
              const periodLabel = `${formatTime(periodStart)} - ${formatTime(`${endHour.toString().padStart(2, '0')}:00`)}`;
              
              return (
                <div key={periodStart} className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 text-center bg-gray-50 py-2 rounded-lg">
                    {periodLabel}
                  </h4>
                  
                  {/* Horizontal Slot Container */}
                  <div className="relative">
                    {/* Time Labels */}
                    <div className="flex justify-between mb-2 px-2">
                      {slots.map((slot, index) => (
                        <div key={slot.time} className="text-xs text-gray-500 text-center" style={{ width: `${100 / slots.length}%` }}>
                          {slot.time}
                        </div>
                      ))}
                    </div>
                    
                    {/* Court Layers */}
                    <div className="space-y-2">
                      {Array.from({ length: game.courts }, (_, courtIndex) => (
                        <div key={courtIndex} className="relative">
                          {/* Court Label */}
                          <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-700">
                            Court {courtIndex + 1}
                          </div>
                          
                          {/* Horizontal Slot Row */}
                          <div className="flex gap-1 ml-4">
                            {slots.map((slot) => {
                              const isAvailable = isSlotAvailable(slot, courtIndex);
                              const isPast = isSlotPast(slot.time);
                              const isSelected = selectedTimeSlot === slot.time && selectedCourt === courtIndex;
                              
                              let slotClass = "h-12 rounded-lg transition-all duration-200 cursor-pointer border-2 flex items-center justify-center relative group ";
                              
                              if (isPast || !isAvailable) {
                                slotClass += "bg-red-500 border-red-600 cursor-not-allowed";
                              } else if (isSelected) {
                                slotClass += "bg-blue-500 border-blue-600 ring-2 ring-blue-300 shadow-lg scale-105";
                              } else {
                                slotClass += "bg-green-500 border-green-600 hover:bg-green-600 hover:scale-105 hover:shadow-md";
                              }

                              return (
                                <div
                                  key={`${slot.time}-${courtIndex}`}
                                  onClick={() => !isPast && isAvailable && handleSlotSelect(slot.time, courtIndex)}
                                  className={slotClass}
                                  style={{ width: `${100 / slots.length}%` }}
                                >
                                  {/* Slot Status Indicator */}
                                  <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                                  
                                  {/* Hover Tooltip */}
                                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {formatTime(slot.time)} - Court {courtIndex + 1}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
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