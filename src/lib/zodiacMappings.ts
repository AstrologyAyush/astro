
export const zodiacSignsHindi = {
  1: { name: 'मेष', english: 'Aries' },
  2: { name: 'वृषभ', english: 'Taurus' },
  3: { name: 'मिथुन', english: 'Gemini' },
  4: { name: 'कर्क', english: 'Cancer' },
  5: { name: 'सिंह', english: 'Leo' },
  6: { name: 'कन्या', english: 'Virgo' },
  7: { name: 'तुला', english: 'Libra' },
  8: { name: 'वृश्चिक', english: 'Scorpio' },
  9: { name: 'धनु', english: 'Sagittarius' },
  10: { name: 'मकर', english: 'Capricorn' },
  11: { name: 'कुम्भ', english: 'Aquarius' },
  12: { name: 'मीन', english: 'Pisces' }
};

export const nakshatrasHindi = {
  1: { name: 'अश्विनी', english: 'Ashwini' },
  2: { name: 'भरणी', english: 'Bharani' },
  3: { name: 'कृत्तिका', english: 'Krittika' },
  4: { name: 'रोहिणी', english: 'Rohini' },
  5: { name: 'मृगशिरा', english: 'Mrigashira' },
  6: { name: 'आर्द्रा', english: 'Ardra' },
  7: { name: 'पुनर्वसु', english: 'Punarvasu' },
  8: { name: 'पुष्य', english: 'Pushya' },
  9: { name: 'आश्लेषा', english: 'Ashlesha' },
  10: { name: 'मघा', english: 'Magha' },
  11: { name: 'पूर्वा फाल्गुनी', english: 'Purva Phalguni' },
  12: { name: 'उत्तरा फाल्गुनी', english: 'Uttara Phalguni' },
  13: { name: 'हस्त', english: 'Hasta' },
  14: { name: 'चित्रा', english: 'Chitra' },
  15: { name: 'स्वाति', english: 'Swati' },
  16: { name: 'विशाखा', english: 'Vishakha' },
  17: { name: 'अनुराधा', english: 'Anuradha' },
  18: { name: 'ज्येष्ठा', english: 'Jyeshtha' },
  19: { name: 'मूल', english: 'Mula' },
  20: { name: 'पूर्वाषाढ़', english: 'Purva Ashadha' },
  21: { name: 'उत्तराषाढ़', english: 'Uttara Ashadha' },
  22: { name: 'श्रवण', english: 'Shravana' },
  23: { name: 'धनिष्ठा', english: 'Dhanishta' },
  24: { name: 'शतभिषा', english: 'Shatabhisha' },
  25: { name: 'पूर्वभाद्रपद', english: 'Purva Bhadrapada' },
  26: { name: 'उत्तरभाद्रपद', english: 'Uttara Bhadrapada' },
  27: { name: 'रेवती', english: 'Revati' }
};

export const planetsHindi = {
  SU: { name: 'सूर्य', english: 'Sun' },
  MO: { name: 'चंद्र', english: 'Moon' },
  MA: { name: 'मंगल', english: 'Mars' },
  ME: { name: 'बुध', english: 'Mercury' },
  JU: { name: 'गुरु', english: 'Jupiter' },
  VE: { name: 'शुक्र', english: 'Venus' },
  SA: { name: 'शनि', english: 'Saturn' },
  RA: { name: 'राहु', english: 'Rahu' },
  KE: { name: 'केतु', english: 'Ketu' }
};

export const housesHindi = {
  1: { name: 'प्रथम भाव', english: '1st House - Self', description: 'व्यक्तित्व और स्वरूप' },
  2: { name: 'द्वितीय भाव', english: '2nd House - Wealth', description: 'धन और परिवार' },
  3: { name: 'तृतीय भाव', english: '3rd House - Siblings', description: 'भाई-बहन और साहस' },
  4: { name: 'चतुर्थ भाव', english: '4th House - Mother', description: 'माता और सुख' },
  5: { name: 'पंचम भाव', english: '5th House - Children', description: 'संतान और विद्या' },
  6: { name: 'षष्ठ भाव', english: '6th House - Enemies', description: 'शत्रु और रोग' },
  7: { name: 'सप्तम भाव', english: '7th House - Marriage', description: 'विवाह और साझेदारी' },
  8: { name: 'अष्टम भाव', english: '8th House - Death', description: 'आयु और रहस्य' },
  9: { name: 'नवम भाव', english: '9th House - Father', description: 'पिता और भाग्य' },
  10: { name: 'दशम भाव', english: '10th House - Career', description: 'कर्म और यश' },
  11: { name: 'एकादश भाव', english: '11th House - Gains', description: 'लाभ और मित्र' },
  12: { name: 'द्वादश भाव', english: '12th House - Loss', description: 'हानि और मोक्ष' }
};

// Helper function to get localized zodiac sign
export const getZodiacSign = (signNumber: number, language: 'hi' | 'en' = 'en') => {
  const sign = zodiacSignsHindi[signNumber as keyof typeof zodiacSignsHindi];
  return language === 'hi' ? sign?.name : sign?.english;
};

// Helper function to get localized nakshatra
export const getNakshatra = (nakshatraNumber: number, language: 'hi' | 'en' = 'en') => {
  const nakshatra = nakshatrasHindi[nakshatraNumber as keyof typeof nakshatrasHindi];
  return language === 'hi' ? nakshatra?.name : nakshatra?.english;
};

// Helper function to get localized planet name
export const getPlanetName = (planetCode: string, language: 'hi' | 'en' = 'en') => {
  const planet = planetsHindi[planetCode as keyof typeof planetsHindi];
  return language === 'hi' ? planet?.name : planet?.english;
};

// Helper function to get localized house name
export const getHouseName = (houseNumber: number, language: 'hi' | 'en' = 'en') => {
  const house = housesHindi[houseNumber as keyof typeof housesHindi];
  return language === 'hi' ? house?.name : house?.english;
};

// Comprehensive translation functions for Kundali terms
export const kundaliTranslations = {
  basic: {
    kundali: { hi: 'कुंडली', en: 'Kundali' },
    birthChart: { hi: 'जन्म कुंडली', en: 'Birth Chart' },
    horoscope: { hi: 'राशिफल', en: 'Horoscope' },
    astrology: { hi: 'ज्योतिष', en: 'Astrology' },
    vedic: { hi: 'वैदिक', en: 'Vedic' },
    prediction: { hi: 'भविष्यवाणी', en: 'Prediction' },
    analysis: { hi: 'विश्लेषण', en: 'Analysis' }
  },
  positions: {
    ascendant: { hi: 'लग्न', en: 'Ascendant' },
    descendant: { hi: 'अस्त', en: 'Descendant' },
    midheaven: { hi: 'मध्य आकाश', en: 'Midheaven' },
    moonSign: { hi: 'चंद्र राशि', en: 'Moon Sign' },
    sunSign: { hi: 'सूर्य राशि', en: 'Sun Sign' },
    nakshatra: { hi: 'नक्षत्र', en: 'Nakshatra' },
    pada: { hi: 'पाद', en: 'Pada' },
    degree: { hi: 'अंश', en: 'Degree' },
    minute: { hi: 'कला', en: 'Minute' }
  },
  dashas: {
    mahadasha: { hi: 'महादशा', en: 'Mahadasha' },
    antardasha: { hi: 'अंतर्दशा', en: 'Antardasha' },
    pratyantardasha: { hi: 'प्रत्यंतर्दशा', en: 'Pratyantardasha' },
    vimshottari: { hi: 'विम्शोत्तरी', en: 'Vimshottari' },
    current: { hi: 'वर्तमान', en: 'Current' },
    upcoming: { hi: 'आगामी', en: 'Upcoming' },
    period: { hi: 'काल', en: 'Period' },
    years: { hi: 'वर्ष', en: 'Years' },
    months: { hi: 'माह', en: 'Months' },
    days: { hi: 'दिन', en: 'Days' }
  },
  yogas: {
    yoga: { hi: 'योग', en: 'Yoga' },
    rajayoga: { hi: 'राजयोग', en: 'Rajayoga' },
    dhanyoga: { hi: 'धनयोग', en: 'Dhanyoga' },
    mangaldosha: { hi: 'मंगल दोष', en: 'Mangal Dosha' },
    kalasarpadosha: { hi: 'कालसर्प दोष', en: 'Kalasarpa Dosha' },
    kemadrumaYoga: { hi: 'केमद्रुम योग', en: 'Kemadruma Yoga' },
    gajakesariYoga: { hi: 'गजकेसरी योग', en: 'Gajakesari Yoga' }
  },
  remedies: {
    remedy: { hi: 'उपाय', en: 'Remedy' },
    gemstone: { hi: 'रत्न', en: 'Gemstone' },
    mantra: { hi: 'मंत्र', en: 'Mantra' },
    donation: { hi: 'दान', en: 'Donation' },
    fasting: { hi: 'व्रत', en: 'Fasting' },
    worship: { hi: 'पूजा', en: 'Worship' },
    yantra: { hi: 'यंत्र', en: 'Yantra' }
  }
};

// Get translation helper
export const getKundaliTranslation = (category: keyof typeof kundaliTranslations, key: string, language: 'hi' | 'en' = 'en') => {
  const translations = kundaliTranslations[category] as any;
  const translation = translations?.[key];
  return translation?.[language] || key;
};
