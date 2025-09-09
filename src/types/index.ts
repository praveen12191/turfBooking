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
  selectedTimeSlots: string[];
  selectedCourt: number | null;
  totalCost: number;
}

export type BookingStep = "home" | "games" | "slots" | "confirmation";
