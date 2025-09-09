import React, { useState, useMemo } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Trophy } from "lucide-react";
import { Game, TimeSlot } from "../types";
import { generateTimeSlots } from "../utils/timeSlots";
import { formatTime, getCurrentTime } from "../utils/timeUtils";

interface TimeSlotBookingProps {
  game: Game;
  onBack: () => void;
  onBookingConfirm: (
    timeSlots: string[],
    court: number,
    totalCost: number
  ) => void;
}

const TimeSlotBooking: React.FC<TimeSlotBookingProps> = ({
  game,
  onBack,
  onBookingConfirm,
}) => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Price per slot (you can make this configurable or get from game object)
  const pricePerSlot = 500; // ₹500 per 30-min slot
  const totalCost = selectedTimeSlots.length * pricePerSlot;

  const timeSlots = useMemo(
    () => generateTimeSlots(game.courts),
    [game.courts]
  );
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

  const handleBooking = () => {
    if (selectedTimeSlots.length > 0 && selectedCourt !== null) {
      onBookingConfirm(selectedTimeSlots, selectedCourt, totalCost);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-green-100 rounded-full transition-colors border border-gray-200"
            >
              <ArrowLeft className="h-6 w-6 text-green-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-green-700">
                {game.name} Booking
              </h1>
              <p className="text-gray-500 text-sm">
                Choose your slot and court below
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTimeSlots([]);
                setSelectedCourt(null);
              }}
              min={new Date().toISOString().split("T")[0]}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-green-700 font-semibold"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Game Info Card */}
        <div className="bg-white rounded-2xl shadow-md border p-6 mb-8 flex items-center gap-6">
          <img
            src={game.image}
            alt={game.name}
            className="w-20 h-20 rounded-xl object-cover border border-green-100 shadow-sm"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-700 mb-1">
              {game.name}
            </h3>
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {game.courts} Court{game.courts > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                30-min slots
              </span>
            </div>
          </div>
        </div>

        {/* Court Selection */}
        <div className="bg-white rounded-2xl shadow-md border p-6 mb-6">
          <h3 className="text-lg font-bold text-green-700 mb-4 text-center">
            Select Court
          </h3>
          <div className="flex justify-center gap-4">
            {Array.from({ length: game.courts }, (_, courtIndex) => (
              <button
                key={courtIndex}
                onClick={() => {
                  if (selectedCourt === courtIndex) {
                    setSelectedCourt(null);
                    setSelectedTimeSlots([]);
                  } else {
                    setSelectedCourt(courtIndex);
                    setSelectedTimeSlots([]);
                  }
                }}
                className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedCourt === courtIndex
                    ? "bg-green-500 border-green-600 text-white shadow-lg"
                    : "bg-white border-green-300 text-green-700 hover:bg-green-50"
                }`}
              >
                <MapPin className="h-6 w-6 mx-auto mb-1" />
                <div className="font-semibold">Court {courtIndex + 1}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Selection - Horizontal Cards */}
        {selectedCourt !== null && (
          <div className="bg-white rounded-2xl shadow-md border p-6 mb-8">
            <h3 className="text-lg font-bold text-green-700 mb-4 text-center">
              Select Time Slot for Court {selectedCourt + 1}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map((slot) => {
                const isAvailable = isSlotAvailable(slot, selectedCourt);
                const isPast = isSlotPast(slot.time);
                const isSelected = selectedTimeSlots.includes(slot.time);

                return (
                  <button
                    key={slot.time}
                    disabled={isPast || !isAvailable}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTimeSlots((prev) =>
                          prev.filter((time) => time !== slot.time)
                        );
                      } else {
                        setSelectedTimeSlots((prev) => [...prev, slot.time]);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2 ${
                      isPast || !isAvailable
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                        : isSelected
                        ? "bg-green-500 border-green-600 text-white shadow-lg scale-105"
                        : "bg-white border-green-300 text-green-700 hover:bg-green-50 hover:shadow-md"
                    }`}
                  >
                    <Clock className="h-5 w-5" />
                    <div className="text-sm font-semibold">
                      {formatTime(slot.time)}
                    </div>
                    <div className="text-xs opacity-75">
                      {isPast ? "Past" : !isAvailable ? "Booked" : "Available"}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Status Legend & Cost Display */}
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full ring-2 ring-green-300"></div>
                  <span className="text-xs text-gray-600">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Booked/Past</span>
                </div>
              </div>
              {selectedTimeSlots.length > 0 && (
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-700">
                    {selectedTimeSlots.length} slot
                    {selectedTimeSlots.length > 1 ? "s" : ""} selected
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ₹{totalCost.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {selectedTimeSlots.length > 0 && selectedCourt !== null && (
          <div className="bg-white rounded-2xl shadow-md border p-6 mb-8">
            <h3 className="text-lg font-bold text-green-700 mb-4">
              Booking Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sport</p>
                  <p className="font-semibold text-green-700">{game.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time Slots</p>
                  <p className="font-semibold text-green-700 text-sm">
                    {selectedTimeSlots.length > 2
                      ? `${selectedTimeSlots.length} slots selected`
                      : selectedTimeSlots
                          .map((time) => formatTime(time))
                          .join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Court</p>
                  <p className="font-semibold text-green-700">
                    Court {selectedCourt + 1}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-600">₹</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Cost</p>
                  <p className="font-bold text-green-700 text-lg">
                    ₹{totalCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Time Slots Details */}
            {selectedTimeSlots.length > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm font-semibold text-green-700 mb-2">
                  Selected Time Slots:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTimeSlots.sort().map((time) => (
                    <span
                      key={time}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {formatTime(time)}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-sm text-green-600">
                  <span className="font-medium">Price per slot:</span> ₹
                  {pricePerSlot.toLocaleString()} × {selectedTimeSlots.length} =
                  ₹{totalCost.toLocaleString()}
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 text-lg"
            >
              Confirm Booking - ₹{totalCost.toLocaleString()}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TimeSlotBooking;
