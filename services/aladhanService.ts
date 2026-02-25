export interface HijriDate {
  day: string;
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

const BASE_URL = 'https://api.aladhan.com/v1';

export interface AladhanData {
  hijri: HijriDate;
  timings: Record<string, string>;
}

export const getHijriDateFromApi = async (
  dateStr: string, 
  latitude: number, 
  longitude: number, 
  method: number = 1, 
  adjustment: number = 0
): Promise<AladhanData> => {
  try {
    // Format dateStr (YYYY-MM-DD) to DD-MM-YYYY for Aladhan API
    const [year, month, day] = dateStr.split('-');
    const formattedDate = `${day}-${month}-${year}`;
    
    // Use /timings endpoint as recommended for location-aware Hijri dates
    const url = `${BASE_URL}/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=${method}&adjustment=${adjustment}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (json && json.code === 200) {
      return {
        hijri: json.data.date.hijri,
        timings: json.data.timings
      };
    }
    
    throw new Error('Failed to fetch Hijri date');
  } catch (error) {
    console.error('Error fetching Hijri date:', error);
    throw error;
  }
};
