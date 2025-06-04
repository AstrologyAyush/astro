
import { BirthData, generateKundaliChart, KundaliChart } from './kundaliUtils';

export interface EnhancedBirthData extends BirthData {
  name: string;
}

export interface KundaliData {
  birthData: EnhancedBirthData;
  chart: KundaliChart;
  personalityProfile?: any;
  strengthestPlanet: string;
  currentDasha: string;
  lagnaLord: string;
  moonSign: string;
  sunSign: string;
}

// Enhanced planet strength calculation
function calculatePlanetStrengths(chart: KundaliChart): { [key: string]: number } {
  const strengths: { [key: string]: number } = {};
  
  Object.entries(chart.planets).forEach(([planetName, planet]) => {
    let strength = 0;
    
    // Sign strength (own sign = 5, exaltation = 6, debilitation = 1)
    const signStrengthMap: { [key: number]: number } = {
      1: 3, 2: 3, 3: 4, 4: 3, 5: 5, 6: 2,
      7: 4, 8: 2, 9: 4, 10: 3, 11: 4, 12: 3
    };
    
    strength += signStrengthMap[planet.sign] || 3;
    
    // House strength (Kendra houses = stronger)
    const houseNumber = planet.house;
    if ([1, 4, 7, 10].includes(houseNumber)) {
      strength += 3; // Kendra
    } else if ([5, 9].includes(houseNumber)) {
      strength += 2; // Trikona
    } else if ([3, 6, 11].includes(houseNumber)) {
      strength += 1; // Upachaya
    }
    
    // Retrograde consideration
    if (planet.retrograde) {
      strength += 1; // Retrograde planets are considered stronger
    }
    
    strengths[planetName] = strength;
  });
  
  return strengths;
}

function findStrongestPlanet(chart: KundaliChart): string {
  const strengths = calculatePlanetStrengths(chart);
  return Object.entries(strengths).reduce((a, b) => strengths[a[0]] > strengths[b[0]] ? a : b)[0];
}

function getCurrentDasha(birthData: EnhancedBirthData): string {
  // Simplified Vimshottari Dasha calculation
  const moonLongitude = 102.23; // This should come from actual moon calculation
  const nakshatra = Math.floor(moonLongitude / (360/27));
  
  const dashaLords = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter',
    'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
    'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus',
    'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];
  
  return dashaLords[nakshatra] || 'Jupiter';
}

function getLagnaLord(chart: KundaliChart): string {
  const ascendantSign = chart.ascendantSign;
  const signLords: { [key: number]: string } = {
    1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
    7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
  };
  return signLords[ascendantSign] || 'Jupiter';
}

function getSignName(signNumber: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[signNumber - 1] || 'Unknown';
}

export function generateDetailedKundali(birthData: EnhancedBirthData): KundaliData {
  console.log('Generating Kundali with coordinates:', {
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    date: birthData.dateOfBirth,
    time: birthData.timeOfBirth
  });
  
  // Generate the chart using the enhanced birth data with proper coordinates
  const chart = generateKundaliChart(birthData);
  
  // Calculate additional insights
  const strengthestPlanet = findStrongestPlanet(chart);
  const currentDasha = getCurrentDasha(birthData);
  const lagnaLord = getLagnaLord(chart);
  
  // Find Moon and Sun signs
  const moonPlanet = chart.planets['Moon'];
  const sunPlanet = chart.planets['Sun'];
  
  const moonSign = getSignName(moonPlanet?.sign || 1);
  const sunSign = getSignName(sunPlanet?.sign || 1);
  
  return {
    birthData,
    chart,
    strengthestPlanet,
    currentDasha,
    lagnaLord,
    moonSign,
    sunSign
  };
}
