import React, { useState } from "react";
import Homepage from "./components/Homepage";
import GameSelection from "./components/GameSelection";
import TimeSlotBooking from "./components/TimeSlotBooking";
import BookingConfirmation from "./components/BookingConfirmation";
import { games } from "./data/mockData";
import { BookingStep, BookingState } from "./types";

function App() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("home");
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedGame: null,
    selectedTimeSlots: [],
    selectedCourt: null,
    totalCost: 0,
  });

  const handleBookSlot = () => {
    setCurrentStep("games");
  };

  const handleGameSelect = (game: any) => {
    setBookingState((prev) => ({ ...prev, selectedGame: game }));
    setCurrentStep("slots");
  };

  const handleBackToHome = () => {
    setCurrentStep("home");
    setBookingState({
      selectedGame: null,
      selectedTimeSlots: [],
      selectedCourt: null,
      totalCost: 0,
    });
  };

  const handleBackToGames = () => {
    setCurrentStep("games");
    setBookingState((prev) => ({
      ...prev,
      selectedTimeSlots: [],
      selectedCourt: null,
      totalCost: 0,
    }));
  };

  const handleBookingConfirm = (
    timeSlots: string[],
    court: number,
    totalCost: number
  ) => {
    setBookingState((prev) => ({
      ...prev,
      selectedTimeSlots: timeSlots,
      selectedCourt: court,
      totalCost: totalCost,
    }));
    setCurrentStep("confirmation");
  };

  const handleNewBooking = () => {
    setCurrentStep("games");
    setBookingState({
      selectedGame: null,
      selectedTimeSlots: [],
      selectedCourt: null,
      totalCost: 0,
    });
  };

  switch (currentStep) {
    case "home":
      return <Homepage onBookSlot={handleBookSlot} />;

    case "games":
      return (
        <GameSelection
          games={games}
          onGameSelect={handleGameSelect}
          onBack={handleBackToHome}
        />
      );

    case "slots":
      return bookingState.selectedGame ? (
        <TimeSlotBooking
          game={bookingState.selectedGame}
          onBack={handleBackToGames}
          onBookingConfirm={handleBookingConfirm}
        />
      ) : null;

    case "confirmation":
      return bookingState.selectedGame &&
        bookingState.selectedTimeSlots.length > 0 &&
        bookingState.selectedCourt !== null ? (
        <BookingConfirmation
          game={bookingState.selectedGame}
          timeSlots={bookingState.selectedTimeSlots}
          court={bookingState.selectedCourt}
          totalCost={bookingState.totalCost}
          onNewBooking={handleNewBooking}
        />
      ) : null;

    default:
      return <Homepage onBookSlot={handleBookSlot} />;
  }
}

export default App;
