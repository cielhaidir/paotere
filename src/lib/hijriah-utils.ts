/**
 * Hijriah (Islamic Calendar) Utility Functions
 * 
 * This module provides utilities for converting Gregorian dates to Hijriah dates
 * and generating Hijriah-based invoice numbers.
 */

/**
 * Represents a Hijriah date
 */
export interface HijriahDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Converts a Gregorian date to Hijriah date using the Kuwaiti algorithm
 * 
 * This is a simplified algorithm for educational purposes. For production use,
 * consider using a library like 'hijri-date' or 'moment-hijri' for better accuracy.
 * 
 * @param gregorianDate - The Gregorian date to convert
 * @returns The corresponding Hijriah date
 * 
 * @example
 * ```typescript
 * const hijriDate = gregorianToHijriah(new Date('2026-01-13'));
 * console.log(hijriDate); // { year: 1448, month: 7, day: 13 }
 * ```
 */
export function gregorianToHijriah(gregorianDate: Date): HijriahDate {
  // Julian Day Number calculation
  const year = gregorianDate.getFullYear();
  const month = gregorianDate.getMonth() + 1; // JavaScript months are 0-indexed
  const day = gregorianDate.getDate();

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
                  Math.floor(y / 4) - Math.floor(y / 100) + 
                  Math.floor(y / 400) - 32045;

  // Convert Julian Day to Hijri
  // This uses the civil (arithmetic) Hijri calendar
  a = julianDay - 1948440 + 10632;
  const b = Math.floor((a - 1) / 10631);
  a = a - 10631 * b + 354;
  const j = (Math.floor((10985 - a) / 5316)) * (Math.floor((50 * a) / 17719)) + 
            (Math.floor(a / 5670)) * (Math.floor((43 * a) / 15238));
  a = a - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - 
      (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  
  const hijriMonth = Math.floor((24 * a) / 709);
  const hijriDay = a - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * b + j - 30;

  return {
    year: hijriYear,
    month: hijriMonth,
    day: hijriDay,
  };
}

/**
 * Formats a Hijriah date as a string
 * 
 * @param hijriDate - The Hijriah date to format
 * @param format - The format string (YYYY for full year, YY for 2-digit year, MM for month, DD for day)
 * @returns The formatted date string
 * 
 * @example
 * ```typescript
 * const hijriDate = { year: 1448, month: 7, day: 13 };
 * console.log(formatHijriahDate(hijriDate, 'YYYY-MM-DD')); // "1448-07-13"
 * console.log(formatHijriahDate(hijriDate, 'YY-MM')); // "48-07"
 * ```
 */
export function formatHijriahDate(
  hijriDate: HijriahDate,
  format: string = 'YYYY-MM-DD'
): string {
  return format
    .replace('YYYY', hijriDate.year.toString())
    .replace('YY', (hijriDate.year % 100).toString().padStart(2, '0'))
    .replace('MM', hijriDate.month.toString().padStart(2, '0'))
    .replace('DD', hijriDate.day.toString().padStart(2, '0'));
}

/**
 * Gets the current Hijriah date
 * 
 * @returns The current Hijriah date
 * 
 * @example
 * ```typescript
 * const today = getCurrentHijriahDate();
 * console.log(today); // { year: 1448, month: 7, day: 13 }
 * ```
 */
export function getCurrentHijriahDate(): HijriahDate {
  return gregorianToHijriah(new Date());
}

/**
 * Interface for invoice objects with nomor (number) field
 */
export interface InvoiceWithNumber {
  nomor: string;
}

/**
 * Generates a Hijriah-based invoice number
 * 
 * Format: INV-YY-MM-xxxx
 * - YY: 2-digit Hijriah year (e.g., 1448 → 48)
 * - MM: 2-digit Hijriah month (01-12)
 * - xxxx: 4-digit sequential number that resets each month
 * 
 * @param existingInvoices - Array of existing invoices with nomor field
 * @param referenceDate - Optional reference date (defaults to current date)
 * @returns The generated invoice number
 * 
 * @example
 * ```typescript
 * const invoices = [
 *   { nomor: 'INV-48-07-0001' },
 *   { nomor: 'INV-48-07-0002' },
 *   { nomor: 'INV-48-06-0010' }, // Different month, won't affect count
 * ];
 * 
 * const newNumber = generateHijriahInvoiceNumber(invoices);
 * console.log(newNumber); // "INV-48-07-0003"
 * ```
 */
export function generateHijriahInvoiceNumber(
  existingInvoices: InvoiceWithNumber[],
  referenceDate?: Date
): string {
  // Get current Hijriah date
  const hijriDate = referenceDate 
    ? gregorianToHijriah(referenceDate)
    : getCurrentHijriahDate();

  // Format year and month
  const yearStr = (hijriDate.year % 100).toString().padStart(2, '0');
  const monthStr = hijriDate.month.toString().padStart(2, '0');
  const prefix = `INV-${yearStr}-${monthStr}`;

  // Filter invoices from current Hijriah year-month
  const currentMonthInvoices = existingInvoices.filter((invoice) => {
    return invoice.nomor.startsWith(prefix);
  });

  // Extract sequence numbers and find the maximum
  const sequenceNumbers = currentMonthInvoices.map((invoice) => {
    const parts = invoice.nomor.split('-');
    if (parts.length === 4 && parts[3]) {
      const seqNum = parseInt(parts[3], 10);
      return isNaN(seqNum) ? 0 : seqNum;
    }
    return 0;
  });

  // Get next sequence number
  const maxSequence = sequenceNumbers.length > 0 
    ? Math.max(...sequenceNumbers) 
    : 0;
  const nextSequence = maxSequence + 1;

  // Format with leading zeros (4 digits)
  const sequenceStr = nextSequence.toString().padStart(4, '0');

  return `${prefix}-${sequenceStr}`;
}

/**
 * Parses a Hijriah invoice number to extract its components
 * 
 * @param invoiceNumber - The invoice number to parse
 * @returns An object with the parsed components, or null if invalid format
 * 
 * @example
 * ```typescript
 * const parsed = parseHijriahInvoiceNumber('INV-48-07-0001');
 * console.log(parsed);
 * // {
 * //   prefix: 'INV',
 * //   year: 48,
 * //   month: 7,
 * //   sequence: 1,
 * //   fullYear: 1448
 * // }
 * ```
 */
export function parseHijriahInvoiceNumber(invoiceNumber: string): {
  prefix: string;
  year: number;
  month: number;
  sequence: number;
  fullYear: number;
} | null {
  const pattern = /^INV-(\d{2})-(\d{2})-(\d{4})$/;
  const match = invoiceNumber.match(pattern);

  if (!match || !match[1] || !match[2] || !match[3]) {
    return null;
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const sequence = parseInt(match[3], 10);

  // Assume current century (1400s)
  const fullYear = 1400 + year;

  return {
    prefix: 'INV',
    year,
    month,
    sequence,
    fullYear,
  };
}

/**
 * Gets the Hijriah month name in Arabic
 * 
 * @param month - The month number (1-12)
 * @param locale - The locale for month names ('ar' for Arabic, 'en' for English transliteration)
 * @returns The month name
 * 
 * @example
 * ```typescript
 * console.log(getHijriahMonthName(7, 'en')); // "Rajab"
 * console.log(getHijriahMonthName(7, 'ar')); // "رجب"
 * ```
 */
export function getHijriahMonthName(
  month: number,
  locale: 'en' | 'ar' = 'en'
): string {
  const monthNamesEn = [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];

  const monthNamesAr = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const monthNames = locale === 'ar' ? monthNamesAr : monthNamesEn;

  if (month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12');
  }

  const monthName = monthNames[month - 1];
  if (!monthName) {
    throw new Error('Invalid month');
  }

  return monthName;
}