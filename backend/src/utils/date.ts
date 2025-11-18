import {
  differenceInDays,
  differenceInHours,
  addDays,
  addHours,
  isAfter,
  isBefore,
  isEqual,
  format,
  parseISO,
} from 'date-fns';

/**
 * Calculate number of nights between two dates
 */
export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  return differenceInDays(checkOut, checkIn);
};

/**
 * Calculate hours until check-in
 */
export const hoursUntilCheckIn = (checkInDate: Date): number => {
  return differenceInHours(checkInDate, new Date());
};

/**
 * Add days to a date
 */
export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

/**
 * Add hours to a date
 */
export const addHoursToDate = (date: Date, hours: number): Date => {
  return addHours(date, hours);
};

/**
 * Check if date1 is after date2
 */
export const isDateAfter = (date1: Date, date2: Date): boolean => {
  return isAfter(date1, date2);
};

/**
 * Check if date1 is before date2
 */
export const isDateBefore = (date1: Date, date2: Date): boolean => {
  return isBefore(date1, date2);
};

/**
 * Check if dates are equal
 */
export const areDatesEqual = (date1: Date, date2: Date): boolean => {
  return isEqual(date1, date2);
};

/**
 * Format date to string
 */
export const formatDate = (date: Date, formatString: string = 'yyyy-MM-dd'): string => {
  return format(date, formatString);
};

/**
 * Format date to Brazilian format
 */
export const formatDateBR = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};

/**
 * Format datetime to Brazilian format
 */
export const formatDateTimeBR = (date: Date): string => {
  return format(date, "dd/MM/yyyy 'às' HH:mm");
};

/**
 * Parse ISO string to Date
 */
export const parseISOToDate = (dateString: string): Date => {
  return parseISO(dateString);
};

/**
 * Check if date range overlaps with another range
 */
export const dateRangesOverlap = (
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean => {
  return (
    (isAfter(start1, start2) && isBefore(start1, end2)) ||
    (isAfter(end1, start2) && isBefore(end1, end2)) ||
    (isBefore(start1, start2) && isAfter(end1, end2)) ||
    isEqual(start1, start2) ||
    isEqual(end1, end2)
  );
};

/**
 * Check if date is in the past
 */
export const isDateInPast = (date: Date): boolean => {
  return isBefore(date, new Date());
};

/**
 * Check if date is in the future
 */
export const isDateInFuture = (date: Date): boolean => {
  return isAfter(date, new Date());
};
