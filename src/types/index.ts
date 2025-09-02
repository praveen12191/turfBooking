export interface Game {
  id: string;
  name: string;
  image: string;
  courts: number;
}

export interface TimeSlot {
  time: string;
  courtAvailability: boolean[];
}

export interface BookingState {
  selectedGame: Game | null;
  selectedTimeSlot: string | null;
  selectedCourt: number | null;
}

export type BookingStep = 'home' | 'games' | 'slots' | 'confirmation';