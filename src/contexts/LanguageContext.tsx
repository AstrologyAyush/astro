
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App Navigation
    'home': 'Home',
    'kundali': 'Kundali',
    'profile': 'Profile',
    'login': 'Login',
    'personality_test': 'Personality Test',
    'daily_horoscope': 'Daily Horoscope',
    'numerology': 'Numerology',
    
    // Common
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'continue': 'Continue',
    'back': 'Back',
    'next': 'Next',
    'finish': 'Finish',
    
    // Personality Test
    'personality_test_title': 'Vedic Personality Analysis',
    'personality_test_subtitle': 'Discover your cosmic personality based on ancient Vedic wisdom',
    'start_test': 'Start Personality Test',
    'question': 'Question',
    'strongly_disagree': 'Strongly Disagree',
    'disagree': 'Disagree',
    'neutral': 'Neutral',
    'agree': 'Agree',
    'strongly_agree': 'Strongly Agree',
    
    // Daily Horoscope
    'daily_horoscope_title': 'Daily Vedic Horoscope',
    'daily_horoscope_subtitle': 'Get your daily guidance from Rishi Parasher wisdom',
    'select_sign': 'Select Your Zodiac Sign',
    'todays_energy': 'Today\'s Energy',
    'general_guidance': 'General Guidance',
    'career_finance': 'Career & Finance',
    'love_relationships': 'Love & Relationships',
    'health_wellness': 'Health & Wellness',
    'lucky_numbers': 'Lucky Numbers',
    'lucky_colors': 'Lucky Colors',
    'auspicious_time': 'Auspicious Time',
    'ask_rishi_parasher': 'Ask Rishi Parasher',
    'type_question': 'Type your question here...',
    'ask_question': 'Ask Question',
    
    // Theme
    'dark_mode': 'Dark Mode',
    'light_mode': 'Light Mode',
    'toggle_theme': 'Toggle Theme',
    
    // Zodiac Signs
    'aries': 'Aries',
    'taurus': 'Taurus',
    'gemini': 'Gemini',
    'cancer': 'Cancer',
    'leo': 'Leo',
    'virgo': 'Virgo',
    'libra': 'Libra',
    'scorpio': 'Scorpio',
    'sagittarius': 'Sagittarius',
    'capricorn': 'Capricorn',
    'aquarius': 'Aquarius',
    'pisces': 'Pisces'
  },
  hi: {
    // App Navigation
    'home': 'होम',
    'kundali': 'कुंडली',
    'profile': 'प्रोफ़ाइल',
    'login': 'लॉगिन',
    'personality_test': 'व्यक्तित्व परीक्षण',
    'daily_horoscope': 'दैनिक राशिफल',
    'numerology': 'न्यूमेरोलॉजी',
    
    // Common
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'success': 'सफलता',
    'submit': 'जमा करें',
    'cancel': 'रद्द करें',
    'continue': 'जारी रखें',
    'back': 'वापस',
    'next': 'अगला',
    'finish': 'समाप्त',
    
    // Personality Test
    'personality_test_title': 'वैदिक व्यक्तित्व विश्लेषण',
    'personality_test_subtitle': 'प्राचीन वैदिक ज्ञान के आधार पर अपने व्यक्तित्व की खोज करें',
    'start_test': 'व्यक्तित्व परीक्षण शुरू करें',
    'question': 'प्रश्न',
    'strongly_disagree': 'पूर्णतः असहमत',
    'disagree': 'असहमत',
    'neutral': 'तटस्थ',
    'agree': 'सहमत',
    'strongly_agree': 'पूर्णतः सहमत',
    
    // Daily Horoscope
    'daily_horoscope_title': 'दैनिक वैदिक राशिफल',
    'daily_horoscope_subtitle': 'ऋषि पराशर की बुद्धि से दैनिक मार्गदर्शन प्राप्त करें',
    'select_sign': 'अपनी राशि चुनें',
    'todays_energy': 'आज की ऊर्जा',
    'general_guidance': 'सामान्य मार्गदर्शन',
    'career_finance': 'करियर और धन',
    'love_relationships': 'प्रेम और रिश्ते',
    'health_wellness': 'स्वास्थ्य और कल्याण',
    'lucky_numbers': 'भाग्यशाली अंक',
    'lucky_colors': 'भाग्यशाली रंग',
    'auspicious_time': 'शुभ समय',
    'ask_rishi_parasher': 'ऋषि पराशर से पूछें',
    'type_question': 'यहाँ अपना प्रश्न लिखें...',
    'ask_question': 'प्रश्न पूछें',
    
    // Theme
    'dark_mode': 'डार्क मोड',
    'light_mode': 'लाइट मोड',
    'toggle_theme': 'थीम बदलें',
    
    // Zodiac Signs
    'aries': 'मेष',
    'taurus': 'वृष',
    'gemini': 'मिथुन',
    'cancer': 'कर्क',
    'leo': 'सिंह',
    'virgo': 'कन्या',
    'libra': 'तुला',
    'scorpio': 'वृश्चिक',
    'sagittarius': 'धनु',
    'capricorn': 'मकर',
    'aquarius': 'कुम्भ',
    'pisces': 'मीन'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'hi';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
