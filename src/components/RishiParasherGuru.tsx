import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, User, Sparkles, Heart, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { useToast } from "@/hooks/use-toast";
import { Json } from '@/integrations/supabase/types';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  cached?: boolean;
}

interface RishiParasherGuruProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const RishiParasherGuru: React.FC<RishiParasherGuruProps> = ({ kundaliData, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Create cache key for responses
  const getCacheKey = (query: string) => {
    if (!kundaliData?.birthData) return null;
    const { fullName, date } = kundaliData.birthData;
    return `rishi_response_${fullName}_${date}_${query}_${language}`;
  };

  // Enhanced fallback response with detailed astrological analysis
  const generateDetailedFallbackResponse = (query: string) => {
    const calculations = kundaliData?.enhancedCalculations;
    if (!calculations) {
      return language === 'hi'
        ? '🙏 पुत्र, पहले अपनी संपूर्ण कुंडली बनवाएं, तब मैं विस्तार से बता सकूंगा।'
        : '🙏 Dear child, first create your complete Kundali, then I can provide detailed guidance.';
    }

    const lagna = calculations.lagna;
    const planets = calculations.planets;
    const houses = calculations.houses;
    const yogas = calculations.yogas?.filter(y => y.isActive) || [];
    const dashas = calculations.dashas;
    const currentDasha = dashas?.find(d => d.isActive);

    const queryLower = query.toLowerCase();

    // Career related questions
    if (queryLower.includes('career') || queryLower.includes('job') || queryLower.includes('profession') || 
        queryLower.includes('करियर') || queryLower.includes('नौकरी') || queryLower.includes('व्यवसाय') ||
        queryLower.includes('work') || queryLower.includes('business')) {
      
      const tenthHouse = houses?.find(h => h.houseNumber === 10);
      const sunPosition = planets?.SU;
      const marsPosition = planets?.MA;
      const jupiterPosition = planets?.JU;
      
      if (language === 'hi') {
        return `🙏 पुत्र ${kundaliData.birthData?.fullName}, आपके करियर के बारे में महर्षि पराशर का आशीर्वाद:

🌟 **लग्न विश्लेषण**: ${lagna?.signName} लग्न आपको ${getLagnaCareerTrait(lagna?.signName, 'hi')} बनाता है।

🏛️ **दसम भाव**: ${tenthHouse?.rashiName || 'अज्ञात'} राशि में स्थित - ${getCareerHouseAnalysis(tenthHouse?.rashiName, 'hi')}

☀️ **सूर्य स्थिति**: ${sunPosition?.rashiName} राशि, ${sunPosition?.house}वें भाव में - ${getSunCareerInfluence(sunPosition, 'hi')}

🔥 **मंगल प्रभाव**: ${marsPosition?.rashiName} में - ${getMarsCareerInfluence(marsPosition, 'hi')}

🎯 **गुरु आशीर्वाद**: ${jupiterPosition?.rashiName} में - ${getJupiterCareerInfluence(jupiterPosition, 'hi')}

📈 **वर्तमान दशा**: ${currentDasha?.planet || 'अज्ञात'} दशा - ${getDashaCareerEffect(currentDasha?.planet, 'hi')}

🏆 **सक्रिय योग**: ${yogas.length} योग सक्रिय हैं जो ${getYogaCareerBenefit(yogas, 'hi')}

💡 **सुझाव**: ${getSpecificCareerAdvice(lagna?.signName, sunPosition, 'hi')}

🕉️ आपका भविष्य उज्ज्वल है। धैर्य और मेहनत से सफलता अवश्य मिलेगी।`;
      } else {
        return `🙏 Dear child ${kundaliData.birthData?.fullName}, Maharishi Parashar's blessings for your career:

🌟 **Ascendant Analysis**: ${lagna?.signName} ascendant makes you ${getLagnaCareerTrait(lagna?.signName, 'en')}.

🏛️ **10th House**: Located in ${tenthHouse?.rashiName || 'Unknown'} - ${getCareerHouseAnalysis(tenthHouse?.rashiName, 'en')}

☀️ **Sun Position**: In ${sunPosition?.rashiName}, ${sunPosition?.house}th house - ${getSunCareerInfluence(sunPosition, 'en')}

🔥 **Mars Influence**: In ${marsPosition?.rashiName} - ${getMarsCareerInfluence(marsPosition, 'en')}

🎯 **Jupiter's Blessing**: In ${jupiterPosition?.rashiName} - ${getJupiterCareerInfluence(jupiterPosition, 'en')}

📈 **Current Dasha**: ${currentDasha?.planet || 'Unknown'} period - ${getDashaCareerEffect(currentDasha?.planet, 'en')}

🏆 **Active Yogas**: ${yogas.length} yogas active providing ${getYogaCareerBenefit(yogas, 'en')}

💡 **Guidance**: ${getSpecificCareerAdvice(lagna?.signName, sunPosition, 'en')}

🕉️ Your future is bright. Success will come through patience and hard work.`;
      }
    }

    // Marriage related questions
    if (queryLower.includes('marriage') || queryLower.includes('wedding') || queryLower.includes('spouse') ||
        queryLower.includes('शादी') || queryLower.includes('विवाह') || queryLower.includes('पति') || 
        queryLower.includes('पत्नी') || queryLower.includes('partner') || queryLower.includes('love')) {
      
      const seventhHouse = houses?.find(h => h.houseNumber === 7);
      const venusPosition = planets?.VE;
      const moonPosition = planets?.MO;
      const marsPosition = planets?.MA;
      
      if (language === 'hi') {
        return `🙏 पुत्र ${kundaliData.birthData?.fullName}, विवाह योग के बारे में महर्षि का मार्गदर्शन:

💕 **सप्तम भाव विश्लेषण**: ${seventhHouse?.rashiName || 'अज्ञात'} राशि में - ${getMarriageHouseAnalysis(seventhHouse?.rashiName, 'hi')}

🌹 **शुक्र स्थिति**: ${venusPosition?.rashiName} राशि, ${venusPosition?.house}वें भाव में - ${getVenusMarriageInfluence(venusPosition, 'hi')}

🌙 **चंद्र प्रभाव**: ${moonPosition?.rashiName} में - ${getMoonMarriageInfluence(moonPosition, 'hi')}

🔥 **मंगल दोष**: ${getMangalDoshaAnalysis(marsPosition, 'hi')}

⏰ **विवाह समय**: ${getMarriageTiming(currentDasha, planets, 'hi')}

👫 **जीवनसाथी के गुण**: ${getSpouseQualities(seventhHouse, venusPosition, 'hi')}

🏠 **दाम्पत्य जीवन**: ${getMaritalLifePrediction(moonPosition, venusPosition, 'hi')}

🎭 **सक्रिय योग**: ${getMarriageYogas(yogas, 'hi')}

🕉️ धैर्य रखें। ईश्वर की कृपा से उत्तम जीवनसाथी मिलेगा।`;
      } else {
        return `🙏 Dear child ${kundaliData.birthData?.fullName}, Maharishi's guidance on marriage:

💕 **7th House Analysis**: In ${seventhHouse?.rashiName || 'Unknown'} - ${getMarriageHouseAnalysis(seventhHouse?.rashiName, 'en')}

🌹 **Venus Position**: In ${venusPosition?.rashiName}, ${venusPosition?.house}th house - ${getVenusMarriageInfluence(venusPosition, 'en')}

🌙 **Moon Influence**: In ${moonPosition?.rashiName} - ${getMoonMarriageInfluence(moonPosition, 'en')}

🔥 **Mangal Dosha**: ${getMangalDoshaAnalysis(marsPosition, 'en')}

⏰ **Marriage Timing**: ${getMarriageTiming(currentDasha, planets, 'en')}

👫 **Spouse Qualities**: ${getSpouseQualities(seventhHouse, venusPosition, 'en')}

🏠 **Marital Life**: ${getMaritalLifePrediction(moonPosition, venusPosition, 'en')}

🎭 **Active Yogas**: ${getMarriageYogas(yogas, 'en')}

🕉️ Be patient. God's grace will bring an excellent life partner.`;
      }
    }

    // Health related questions
    if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('disease') ||
        queryLower.includes('स्वास्थ्य') || queryLower.includes('बीमारी') || queryLower.includes('स्वस्थ')) {
      
      const sixthHouse = houses?.find(h => h.houseNumber === 6);
      const saturnPosition = planets?.SA;
      const moonPosition = planets?.MO;
      
      if (language === 'hi') {
        return `🙏 पुत्र ${kundaliData.birthData?.fullName}, स्वास्थ्य के बारे में महर्षि का आशीर्वाद:

🏥 **षष्ठ भाव**: ${sixthHouse?.rashiName || 'अज्ञात'} राशि में - ${getHealthHouseAnalysis(sixthHouse?.rashiName, 'hi')}

🪐 **शनि प्रभाव**: ${saturnPosition?.rashiName} राशि, ${saturnPosition?.house}वें भाव में - ${getSaturnHealthInfluence(saturnPosition, 'hi')}

🌙 **चंद्र स्वास्थ्य**: ${moonPosition?.rashiName} में - ${getMoonHealthInfluence(moonPosition, 'hi')}

⚡ **लग्न बल**: ${lagna?.signName} लग्न - ${getLagnaHealthTendency(lagna?.signName, 'hi')}

💊 **सावधानियां**: ${getHealthCautions(saturnPosition, moonPosition, 'hi')}

🌿 **उपचार सुझाव**: ${getHealthRemedies(lagna?.signName, moonPosition, 'hi')}

🧘 **योग आसन**: ${getRecommendedYogaPractices(lagna?.signName, 'hi')}

🕉️ नियमित दिनचर्या और सात्विक आहार से स्वास्थ्य बना रहेगा।`;
      } else {
        return `🙏 Dear child ${kundaliData.birthData?.fullName}, Maharishi's blessings for health:

🏥 **6th House**: In ${sixthHouse?.rashiName || 'Unknown'} - ${getHealthHouseAnalysis(sixthHouse?.rashiName, 'en')}

🪐 **Saturn Influence**: In ${saturnPosition?.rashiName}, ${saturnPosition?.house}th house - ${getSaturnHealthInfluence(saturnPosition, 'en')}

🌙 **Moon Health**: In ${moonPosition?.rashiName} - ${getMoonHealthInfluence(moonPosition, 'en')}

⚡ **Ascendant Strength**: ${lagna?.signName} ascendant - ${getLagnaHealthTendency(lagna?.signName, 'en')}

💊 **Precautions**: ${getHealthCautions(saturnPosition, moonPosition, 'en')}

🌿 **Treatment Suggestions**: ${getHealthRemedies(lagna?.signName, moonPosition, 'en')}

🧘 **Yoga Practices**: ${getRecommendedYogaPractices(lagna?.signName, 'en')}

🕉️ Regular routine and sattvic diet will maintain good health.`;
      }
    }

    // General life guidance
    if (language === 'hi') {
      return `🙏 मेरे पुत्र ${kundaliData.birthData?.fullName}, आपकी आत्मा के मार्गदर्शन के लिए:

🌟 **आत्मा पथ**: ${lagna?.signName} लग्न आपको ${getSpiritualPath(lagna?.signName, 'hi')} की ओर ले जाता है।

🌙 **मानसिक प्रकृति**: ${planets?.MO?.rashiName} में चंद्र - ${getMentalNature(planets?.MO, 'hi')}

🎯 **जीवन उद्देश्य**: ${getLifePurpose(lagna, planets?.SU, 'hi')}

📿 **वर्तमान कर्म**: ${currentDasha?.planet || 'अज्ञात'} दशा - ${getCurrentKarma(currentDasha?.planet, 'hi')}

✨ **सक्रिय योग**: ${yogas.length} योग आपको ${getOverallYogaBlessings(yogas, 'hi')} प्रदान करते हैं।

🕉️ **उपासना**: ${getRecommendedWorship(lagna?.signName, planets?.SU, 'hi')}

💎 **रत्न सुझाव**: ${getGemstoneRecommendation(lagna?.signName, planets, 'hi')}

🔱 धर्म पथ पर चलते रहें। आपका कल्याण होगा।`;
    } else {
      return `🙏 Dear child ${kundaliData.birthData?.fullName}, for your soul's guidance:

🌟 **Soul Path**: ${lagna?.signName} ascendant leads you toward ${getSpiritualPath(lagna?.signName, 'en')}.

🌙 **Mental Nature**: Moon in ${planets?.MO?.rashiName} - ${getMentalNature(planets?.MO, 'en')}

🎯 **Life Purpose**: ${getLifePurpose(lagna, planets?.SU, 'en')}

📿 **Current Karma**: ${currentDasha?.planet || 'Unknown'} period - ${getCurrentKarma(currentDasha?.planet, 'en')}

✨ **Active Yogas**: ${yogas.length} yogas provide you ${getOverallYogaBlessings(yogas, 'en')}.

🕉️ **Worship**: ${getRecommendedWorship(lagna?.signName, planets?.SU, 'en')}

💎 **Gemstone**: ${getGemstoneRecommendation(lagna?.signName, planets, 'en')}

🔱 Continue on the righteous path. Your welfare is assured.`;
    }
  };

  // Helper functions for detailed analysis
  const getLagnaCareerTrait = (sign: string | undefined, lang: string) => {
    if (!sign) return lang === 'hi' ? 'एक संतुलित व्यक्तित्व' : 'a balanced personality';
    
    const traits: Record<string, { hi: string; en: string }> = {
      'Aries': { hi: 'नेतृत्व क्षमता से भरपूर', en: 'a natural leader' },
      'Taurus': { hi: 'धैर्यवान और दृढ़ संकल्पित', en: 'patient and determined' },
      'Gemini': { hi: 'बुद्धिमान और संचार कुशल', en: 'intelligent and communicative' },
      'Cancer': { hi: 'भावनात्मक और देखभाल करने वाला', en: 'emotional and caring' },
      'Leo': { hi: 'रचनात्मक और प्रभावशाली', en: 'creative and influential' },
      'Virgo': { hi: 'विश्लेषणात्मक और पूर्णतावादी', en: 'analytical and perfectionist' },
      'Libra': { hi: 'न्यायप्रिय और संतुलित', en: 'justice-loving and balanced' },
      'Scorpio': { hi: 'गहन चिंतक और रहस्यमय', en: 'deep thinker and mysterious' },
      'Sagittarius': { hi: 'दार्शनिक और साहसी', en: 'philosophical and adventurous' },
      'Capricorn': { hi: 'अनुशासित और महत्वाकांक्षी', en: 'disciplined and ambitious' },
      'Aquarius': { hi: 'नवाचारी और मानवतावादी', en: 'innovative and humanitarian' },
      'Pisces': { hi: 'कलात्मक और सहानुभूतिशील', en: 'artistic and compassionate' }
    };
    
    return traits[sign]?.[lang] || (lang === 'hi' ? 'विशेष गुणों से युक्त' : 'endowed with special qualities');
  };

  const getCareerHouseAnalysis = (sign: string | undefined, lang: string) => {
    if (!sign) return lang === 'hi' ? 'करियर में संतुलन आवश्यक' : 'balance needed in career';
    
    const analysis: Record<string, { hi: string; en: string }> = {
      'Aries': { hi: 'नेतृत्व और प्रबंधन के क्षेत्र उत्तम', en: 'leadership and management fields excellent' },
      'Taurus': { hi: 'वित्त और कला क्षेत्र में सफलता', en: 'success in finance and arts' },
      'Gemini': { hi: 'संचार और मीडिया में चमक', en: 'shine in communication and media' },
      'Cancer': { hi: 'सेवा और स्वास्थ्य क्षेत्र अनुकूल', en: 'service and healthcare favorable' },
      'Leo': { hi: 'मनोरंजन और राजनीति में उन्नति', en: 'progress in entertainment and politics' },
      'Virgo': { hi: 'तकनीक और विश्लेषण कार्य श्रेष्ठ', en: 'technology and analytical work best' },
      'Libra': { hi: 'कानून और न्याय क्षेत्र उपयुक्त', en: 'law and justice field suitable' },
      'Scorpio': { hi: 'अनुसंधान और रहस्य कार्य में सिद्धि', en: 'mastery in research and mystery work' },
      'Sagittarius': { hi: 'शिक्षा और धर्म क्षेत्र में लाभ', en: 'benefit in education and religion' },
      'Capricorn': { hi: 'प्रशासन और व्यापार में वृद्धि', en: 'growth in administration and business' },
      'Aquarius': { hi: 'तकनीक और समाज सेवा में नाम', en: 'fame in technology and social service' },
      'Pisces': { hi: 'कला और आध्यात्म में सफलता', en: 'success in arts and spirituality' }
    };
    
    return analysis[sign]?.[lang] || (lang === 'hi' ? 'विविध क्षेत्रों में अवसर' : 'opportunities in various fields');
  };

  // Helper functions for enhanced analysis need to be added
  const getSunCareerInfluence = (sun: any, lang: string) => {
    if (!sun) return lang === 'hi' ? 'नेतृत्व क्षमता सामान्य' : 'leadership ability normal';
    
    const influences: Record<string, { hi: string; en: string }> = {
      'Aries': { hi: 'उद्यमी भावना प्रबल', en: 'strong entrepreneurial spirit' },
      'Leo': { hi: 'नेतृत्व में प्राकृतिक प्रतिभा', en: 'natural talent in leadership' },
      'Capricorn': { hi: 'प्रशासनिक कुशलता उत्कृष्ट', en: 'excellent administrative skills' }
    };
    
    return influences[sun.rashiName]?.[lang] || (lang === 'hi' ? 'व्यावसायिक कुशलता अच्छी' : 'good professional skills');
  };

  const getMarsCareerInfluence = (mars: any, lang: string) => {
    if (!mars) return lang === 'hi' ? 'ऊर्जा संतुलित' : 'energy balanced';
    
    const influences: Record<string, { hi: string }> = {
      'Aries': { hi: 'तकनीकी क्षेत्र में सफलता' },
      'Capricorn': { hi: 'अनुशासित कार्य पद्धति' },
      'Scorpio': { hi: 'गहन अनुसंधान क्षमता' }
    };
    
    return influences[mars.rashiName]?.[lang] || (lang === 'hi' ? 'कार्य में दृढ़ता' : 'firmness in work');
  };

  const getJupiterCareerInfluence = (jupiter: any, lang: string) => {
    if (!jupiter) return lang === 'hi' ? 'ज्ञान की खोज' : 'quest for knowledge';
    
    return lang === 'hi' ? 'शिक्षा और परामर्श में श्रेष्ठता' : 'excellence in education and counseling';
  };

  const getDashaCareerEffect = (planet: string | undefined, lang: string) => {
    if (!planet) return lang === 'hi' ? 'संतुलित प्रगति' : 'balanced progress';
    
    const effects: Record<string, { hi: string; en: string }> = {
      'SU': { hi: 'नेतृत्व के अवसर आएंगे', en: 'leadership opportunities will come' },
      'JU': { hi: 'ज्ञान आधारित सफलता मिलेगी', en: 'knowledge-based success will come' },
      'VE': { hi: 'कलात्मक कार्यों में लाभ', en: 'benefit in artistic works' }
    };
    
    return effects[planet]?.[lang] || (lang === 'hi' ? 'धीमी पर स्थिर प्रगति' : 'slow but steady progress');
  };

  const getYogaCareerBenefit = (yogas: any[], lang: string) => {
    if (yogas.length === 0) return lang === 'hi' ? 'मेहनत से सफलता मिलेगी' : 'success through hard work';
    
    return lang === 'hi' ? 'करियर में विशेष योग का लाभ' : 'special career yoga benefits';
  };

  const getSpecificCareerAdvice = (lagna: string | undefined, sun: any, lang: string) => {
    if (!lagna) return lang === 'hi' ? 'धैर्य और मेहनत करें' : 'have patience and work hard';
    
    const advice: Record<string, { hi: string; en: string }> = {
      'Aries': { hi: 'नेतृत्व भूमिका स्वीकार करें', en: 'accept leadership roles' },
      'Taurus': { hi: 'स्थिर व्यापार में सफलता', en: 'success in stable business' },
      'Gemini': { hi: 'संचार क्षेत्र में आगे बढ़ें', en: 'advance in communication field' }
    };
    
    return advice[lagna]?.[lang] || (lang === 'hi' ? 'अपनी रुचि के अनुसार कार्य करें' : 'work according to your interests');
  };

  // Marriage related helper functions
  const getMarriageHouseAnalysis = (sign: string | undefined, lang: string) => {
    if (!sign) return lang === 'hi' ? 'साधारण वैवाहिक जीवन' : 'normal married life';
    
    const analysis: Record<string, { hi: string; en: string }> = {
      'Venus': { hi: 'प्रेम विवाह की संभावना', en: 'possibility of love marriage' },
      'Jupiter': { hi: 'आदर्श जीवनसाथी मिलेगा', en: 'ideal life partner will be found' }
    };
    
    return analysis[sign]?.[lang] || (lang === 'hi' ? 'सुखी वैवाहिक जीवन' : 'happy married life');
  };

  const getVenusMarriageInfluence = (venus: any, lang: string) => {
    if (!venus) return lang === 'hi' ? 'प्रेम में संतुलन' : 'balance in love';
    
    return lang === 'hi' ? 'रोमांटिक और सुखी रिश्ता' : 'romantic and happy relationship';
  };

  const getMoonMarriageInfluence = (moon: any, lang: string) => {
    if (!moon) return lang === 'hi' ? 'भावनात्मक स्थिरता' : 'emotional stability';
    
    return lang === 'hi' ? 'मानसिक तालमेल उत्तम' : 'excellent mental compatibility';
  };

  const getMangalDoshaAnalysis = (mars: any, lang: string) => {
    if (!mars) return lang === 'hi' ? 'मंगल दोष नहीं' : 'no mangal dosha';
    
    if (mars.house === 1 || mars.house === 4 || mars.house === 7 || mars.house === 8 || mars.house === 12) {
      return lang === 'hi' ? 'हल्का मंगल दोष - उपाय करें' : 'mild mangal dosha - perform remedies';
    }
    
    return lang === 'hi' ? 'मंगल दोष नहीं' : 'no mangal dosha';
  };

  const getMarriageTiming = (dasha: any, planets: any, lang: string) => {
    if (!dasha) return lang === 'hi' ? '25-30 वर्ष की आयु उत्तम' : 'age 25-30 is best';
    
    return lang === 'hi' ? 'वर्तमान दशा में विवाह योग' : 'marriage yoga in current dasha';
  };

  const getSpouseQualities = (seventhHouse: any, venus: any, lang: string) => {
    return lang === 'hi' ? 'सुंदर, बुद्धिमान और संस्कारी जीवनसाथी' : 'beautiful, intelligent and cultured spouse';
  };

  const getMaritalLifePrediction = (moon: any, venus: any, lang: string) => {
    return lang === 'hi' ? 'प्रेम और समझदारी से भरा दाम्पत्य जीवन' : 'married life filled with love and understanding';
  };

  const getMarriageYogas = (yogas: any[], lang: string) => {
    return lang === 'hi' ? 'शुभ विवाह योग उपस्थित' : 'auspicious marriage yogas present';
  };

  // Health related helper functions
  const getHealthHouseAnalysis = (sign: string | undefined, lang: string) => {
    return lang === 'hi' ? 'सामान्यतः अच्छा स्वास्थ्य' : 'generally good health';
  };

  const getSaturnHealthInfluence = (saturn: any, lang: string) => {
    if (!saturn) return lang === 'hi' ? 'हड्डियों की देखभाल करें' : 'take care of bones';
    
    return lang === 'hi' ? 'जोड़ों और हड्डियों का ध्यान रखें' : 'take care of joints and bones';
  };

  const getMoonHealthInfluence = (moon: any, lang: string) => {
    if (!moon) return lang === 'hi' ? 'मानसिक स्वास्थ्य ठीक' : 'mental health fine';
    
    return lang === 'hi' ? 'पेट और मन दोनों का ध्यान रखें' : 'take care of both stomach and mind';
  };

  const getLagnaHealthTendency = (sign: string | undefined, lang: string) => {
    return lang === 'hi' ? 'मजबूत शारीरिक संरचना' : 'strong physical constitution';
  };

  const getHealthCautions = (saturn: any, moon: any, lang: string) => {
    return lang === 'hi' ? 'तनाव और अधिक काम से बचें' : 'avoid stress and overwork';
  };

  const getHealthRemedies = (lagna: string | undefined, moon: any, lang: string) => {
    return lang === 'hi' ? 'योग, प्राणायाम और संतुलित आहार' : 'yoga, pranayama and balanced diet';
  };

  const getRecommendedYogaPractices = (sign: string | undefined, lang: string) => {
    return lang === 'hi' ? 'सूर्य नमस्कार और ध्यान' : 'sun salutation and meditation';
  };

  // Spiritual guidance helper functions
  const getSpiritualPath = (sign: string | undefined, lang: string) => {
    return lang === 'hi' ? 'धर्म और अध्यात्म' : 'religion and spirituality';
  };

  const getMentalNature = (moon: any, lang: string) => {
    return lang === 'hi' ? 'शांत और विचारशील स्वभाव' : 'calm and thoughtful nature';
  };

  const getLifePurpose = (lagna: any, sun: any, lang: string) => {
    return lang === 'hi' ? 'समाज सेवा और आत्म विकास' : 'social service and self-development';
  };

  const getCurrentKarma = (planet: string | undefined, lang: string) => {
    return lang === 'hi' ? 'अच्छे कर्मों का फल मिलेगा' : 'fruits of good deeds will come';
  };

  const getOverallYogaBlessings = (yogas: any[], lang: string) => {
    return lang === 'hi' ? 'जीवन में सफलता और खुशी' : 'success and happiness in life';
  };

  const getRecommendedWorship = (lagna: string | undefined, sun: any, lang: string) => {
    return lang === 'hi' ? 'भगवान विष्णु और सूर्य देव की उपासना' : 'worship Lord Vishnu and Sun God';
  };

  const getGemstoneRecommendation = (lagna: string | undefined, planets: any, lang: string) => {
    return lang === 'hi' ? 'पुखराज या मोती धारण करें' : 'wear yellow sapphire or pearl';
  };

  // Check cached response
  const getCachedResponse = (query: string) => {
    const cacheKey = getCacheKey(query);
    if (!cacheKey) return null;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedData = JSON.parse(cached);
        const cacheTime = new Date(parsedData.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 6) { // Cache for 6 hours
          return parsedData.response;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.log('Cache read error:', error);
    }
    return null;
  };

  // Save response to cache
  const setCachedResponse = (query: string, response: string) => {
    const cacheKey = getCacheKey(query);
    if (!cacheKey) return;
    
    try {
      const cacheData = {
        response,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.log('Cache write error:', error);
    }
  };

  useEffect(() => {
    if (!kundaliData || !kundaliData.enhancedCalculations) {
      const fallbackMessage: Message = {
        id: '1',
        type: 'ai',
        content: language === 'hi' 
          ? '🙏 नमस्कार मेरे पुत्र! मैं महर्षि पराशर हूं। पहले अपनी कुंडली बनाएं, फिर मैं सहायता करूंगा। 🕉️'
          : '🙏 Hello dear child! I am Maharishi Parashar. Create your birth chart first, then I can help you. 🕉️',
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
      return;
    }

    const lagna = kundaliData.enhancedCalculations.lagna;
    const planets = kundaliData.enhancedCalculations.planets;
    const activeYogas = kundaliData.enhancedCalculations.yogas?.filter(y => y.isActive) || [];
    
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: language === 'hi' 
        ? `🙏 मेरे पुत्र ${kundaliData.birthData?.fullName || ''}, मैं महर्षि पराशर हूं।

🌟 आत्मा पथ: ${lagna?.signName || 'अज्ञात'} लग्न
🌙 चंद्र: ${planets?.MO?.rashiName || 'अज्ञात'} राशि
🎯 ${activeYogas.length} शुभ योग सक्रिय

अपनी कर्मिक यात्रा के बारे में पूछें! 💫`
        : `🙏 Dear child ${kundaliData.birthData?.fullName || ''}, I am Maharishi Parashar.

🌟 Soul Path: ${lagna?.signName || 'Unknown'} ascendant
🌙 Moon: ${planets?.MO?.rashiName || 'Unknown'}
🎯 ${activeYogas.length} beneficial yogas active

Ask about your karmic journey! 💫`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [kundaliData, language]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      if (!kundaliData) {
        throw new Error('No birth chart data available');
      }

      // Check cache first
      const cachedResponse = getCachedResponse(currentInput);
      if (cachedResponse) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: cachedResponse,
          timestamp: new Date(),
          cached: true
        };
        setMessages(prev => [...prev, aiMessage]);
        setRetryCount(0);
        return;
      }
      
      // Try AI with reduced timeout for faster fallback
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI timeout')), 5000)
      );
      
      const aiPromise = supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: currentInput,
          language,
          retryAttempt: retryCount
        }
      });

      const { data, error } = await Promise.race([aiPromise, timeoutPromise]) as any;

      if (error) {
        throw error;
      }

      if (!data || !data.analysis) {
        throw new Error('No response received');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setCachedResponse(currentInput, data.analysis);
      setRetryCount(0);

      // Store conversation with error handling
      try {
        await supabase.from('rishi_parasher_conversations').insert({
          user_question: currentInput,
          rishi_response: data.analysis,
          kundali_context: kundaliData as unknown as Json,
          session_id: `karmic_session_${Date.now()}`
        });
      } catch (insertError) {
        console.log('Conversation storage failed:', insertError);
      }

    } catch (error) {
      console.log('AI failed, using enhanced fallback:', error);
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
      
      // Use enhanced detailed fallback response
      const enhancedFallbackResponse = generateDetailedFallbackResponse(currentInput);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: enhancedFallbackResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setCachedResponse(currentInput, enhancedFallbackResponse);
      
      // Show user-friendly toast only on first retry
      if (retryCount === 0) {
        toast({
          title: language === 'hi' ? "महर्षि का आशीर्वाद" : "Maharishi's Blessing",
          description: language === 'hi' ? "वैदिक ज्ञान से विस्तृत मार्गदर्शन" : "Detailed guidance from Vedic wisdom",
          variant: "default"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages(messages.slice(0, 1)); // Keep welcome message
    setRetryCount(0);
    toast({
      title: language === 'hi' ? "चैट साफ़" : "Chat Cleared",
      description: language === 'hi' ? "नई शुरुआत के लिए तैयार" : "Ready for fresh start"
    });
  };

  const suggestedQuestions = language === 'hi' ? [
    "करियर मार्गदर्शन?",
    "विवाह योग?",
    "स्वास्थ्य सुझाव?",
    "धन योग?"
  ] : [
    "Career guidance?",
    "Marriage yoga?",
    "Health advice?",
    "Wealth yoga?"
  ];

  return (
    <Card className="h-[450px] flex flex-col bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 border-purple-200">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-100 via-orange-100 to-red-100 px-3 py-2">
        <CardTitle className="flex items-center justify-between text-purple-800 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
                alt="Rishi Parasher" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-purple-600" />
              {language === 'hi' ? "महर्षि पराशर" : "Rishi Parashar"}
              <Sparkles className="h-3 w-3 text-orange-500" />
            </span>
          </div>
          <Button
            onClick={clearChat}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-200"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {suggestedQuestions.map((question, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-purple-200 text-xs border-purple-300 text-purple-700 hover:text-purple-900 bg-purple-50 px-1 py-0.5"
              onClick={() => setInputValue(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
        {retryCount > 0 && (
          <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            {language === 'hi' ? `वैदिक ज्ञान मोड ${retryCount}/3` : `Vedic wisdom mode ${retryCount}/3`}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-2 max-h-[300px]" ref={scrollAreaRef}>
          <div className="space-y-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 text-white overflow-hidden'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <img 
                        src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
                        alt="Rishi Parasher" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className={`p-2 rounded-lg shadow-sm relative ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 text-white'
                  }`}>
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                      {message.timestamp.toLocaleTimeString()}
                      {message.cached && <span title={language === 'hi' ? 'कैश्ड' : 'Cached'}>💾</span>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 text-white overflow-hidden">
                    <img 
                      src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
                      alt="Rishi Parasher" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 text-white">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-2 border-t border-purple-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'hi' ? "प्रश्न पूछें..." : "Ask question..."}
              disabled={isLoading}
              className="flex-1 bg-white border-purple-300 text-gray-900 placeholder-gray-500 text-xs h-8"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-purple-500 via-orange-500 to-red-600 hover:from-purple-600 hover:via-orange-600 hover:to-red-700 h-8 w-8 p-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RishiParasherGuru;
