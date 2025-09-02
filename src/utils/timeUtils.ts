export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = Math.floor(now.getMinutes() / 30) * 30;
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};