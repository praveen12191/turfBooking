import { Game, TimeSlot } from '../types';

export const games: Game[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=400',
    courts: 1
  },
  {
    id: 'badminton',
    name: 'Badminton',
    image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=400',
    courts: 2
  },
  {
    id: 'football',
    name: 'Football',
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=400',
    courts: 1
  },
  {
    id: 'tennis',
    name: 'Tennis',
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
    courts: 2
  },
  {
    id: 'basketball',
    name: 'Basketball',
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
    courts: 1
  }
];

// Generate mock availability data
export const generateTimeSlots = (courtsCount: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const courtAvailability = Array.from({ length: courtsCount }, () => Math.random() > 0.3);
      slots.push({ time, courtAvailability });
    }
  }
  
  return slots;
};