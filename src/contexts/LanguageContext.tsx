
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
    
    // Kundali Specific
    'birth_chart': 'Birth Chart',
    'kundali_chart': 'Kundali Chart',
    'planetary_positions': 'Planetary Positions',
    'house_analysis': 'House Analysis',
    'dasha_periods': 'Dasha Periods',
    'yogas_doshas': 'Yogas & Doshas',
    'predictions': 'Predictions',
    'kundali_remedies': 'Remedies',
    'detailed_analysis': 'Detailed Analysis',
    'comprehensive_report': 'Comprehensive Report',
    'vedic_calculations': 'Vedic Calculations',
    'swiss_ephemeris': 'Swiss Ephemeris',
    'traditional_methods': 'Traditional Methods',
    
    // Planets
    'sun': 'Sun',
    'moon': 'Moon',
    'mars': 'Mars',
    'mercury': 'Mercury',
    'jupiter': 'Jupiter',
    'venus': 'Venus',
    'saturn': 'Saturn',
    'rahu': 'Rahu',
    'ketu': 'Ketu',
    
    // Houses
    'first_house': '1st House - Self',
    'second_house': '2nd House - Wealth',
    'third_house': '3rd House - Siblings',
    'fourth_house': '4th House - Mother',
    'fifth_house': '5th House - Children',
    'sixth_house': '6th House - Enemies',
    'seventh_house': '7th House - Marriage',
    'eighth_house': '8th House - Longevity',
    'ninth_house': '9th House - Fortune',
    'tenth_house': '10th House - Career',
    'eleventh_house': '11th House - Gains',
    'twelfth_house': '12th House - Losses',
    
    // Numerology Calculator
    'advanced_numerology_calculator': 'Advanced Numerology Calculator',
    'full_name': 'Full Name',
    'birth_date': 'Birth Date',
    'enter_full_name': 'Enter your full name',
    'generate_detailed_analysis': 'Generate Detailed Numerology Analysis',
    'insights': 'Insights',
    'core': 'Core',
    'personality': 'Personality',
    'karmic': 'Karmic',
    'remedies': 'Remedies',
    'compatibility': 'Compatibility',
    'personal_guidance_insights': 'Personal Guidance & Insights',
    'core_numbers': 'Core Numbers',
    'life_path': 'Life Path',
    'life_purpose': 'Your life purpose',
    'expression': 'Expression',
    'natural_talents': 'Natural talents',
    'soul_urge': 'Soul Urge',
    'inner_motivation': 'Inner motivation',
    'outer_image': 'Outer image',
    'birthday': 'Birthday',
    'special_gift': 'Special gift',
    'maturity': 'Maturity',
    'later_life_focus': 'Later life focus',
    'pinnacle_numbers': 'Pinnacle Numbers (Life Phases)',
    'challenge_numbers': 'Challenge Numbers',
    'personal_year_2025': 'Personal Year 2025',
    'phase': 'Phase',
    'challenge': 'Challenge',
    'personality_archetype': 'Personality Archetype',
    'life_theme': 'Life Theme',
    'strengths': 'Strengths',
    'shadow_aspects': 'Shadow Aspects',
    'ideal_careers': 'Ideal Careers',
    'relationship_style': 'Relationship Style',
    'karmic_analysis': 'Karmic Analysis',
    'karmic_debt_present': 'Karmic Debt Present',
    'debt_number': 'Debt Number',
    'no_major_karmic_debt': 'No Major Karmic Debt',
    'clear_karmic_slate': 'You have a clear karmic slate',
    'missing_numbers': 'Missing Numbers',
    'missing_numbers_description': 'These numbers are missing from your name, indicating areas of weakness',
    'personalized_remedies': 'Personalized Remedies',
    'number': 'Number',
    'deficiency': 'Deficiency',
    'mantra': 'Mantra',
    'gemstone': 'Gemstone',
    'color': 'Color',
    'no_specific_remedies': 'No specific remedies needed',
    'well_balanced_structure': 'Your number structure is well balanced',
    
    // Numerology Insights
    'main_purpose': 'Your Main Purpose',
    'your_strengths': 'Your Strengths',
    'challenges_to_overcome': 'Challenges to Overcome',
    'career_money_guidance': 'Career & Money Guidance',
    'ideal_career_path': 'Ideal Career Path',
    'money_advice': 'Money Advice',
    'love_relationships': 'Love & Relationships',
    'your_love_style': 'Your Love Style',
    'best_match': 'Best Match',
    'relationship_advice': 'Relationship Advice',
    '2025_guidance': '2025 Guidance',
    'important_months': 'Important Months',
    'march_june_september': 'March, June, September - Key opportunities',
    'daily_life_guidance': 'Daily Life Guidance',
    'lucky_days': 'Lucky Days',
    'make_important_decisions': 'Make important decisions on these days',
    'lucky_colors': 'Lucky Colors',
    'use_these_colors': 'Use these colors in your daily life',
    
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
    'health_wellness': 'Health & Wellness',
    'lucky_numbers': 'Lucky Numbers',
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
    
    // Kundali Specific
    'birth_chart': 'जन्म कुंडली',
    'kundali_chart': 'कुंडली चार्ट',
    'planetary_positions': 'ग्रहों की स्थिति',
    'house_analysis': 'भाव विश्लेषण',
    'dasha_periods': 'दशा काल',
    'yogas_doshas': 'योग और दोष',
    'predictions': 'भविष्यवाणी',
    'kundali_remedies': 'उपाय',
    'detailed_analysis': 'विस्तृत विश्लेषण',
    'comprehensive_report': 'संपूर्ण रिपोर्ट',
    'vedic_calculations': 'वैदिक गणना',
    'swiss_ephemeris': 'स्विस एफेमेरिस',
    'traditional_methods': 'पारंपरिक पद्धति',
    
    // Planets
    'sun': 'सूर्य',
    'moon': 'चंद्र',
    'mars': 'मंगल',
    'mercury': 'बुध',
    'jupiter': 'गुरु',
    'venus': 'शुक्र',
    'saturn': 'शनि',
    'rahu': 'राहु',
    'ketu': 'केतु',
    
    // Houses
    'first_house': 'प्रथम भाव - व्यक्तित्व',
    'second_house': 'द्वितीय भाव - धन',
    'third_house': 'तृतीय भाव - भाई-बहन',
    'fourth_house': 'चतुर्थ भाव - माता',
    'fifth_house': 'पंचम भाव - संतान',
    'sixth_house': 'षष्ठ भाव - शत्रु',
    'seventh_house': 'सप्तम भाव - विवाह',
    'eighth_house': 'अष्टम भाव - आयु',
    'ninth_house': 'नवम भाव - भाग्य',
    'tenth_house': 'दशम भाव - कर्म',
    'eleventh_house': 'एकादश भाव - लाभ',
    'twelfth_house': 'द्वादश भाव - हानि',
    
    // Numerology Calculator
    'advanced_numerology_calculator': 'उन्नत न्यूमेरोलॉजी कैलकुलेटर',
    'full_name': 'पूरा नाम',
    'birth_date': 'जन्म तिथि',
    'enter_full_name': 'अपना पूरा नाम दर्ज करें',
    'generate_detailed_analysis': 'विस्तृत न्यूमेरोलॉजी विश्लेषण करें',
    'insights': 'अंतर्दृष्टि',
    'core': 'मुख्य',
    'personality': 'व्यक्तित्व',
    'karmic': 'कर्मिक',
    'remedies': 'उपाय',
    'compatibility': 'संगतता',
    'personal_guidance_insights': 'व्यक्तिगत मार्गदर्शन और अंतर्दृष्टि',
    'core_numbers': 'मुख्य संख्याएं',
    'life_path': 'जीवन पथ',
    'life_purpose': 'आपका जीवन उद्देश्य',
    'expression': 'अभिव्यक्ति',
    'natural_talents': 'प्राकृतिक प्रतिभा',
    'soul_urge': 'आत्मा की इच्छा',
    'inner_motivation': 'अंतर प्रेरणा',
    'outer_image': 'बाहरी छवि',
    'birthday': 'जन्मदिन',
    'special_gift': 'विशेष उपहार',
    'maturity': 'परिपक्वता',
    'later_life_focus': 'जीवन का दूसरा भाग',
    'pinnacle_numbers': 'शिखर संख्याएं (जीवन चरण)',
    'challenge_numbers': 'चुनौती संख्याएं',
    'personal_year_2025': 'व्यक्तिगत वर्ष 2025',
    'phase': 'चरण',
    'challenge': 'चुनौती',
    'personality_archetype': 'व्यक्तित्व प्रकार',
    'life_theme': 'जीवन विषय',
    'strengths': 'शक्तियां',
    'shadow_aspects': 'छाया पक्ष',
    'ideal_careers': 'आदर्श करियर',
    'relationship_style': 'रिश्ते में स्टाइल',
    'karmic_analysis': 'कर्मिक विश्लेषण',
    'karmic_debt_present': 'कर्मिक ऋण मौजूद',
    'debt_number': 'ऋण संख्या',
    'no_major_karmic_debt': 'कोई मुख्य कर्मिक ऋण नहीं',
    'clear_karmic_slate': 'आपके पास साफ कर्मिक स्लेट है',
    'missing_numbers': 'गुम संख्याएं',
    'missing_numbers_description': 'आपके नाम में ये संख्याएं गायब हैं, जो कमजोर क्षेत्रों को दर्शाती हैं',
    'personalized_remedies': 'व्यक्तिगत उपाय',
    'number': 'संख्या',
    'deficiency': 'की कमी',
    'mantra': 'मंत्र',
    'gemstone': 'रत्न',
    'color': 'रंग',
    'no_specific_remedies': 'कोई विशेष उपाय की आवश्यकता नहीं',
    'well_balanced_structure': 'आपकी संख्या संरचना संतुलित है',
    
    // Numerology Insights
    'main_purpose': 'आपका मुख्य उद्देश्य',
    'your_strengths': 'आपकी शक्तियां',
    'challenges_to_overcome': 'चुनौतियां',
    'career_money_guidance': 'करियर और पैसा मार्गदर्शन',
    'ideal_career_path': 'आदर्श करियर पथ',
    'money_advice': 'धन संबंधी सलाह',
    'love_relationships': 'प्रेम और रिश्ते',
    'your_love_style': 'आपकी प्रेम शैली',
    'best_match': 'सबसे अच्छा मैच',
    'relationship_advice': 'रिश्ते में सलाह',
    '2025_guidance': '2025 का मार्गदर्शन',
    'important_months': 'महत्वपूर्ण महीने',
    'march_june_september': 'मार्च, जून, सितंबर - महत्वपूर्ण अवसर',
    'daily_life_guidance': 'दैनिक जीवन मार्गदर्शन',
    'lucky_days': 'भाग्यशाली दिन',
    'make_important_decisions': 'इन दिनों महत्वपूर्ण निर्णय लें',
    'lucky_colors': 'भाग्यशाली रंग',
    'use_these_colors': 'इन रंगों का प्रयोग करें',
    
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
    'health_wellness': 'स्वास्थ्य और कल्याण',
    'lucky_numbers': 'भाग्यशाली अंक',
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
