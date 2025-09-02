import { TimeSlot } from '../types';

export const generateTimeSlots = (courtsCount: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Generate random availability for each court (70% chance of being available)
      const courtAvailability = Array.from({ length: courtsCount }, () => Math.random() > 0.3);
      
      slots.push({ time, courtAvailability });
    }
  }
  
  return slots;
};