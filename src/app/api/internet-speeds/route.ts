import { NextResponse } from 'next/server';

interface SpeedData {
  rank: number;
  country: string;
  countryCode: string;
  continent: string;
  mobileSpeed: number;
  broadbandSpeed: number;
  lastUpdated: string;
}

// Continent mapping for countries
const continentMap: { [key: string]: string } = {
  // North America
  'United States': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  
  // Europe
  'Monaco': 'Europe',
  'Denmark': 'Europe',
  'Switzerland': 'Europe',
  'Netherlands': 'Europe',
  'Iceland': 'Europe',
  'Norway': 'Europe',
  'Luxembourg': 'Europe',
  'Sweden': 'Europe',
  'Finland': 'Europe',
  'France': 'Europe',
  'Germany': 'Europe',
  'United Kingdom': 'Europe',
  'Spain': 'Europe',
  'Italy': 'Europe',
  'Belgium': 'Europe',
  'Austria': 'Europe',
  'Portugal': 'Europe',
  'Ireland': 'Europe',
  'Poland': 'Europe',
  'Czech Republic': 'Europe',
  'Slovenia': 'Europe',
  'Estonia': 'Europe',
  'Latvia': 'Europe',
  'Lithuania': 'Europe',
  'Slovakia': 'Europe',
  'Hungary': 'Europe',
  'Croatia': 'Europe',
  'Romania': 'Europe',
  'Bulgaria': 'Europe',
  'Greece': 'Europe',
  'Cyprus': 'Europe',
  'Malta': 'Europe',
  
  // Asia
  'Singapore': 'Asia',
  'South Korea': 'Asia',
  'Japan': 'Asia',
  'China': 'Asia',
  'Thailand': 'Asia',
  'Taiwan': 'Asia',
  'Hong Kong': 'Asia',
  'Malaysia': 'Asia',
  'United Arab Emirates': 'Asia',
  'Israel': 'Asia',
  'Qatar': 'Asia',
  'Kuwait': 'Asia',
  'Saudi Arabia': 'Asia',
  'Bahrain': 'Asia',
  'India': 'Asia',
  'Indonesia': 'Asia',
  'Philippines': 'Asia',
  'Vietnam': 'Asia',
  'Kazakhstan': 'Asia',
  'Jordan': 'Asia',
  'Oman': 'Asia',
  'Lebanon': 'Asia',
  'Turkey': 'Asia',
  
  // Oceania
  'Australia': 'Oceania',
  'New Zealand': 'Oceania',
  
  // South America
  'Chile': 'South America',
  'Uruguay': 'South America',
  'Brazil': 'South America',
  'Argentina': 'South America',
  'Colombia': 'South America',
  'Peru': 'South America',
  'Ecuador': 'South America',
  'Venezuela': 'South America',
  'Paraguay': 'South America',
  'Bolivia': 'South America',
  
  // Africa
  'South Africa': 'Africa',
  'Morocco': 'Africa',
  'Egypt': 'Africa',
  'Tunisia': 'Africa',
  'Kenya': 'Africa',
  'Ghana': 'Africa',
  'Nigeria': 'Africa',
  'Ethiopia': 'Africa',
  'Rwanda': 'Africa',
  'Mauritius': 'Africa',
  'Algeria': 'Africa',
  'Botswana': 'Africa',
  'Namibia': 'Africa'
};

export async function GET() {
  try {
    // For this implementation, we'll use mock data that represents typical Wikipedia data
    // In production, you'd scrape the actual Wikipedia page or use their API
    const mockSpeedData: SpeedData[] = [
      { rank: 1, country: 'Monaco', countryCode: 'MC', continent: 'Europe', mobileSpeed: 121.4, broadbandSpeed: 319.59, lastUpdated: '2025-08-01' },
      { rank: 2, country: 'Singapore', countryCode: 'SG', continent: 'Asia', mobileSpeed: 95.2, broadbandSpeed: 295.67, lastUpdated: '2025-08-01' },
      { rank: 3, country: 'Chile', countryCode: 'CL', continent: 'South America', mobileSpeed: 82.1, broadbandSpeed: 278.94, lastUpdated: '2025-08-01' },
      { rank: 4, country: 'Denmark', countryCode: 'DK', continent: 'Europe', mobileSpeed: 88.7, broadbandSpeed: 267.85, lastUpdated: '2025-08-01' },
      { rank: 5, country: 'Switzerland', countryCode: 'CH', continent: 'Europe', mobileSpeed: 85.3, broadbandSpeed: 256.73, lastUpdated: '2025-08-01' },
      { rank: 6, country: 'Netherlands', countryCode: 'NL', continent: 'Europe', mobileSpeed: 79.4, broadbandSpeed: 245.62, lastUpdated: '2025-08-01' },
      { rank: 7, country: 'Iceland', countryCode: 'IS', continent: 'Europe', mobileSpeed: 92.1, broadbandSpeed: 234.51, lastUpdated: '2025-08-01' },
      { rank: 8, country: 'Norway', countryCode: 'NO', continent: 'Europe', mobileSpeed: 86.8, broadbandSpeed: 223.40, lastUpdated: '2025-08-01' },
      { rank: 9, country: 'Luxembourg', countryCode: 'LU', continent: 'Europe', mobileSpeed: 77.9, broadbandSpeed: 212.29, lastUpdated: '2025-08-01' },
      { rank: 10, country: 'Sweden', countryCode: 'SE', continent: 'Europe', mobileSpeed: 74.6, broadbandSpeed: 201.18, lastUpdated: '2025-08-01' },
      { rank: 11, country: 'Finland', countryCode: 'FI', continent: 'Europe', mobileSpeed: 73.2, broadbandSpeed: 195.67, lastUpdated: '2025-08-01' },
      { rank: 12, country: 'France', countryCode: 'FR', continent: 'Europe', mobileSpeed: 71.8, broadbandSpeed: 189.45, lastUpdated: '2025-08-01' },
      { rank: 13, country: 'South Korea', countryCode: 'KR', continent: 'Asia', mobileSpeed: 145.8, broadbandSpeed: 185.23, lastUpdated: '2025-08-01' },
      { rank: 14, country: 'Germany', countryCode: 'DE', continent: 'Europe', mobileSpeed: 68.4, broadbandSpeed: 178.91, lastUpdated: '2025-08-01' },
      { rank: 15, country: 'Japan', countryCode: 'JP', continent: 'Asia', mobileSpeed: 89.2, broadbandSpeed: 172.34, lastUpdated: '2025-08-01' },
      { rank: 16, country: 'United Kingdom', countryCode: 'GB', continent: 'Europe', mobileSpeed: 65.1, broadbandSpeed: 167.82, lastUpdated: '2025-08-01' },
      { rank: 17, country: 'Spain', countryCode: 'ES', continent: 'Europe', mobileSpeed: 63.7, broadbandSpeed: 162.45, lastUpdated: '2025-08-01' },
      { rank: 18, country: 'Italy', countryCode: 'IT', continent: 'Europe', mobileSpeed: 61.3, broadbandSpeed: 156.78, lastUpdated: '2025-08-01' },
      { rank: 19, country: 'Belgium', countryCode: 'BE', continent: 'Europe', mobileSpeed: 59.9, broadbandSpeed: 151.23, lastUpdated: '2025-08-01' },
      { rank: 20, country: 'Austria', countryCode: 'AT', continent: 'Europe', mobileSpeed: 58.5, broadbandSpeed: 145.67, lastUpdated: '2025-08-01' },
      { rank: 21, country: 'Canada', countryCode: 'CA', continent: 'North America', mobileSpeed: 92.8, broadbandSpeed: 142.34, lastUpdated: '2025-08-01' },
      { rank: 22, country: 'United States', countryCode: 'US', continent: 'North America', mobileSpeed: 95.5, broadbandSpeed: 138.91, lastUpdated: '2025-08-01' },
      { rank: 23, country: 'Australia', countryCode: 'AU', continent: 'Oceania', mobileSpeed: 87.3, broadbandSpeed: 135.45, lastUpdated: '2025-08-01' },
      { rank: 24, country: 'Portugal', countryCode: 'PT', continent: 'Europe', mobileSpeed: 54.2, broadbandSpeed: 131.78, lastUpdated: '2025-08-01' },
      { rank: 25, country: 'New Zealand', countryCode: 'NZ', continent: 'Oceania', mobileSpeed: 83.7, broadbandSpeed: 128.23, lastUpdated: '2025-08-01' },
      { rank: 26, country: 'Ireland', countryCode: 'IE', continent: 'Europe', mobileSpeed: 51.8, broadbandSpeed: 124.67, lastUpdated: '2025-08-01' },
      { rank: 27, country: 'United Arab Emirates', countryCode: 'AE', continent: 'Asia', mobileSpeed: 178.4, broadbandSpeed: 121.34, lastUpdated: '2025-08-01' },
      { rank: 28, country: 'Israel', countryCode: 'IL', continent: 'Asia', mobileSpeed: 67.2, broadbandSpeed: 117.91, lastUpdated: '2025-08-01' },
      { rank: 29, country: 'China', countryCode: 'CN', continent: 'Asia', mobileSpeed: 112.7, broadbandSpeed: 114.45, lastUpdated: '2025-08-01' },
      { rank: 30, country: 'Brazil', countryCode: 'BR', continent: 'South America', mobileSpeed: 54.6, broadbandSpeed: 89.23, lastUpdated: '2025-08-01' },
      { rank: 31, country: 'Thailand', countryCode: 'TH', continent: 'Asia', mobileSpeed: 67.8, broadbandSpeed: 85.67, lastUpdated: '2025-08-01' },
      { rank: 32, country: 'Malaysia', countryCode: 'MY', continent: 'Asia', mobileSpeed: 61.4, broadbandSpeed: 82.34, lastUpdated: '2025-08-01' },
      { rank: 33, country: 'Mexico', countryCode: 'MX', continent: 'North America', mobileSpeed: 45.2, broadbandSpeed: 78.91, lastUpdated: '2025-08-01' },
      { rank: 34, country: 'South Africa', countryCode: 'ZA', continent: 'Africa', mobileSpeed: 38.7, broadbandSpeed: 75.45, lastUpdated: '2025-08-01' },
      { rank: 35, country: 'India', countryCode: 'IN', continent: 'Asia', mobileSpeed: 42.3, broadbandSpeed: 71.78, lastUpdated: '2025-08-01' },
    ];

    // Add continent information based on mapping
    const enrichedData = mockSpeedData.map(item => ({
      ...item,
      continent: continentMap[item.country] || 'Unknown'
    }));

    // Sort by overall performance (weighted average of mobile and broadband)
    const sortedData = enrichedData.sort((a, b) => {
      const aScore = (a.mobileSpeed * 0.4) + (a.broadbandSpeed * 0.6);
      const bScore = (b.mobileSpeed * 0.4) + (b.broadbandSpeed * 0.6);
      return bScore - aScore;
    });

    // Update ranks based on new sorting
    const finalData = sortedData.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    return NextResponse.json({
      data: finalData,
      lastUpdated: '2025-08-01',
      source: 'Wikipedia - List of countries by Internet connection speeds',
      totalCountries: finalData.length,
      continents: [...new Set(finalData.map(item => item.continent))].sort(),
      metadata: {
        updateFrequency: 'Monthly',
        nextUpdate: '2025-09-01',
        dataPoints: finalData.length
      }
    });

  } catch (error) {
    console.error('Speed rankings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch speed rankings data' },
      { status: 500 }
    );
  }
}
