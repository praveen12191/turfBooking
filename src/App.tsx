import React, { useState } from 'react';
import Homepage from './components/Homepage';
import GameSelection from './components/GameSelection';
import TimeSlotBooking from './components/TimeSlotBooking';
import BookingConfirmation from './components/BookingConfirmation';
import { games } from './data/mockData';
import { BookingStep, BookingState } from './types';

function App() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('home');
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedGame: null,
    selectedTimeSlot: null,
    selectedCourt: null
  });

  const handleBookSlot = () => {
    setCurrentStep('games');
  };

  const handleGameSelect = (game: any) => {
    setBookingState(prev => ({ ...prev, selectedGame: game }));
    setCurrentStep('slots');
  };

  const handleBackToHome = () => {
    setCurrentStep('home');
    setBookingState({
      selectedGame: null,
      selectedTimeSlot: null,
      selectedCourt: null
    });
  };

  const handleBackToGames = () => {
    setCurrentStep('games');
    setBookingState(prev => ({
      ...prev,
      selectedTimeSlot: null,
      selectedCourt: null
    }));
  };

  const handleBookingConfirm = (timeSlot: string, court: number) => {
    setBookingState(prev => ({
      ...prev,
      selectedTimeSlot: timeSlot,
      selectedCourt: court
    }));
    setCurrentStep('confirmation');
  };

  const handleNewBooking = () => {
    setCurrentStep('games');
    setBookingState({
      selectedGame: null,
      selectedTimeSlot: null,
      selectedCourt: null
    });
  };

  switch (currentStep) {
    case 'home':
      return <Homepage onBookSlot={handleBookSlot} />;
    
    case 'games':
      return (
        <GameSelection
          games={games}
          onGameSelect={handleGameSelect}
          onBack={handleBackToHome}
        />
      );
    
    case 'slots':
      return bookingState.selectedGame ? (
        <TimeSlotBooking
          game={bookingState.selectedGame}
          onBack={handleBackToGames}
          onBookingConfirm={handleBookingConfirm}
        />
      ) : null;
    
    case 'confirmation':
      return (
        bookingState.selectedGame && 
        bookingState.selectedTimeSlot && 
        bookingState.selectedCourt !== null
      ) ? (
        <BookingConfirmation
          game={bookingState.selectedGame}
          timeSlot={bookingState.selectedTimeSlot}
          court={bookingState.selectedCourt}
          onNewBooking={handleNewBooking}
        />
      ) : null;
    
    default:
      return <Homepage onBookSlot={handleBookSlot} />;
  }
}

export default App;