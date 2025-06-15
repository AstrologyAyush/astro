
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

  // Enhanced fallback response with specific personal recommendations
  const generatePersonalizedResponse = (query: string) => {
    const calculations = kundaliData?.enhancedCalculations;
    if (!calculations) {
      return language === 'hi'
        ? '🙏 पुत्र, पहले अपनी संपूर्ण कुंडली बनवाएं, तब मैं व्यक्तिगत मार्गदर्शन दे सकूंगा।'
        : '🙏 Dear child, first create your complete Kundali, then I can provide personalized guidance.';
    }

    const birthData = kundaliData.birthData;
    const lagna = calculations.lagna;
    const planets = calculations.planets;
    const houses = calculations.houses;
    const yogas = calculations.yogas?.filter(y => y.isActive) || [];
    const dashas = calculations.dashas;
    const currentDasha = dashas?.find(d => d.isActive);

    // Get specific house data
    const getHouseData = (houseNum: number) => {
      return houses?.find(h => h.house === houseNum);
    };

    const queryLower = query.toLowerCase();

    // Career related questions - deeply personalized
    if (queryLower.includes('career') || queryLower.includes('job') || queryLower.includes('profession') || 
        queryLower.includes('करियर') || queryLower.includes('नौकरी') || queryLower.includes('व्यवसाय') ||
        queryLower.includes('work') || queryLower.includes('business')) {
      
      const tenthHouse = getHouseData(10);
      const secondHouse = getHouseData(2);
      const sunPosition = planets?.SU;
      const marsPosition = planets?.MA;
      const jupiterPosition = planets?.JU;
      const mercuryPosition = planets?.ME;
      
      // Specific career recommendations based on actual planetary positions
      let specificCareerField = '';
      let timing = '';
      let challenges = '';
      let remedies = '';
      
      if (sunPosition?.rashiName === 'Leo' || sunPosition?.rashiName === 'Aries') {
        specificCareerField = language === 'hi' ? 'नेतृत्व, प्रबंधन, सरकारी सेवा में बेहतरीन सफलता' : 'exceptional success in leadership, management, government service';
      } else if (mercuryPosition?.rashiName === 'Gemini' || mercuryPosition?.rashiName === 'Virgo') {
        specificCareerField = language === 'hi' ? 'संचार, लेखन, शिक्षा, आईटी क्षेत्र में विशेष प्रतिभा' : 'special talent in communication, writing, education, IT sector';
      } else if (jupiterPosition?.rashiName === 'Sagittarius' || jupiterPosition?.rashiName === 'Pisces') {
        specificCareerField = language === 'hi' ? 'शिक्षा, धर्म, न्याय, परामर्श में उत्कृष्टता' : 'excellence in education, religion, law, counseling';
      } else {
        specificCareerField = language === 'hi' ? 'आपकी ग्रह स्थिति अनुसार व्यापार और सेवा क्षेत्र उत्तम' : 'business and service sectors are excellent according to your planetary positions';
      }

      if (currentDasha?.planet === 'JU') {
        timing = language === 'hi' ? 'वर्तमान गुरु दशा में करियर में महत्वपूर्ण प्रगति' : 'significant career progress in current Jupiter period';
      } else if (currentDasha?.planet === 'SU') {
        timing = language === 'hi' ? 'सूर्य दशा में नेतृत्व की भूमिका मिलेगी' : 'leadership roles will come in Sun period';
      } else {
        timing = language === 'hi' ? 'अगले 6-18 महीनों में करियर में सकारात्मक बदलाव' : 'positive career changes in next 6-18 months';
      }

      if (language === 'hi') {
        return `🙏 प्रिय ${birthData?.fullName}, आपके करियर के लिए व्यक्तिगत मार्गदर्शन:

🌟 **आपकी विशेष प्रतिभा**: ${lagna?.signName} लग्न + ${sunPosition?.rashiName} में सूर्य = ${specificCareerField}

🎯 **तत्काल कार्य योजना**:
1. ${sunPosition?.house === 10 ? 'तुरंत नेतृत्व की भूमिका के लिए आवेदन करें' : 'अपने कौशल को निखारने पर ध्यान दें'}
2. ${mercuryPosition?.house === 1 || mercuryPosition?.house === 10 ? 'संचार और नेटवर्किंग बढ़ाएं' : 'तकनीकी ज्ञान में वृद्धि करें'}
3. ${jupiterPosition?.isExalted ? 'शिक्षा या प्रशिक्षण क्षेत्र में अवसर देखें' : 'धैर्य रखें और कड़ी मेहनत करें'}

⏰ **समय सीमा**: ${timing}

🚧 **मुख्य चुनौती**: ${marsPosition?.isDebilitated ? 'ऊर्जा और फोकस में कमी - नियमित व्यायाम करें' : 'प्रतिस्पर्धा में धैर्य रखें'}

💊 **तुरंत उपाय**:
- ${sunPosition?.rashiName === 'Leo' ? 'रविवार को सूर्य देव को जल चढ़ाएं' : 'मंगलवार को हनुमान चालीसा पढ़ें'}
- ${birthData?.date ? `आपकी जन्म तिथि ${birthData.date} के अनुसार दान करें` : 'नियमित दान-पुण्य करें'}
- लाल रंग का प्रयोग बढ़ाएं (कपड़े, रत्न)

💰 **आर्थिक स्थिति**: अगले ${currentDasha?.planet === 'VE' ? '3-6 महीनों' : '12-18 महीनों'} में धन में वृद्धि

🔮 **भविष्य की सफलता**: ${yogas.length > 2 ? 'आपके कई शुभ योग 2025-26 में फलेंगे' : '2026 के बाद स्थिर सफलता'}

आपका भविष्य उज्ज्वल है, ${birthData?.fullName}! 🌟`;
      } else {
        return `🙏 Dear ${birthData?.fullName}, personalized career guidance:

🌟 **Your Special Talent**: ${lagna?.signName} ascendant + Sun in ${sunPosition?.rashiName} = ${specificCareerField}

🎯 **Immediate Action Plan**:
1. ${sunPosition?.house === 10 ? 'Apply for leadership roles immediately' : 'Focus on skill enhancement'}
2. ${mercuryPosition?.house === 1 || mercuryPosition?.house === 10 ? 'Increase communication and networking' : 'Enhance technical knowledge'}
3. ${jupiterPosition?.isExalted ? 'Look for opportunities in education/training sector' : 'Be patient and work hard'}

⏰ **Timeline**: ${timing}

🚧 **Main Challenge**: ${marsPosition?.isDebilitated ? 'Lack of energy and focus - do regular exercise' : 'Be patient in competition'}

💊 **Immediate Remedies**:
- ${sunPosition?.rashiName === 'Leo' ? 'Offer water to Sun God on Sundays' : 'Recite Hanuman Chalisa on Tuesdays'}
- ${birthData?.date ? `Donate according to your birth date ${birthData.date}` : 'Do regular charity'}
- Increase use of red color (clothes, gemstones)

💰 **Financial Status**: Wealth increase in next ${currentDasha?.planet === 'VE' ? '3-6 months' : '12-18 months'}

🔮 **Future Success**: ${yogas.length > 2 ? 'Your beneficial yogas will fructify in 2025-26' : 'Stable success after 2026'}

Your future is bright, ${birthData?.fullName}! 🌟`;
      }
    }

    // Marriage related questions - deeply personalized  
    if (queryLower.includes('marriage') || queryLower.includes('wedding') || queryLower.includes('spouse') ||
        queryLower.includes('शादी') || queryLower.includes('विवाह') || queryLower.includes('पति') || 
        queryLower.includes('पत्नी') || queryLower.includes('partner') || queryLower.includes('love')) {
      
      const seventhHouse = getHouseData(7);
      const venusPosition = planets?.VE;
      const moonPosition = planets?.MO;
      const marsPosition = planets?.MA;
      
      // Check for Mangal Dosha specifically
      const isManglik = marsPosition && (marsPosition.house === 1 || marsPosition.house === 4 || 
                                        marsPosition.house === 7 || marsPosition.house === 8 || marsPosition.house === 12);
      
      // Specific timing based on current dasha
      let marriageTiming = '';
      if (currentDasha?.planet === 'VE') {
        marriageTiming = language === 'hi' ? 'वर्तमान शुक्र दशा में विवाह के बहुत प्रबल योग' : 'very strong marriage indications in current Venus period';
      } else if (currentDasha?.planet === 'JU') {
        marriageTiming = language === 'hi' ? 'गुरु दशा में आदर्श जीवनसाथी मिलने की संभावना' : 'possibility of finding ideal partner in Jupiter period';
      } else {
        marriageTiming = language === 'hi' ? 'अगले 12-24 महीनों में विवाह के संकेत' : 'marriage indications in next 12-24 months';
      }

      if (language === 'hi') {
        return `🙏 ${birthData?.fullName}, आपके विवाह के लिए विशेष मार्गदर्शन:

💕 **आपका प्रेम स्वभाव**: ${venusPosition?.rashiName} में शुक्र - ${venusPosition?.rashiName === 'Taurus' ? 'स्थिर और गहरा प्रेम' : venusPosition?.rashiName === 'Libra' ? 'संतुलित और सुंदर रिश्ता' : 'भावुक और समर्पित प्रेम'}

👫 **जीवनसाथी के गुण**:
- ${seventhHouse?.rashiName === 'Taurus' ? 'खूबसूरत, कलाप्रेमी और स्थिर स्वभाव' : seventhHouse?.rashiName === 'Gemini' ? 'बुद्धिमान, मिलनसार और हंसमुख' : 'सुंदर, सहयोगी और परवाह करने वाला'}
- ${moonPosition?.rashiName === 'Cancer' ? 'घर-परिवार से प्रेम करने वाला' : 'आपसे मानसिक तालमेल'}
- ${venusPosition?.house === 7 ? 'बहुत आकर्षक व्यक्तित्व' : 'अच्छा चरित्र'}

🔥 **मंगल दोष स्थिति**: ${isManglik ? 'हल्का मंगल दोष है - विशेष उपाय आवश्यक' : 'कोई मंगल दोष नहीं - शुभ संकेत'}

⏰ **विवाह का समय**: ${marriageTiming}

💐 **तत्काल उपाय**:
${isManglik ? '- मंगलवार को हनुमान मंदिर में तेल का दीपक जलाएं\n- लाल मसूर दाल का दान करें' : '- शुक्रवार को लक्ष्मी माता की पूजा करें\n- सफेद मिठाई का दान करें'}
- ${birthData?.fullName ? `${birthData.fullName} के नाम से गुलाब के फूल चढ़ाएं` : 'देवी मां को गुलाब चढ़ाएं'}

🌹 **प्रेम सफलता के लिए**:
- ${venusPosition?.rashiName === 'Pisces' ? 'गुलाबी रंग पहनें' : 'हल्के रंगों का प्रयोग करें'}
- शुक्रवार के दिन व्रत रखें
- ${moonPosition?.rashiName ? `${moonPosition.rashiName} राशि अनुकूल भोजन करें` : 'सात्विक भोजन करें'}

🏠 **वैवाहिक जीवन**: ${venusPosition?.isExalted ? 'बहुत सुखी और समृद्ध दाम्पत्य जीवन' : 'प्रेम और समझदारी से भरा जीवन'}

आपका प्रेम जीवन खुशियों से भरा होगा! 💖`;
      } else {
        return `🙏 ${birthData?.fullName}, special guidance for your marriage:

💕 **Your Love Nature**: Venus in ${venusPosition?.rashiName} - ${venusPosition?.rashiName === 'Taurus' ? 'stable and deep love' : venusPosition?.rashiName === 'Libra' ? 'balanced and beautiful relationship' : 'emotional and devoted love'}

👫 **Spouse Qualities**:
- ${seventhHouse?.rashiName === 'Taurus' ? 'Beautiful, artistic and stable nature' : seventhHouse?.rashiName === 'Gemini' ? 'Intelligent, sociable and cheerful' : 'Handsome, supportive and caring'}
- ${moonPosition?.rashiName === 'Cancer' ? 'Family-loving person' : 'Mental compatibility with you'}
- ${venusPosition?.house === 7 ? 'Very attractive personality' : 'Good character'}

🔥 **Mangal Dosha Status**: ${isManglik ? 'Mild Mangal Dosha present - special remedies needed' : 'No Mangal Dosha - auspicious sign'}

⏰ **Marriage Timing**: ${marriageTiming}

💐 **Immediate Remedies**:
${isManglik ? '- Light oil lamp at Hanuman temple on Tuesdays\n- Donate red lentils' : '- Worship Goddess Lakshmi on Fridays\n- Donate white sweets'}
- ${birthData?.fullName ? `Offer roses in the name of ${birthData.fullName}` : 'Offer roses to Divine Mother'}

🌹 **For Love Success**:
- ${venusPosition?.rashiName === 'Pisces' ? 'Wear pink colors' : 'Use light colors'}
- Fast on Fridays
- ${moonPosition?.rashiName ? `Eat foods favorable for ${moonPosition.rashiName} sign` : 'Eat sattvic food'}

🏠 **Married Life**: ${venusPosition?.isExalted ? 'Very happy and prosperous married life' : 'Life filled with love and understanding'}

Your love life will be filled with happiness! 💖`;
      }
    }

    // Health related questions - personalized
    if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('disease') ||
        queryLower.includes('स्वास्थ्य') || queryLower.includes('बीमारी') || queryLower.includes('स्वस्थ')) {
      
      const sixthHouse = getHouseData(6);
      const saturnPosition = planets?.SA;
      const moonPosition = planets?.MO;
      
      // Specific health predictions based on actual positions
      let healthTendency = '';
      let specificCautions = '';
      let personalizedRemedies = '';
      
      if (saturnPosition?.rashiName === 'Capricorn' || saturnPosition?.rashiName === 'Aquarius') {
        healthTendency = language === 'hi' ? 'मजबूत हड्डियां लेकिन जोड़ों का ध्यान रखें' : 'strong bones but take care of joints';
      } else if (moonPosition?.rashiName === 'Cancer') {
        healthTendency = language === 'hi' ? 'पेट और पाचन संबंधी समस्याओं की संभावना' : 'possibility of stomach and digestive issues';
      } else {
        healthTendency = language === 'hi' ? 'सामान्यतः अच्छा स्वास्थ्य' : 'generally good health';
      }

      if (language === 'hi') {
        return `🙏 ${birthData?.fullName}, आपके स्वास्थ्य का व्यक्तिगत विश्लेषण:

🩺 **आपकी शारीरिक प्रकृति**: ${lagna?.signName} लग्न - ${healthTendency}

⚠️ **विशेष सावधानियां**:
- ${saturnPosition?.house === 6 ? 'पुरानी बीमारियों से बचें, नियमित जांच कराएं' : 'तनाव और चिंता से बचें'}
- ${moonPosition?.house === 1 ? 'मानसिक स्वास्थ्य का विशेष ध्यान रखें' : 'नींद की कमी न होने दें'}
- ${marsPosition?.isDebilitated ? 'ऊर्जा की कमी - आयरन की जांच कराएं' : 'दुर्घटनाओं से सावधान रहें'}

🌿 **व्यक्तिगत उपचार**:
- ${moonPosition?.rashiName === 'Cancer' ? 'दूध और घी का सेवन बढ़ाएं' : 'हरी सब्जियों का सेवन करें'}
- ${saturnPosition?.rashiName === 'Capricorn' ? 'कैल्शियम और विटामिन डी लें' : 'प्राणायाम और ध्यान करें'}
- ${birthData?.date ? `आपकी जन्म तिथि के अनुसार ${new Date(birthData.date).getDay() === 0 ? 'रविवार' : 'सप्ताह के दिन'} को व्रत रखें` : 'सप्ताह में एक दिन व्रत रखें'}

🧘 **दैनिक दिनचर्या**:
- प्रातःकाल ${lagna?.signName === 'Leo' ? 'सूर्य नमस्कार' : 'योग और प्राणायाम'} करें
- ${venusPosition?.rashiName === 'Taurus' ? 'धीमा और स्थिर व्यायाम' : 'नियमित कार्डियो एक्सरसाइज'} करें
- ${moonPosition?.isExalted ? 'रात को दूध पिएं' : 'समय पर भोजन करें'}

⏰ **स्वास्थ्य में सुधार**: ${currentDasha?.planet === 'JU' ? 'गुरु दशा में स्वास्थ्य में काफी सुधार' : 'अगले 6 महीनों में स्वास्थ्य बेहतर होगा'}

💪 **दीर्घकालिक स्वास्थ्य**: आपकी ${yogas.length} शुभ योगों से लंबी उम्र और अच्छा स्वास्थ्य

स्वस्थ रहें, खुश रहें! 🌟`;
      } else {
        return `🙏 ${birthData?.fullName}, personalized health analysis:

🩺 **Your Physical Constitution**: ${lagna?.signName} ascendant - ${healthTendency}

⚠️ **Specific Precautions**:
- ${saturnPosition?.house === 6 ? 'Avoid chronic diseases, get regular checkups' : 'Avoid stress and anxiety'}
- ${moonPosition?.house === 1 ? 'Take special care of mental health' : 'Don\'t let sleep deprivation occur'}
- ${marsPosition?.isDebilitated ? 'Energy deficiency - check iron levels' : 'Be careful of accidents'}

🌿 **Personal Treatment**:
- ${moonPosition?.rashiName === 'Cancer' ? 'Increase milk and ghee intake' : 'Consume green vegetables'}
- ${saturnPosition?.rashiName === 'Capricorn' ? 'Take calcium and vitamin D' : 'Do pranayama and meditation'}
- ${birthData?.date ? `Fast on ${new Date(birthData.date).getDay() === 0 ? 'Sundays' : 'specific weekdays'} according to your birth date` : 'Fast one day a week'}

🧘 **Daily Routine**:
- Do ${lagna?.signName === 'Leo' ? 'Surya Namaskara' : 'yoga and pranayama'} in morning
- Do ${venusPosition?.rashiName === 'Taurus' ? 'slow and steady exercise' : 'regular cardio exercise'}
- ${moonPosition?.isExalted ? 'Drink milk at night' : 'Eat meals on time'}

⏰ **Health Improvement**: ${currentDasha?.planet === 'JU' ? 'Significant health improvement in Jupiter period' : 'Health will improve in next 6 months'}

💪 **Long-term Health**: Your ${yogas.length} beneficial yogas indicate long life and good health

Stay healthy, stay happy! 🌟`;
      }
    }

    // General life guidance - deeply personalized
    if (language === 'hi') {
      return `🙏 प्रिय ${birthData?.fullName}, आपके जीवन का व्यक्तिगत मार्गदर्शन:

🌟 **आपका जीवन उद्देश्य**: ${lagna?.signName} लग्न + ${sunPosition?.rashiName} में सूर्य = आप ${getLagnaLifePurpose(lagna?.signName, 'hi')} के लिए जन्मे हैं

🧘 **आध्यात्मिक पथ**: ${moonPosition?.rashiName === 'Pisces' ? 'गहन ध्यान और भक्ति' : moonPosition?.rashiName === 'Sagittarius' ? 'धर्म और दर्शन का अध्ययन' : 'नियमित पूजा-पाठ'}

📿 **व्यक्तिगत मंत्र**: "${getPersonalMantra(lagna?.signName, sunPosition?.rashiName, 'hi')}"

⭐ **वर्तमान जीवन चरण**: ${currentDasha?.planet === 'JU' ? 'ज्ञान और विकास का समय' : currentDasha?.planet === 'VE' ? 'प्रेम और सुख का काल' : currentDasha?.planet === 'SA' ? 'कर्म और धैर्य का दौर' : 'संतुलन और प्रगति का समय'}

🎯 **आने वाले 12 महीने**:
- ${getSpecificPrediction(currentDasha?.planet, planets, 'hi')}
- ${yogas.length > 0 ? `आपके ${yogas[0]?.name || 'शुभ'} योग से विशेष लाभ` : 'धैर्य से मेहनत करने का समय'}
- ${birthData?.date ? `${new Date(birthData.date).getMonth() + 1}वें महीने में महत्वपूर्ण घटना` : 'जल्द ही खुशी की खबर'}

💎 **आपका व्यक्तिगत रत्न**: ${getPersonalGemstone(lagna?.signName, sunPosition, 'hi')}

🔮 **भविष्य का मार्ग**: ${getFuturePath(yogas, currentDasha, 'hi')}

आपका कल्याण हो, ${birthData?.fullName}! मेरा आशीर्वाद सदा आपके साथ है। 🕉️`;
    } else {
      return `🙏 Dear ${birthData?.fullName}, personalized life guidance:

🌟 **Your Life Purpose**: ${lagna?.signName} ascendant + Sun in ${sunPosition?.rashiName} = You are born to ${getLagnaLifePurpose(lagna?.signName, 'en')}

🧘 **Spiritual Path**: ${moonPosition?.rashiName === 'Pisces' ? 'deep meditation and devotion' : moonPosition?.rashiName === 'Sagittarius' ? 'study of religion and philosophy' : 'regular prayer and worship'}

📿 **Personal Mantra**: "${getPersonalMantra(lagna?.signName, sunPosition?.rashiName, 'en')}"

⭐ **Current Life Phase**: ${currentDasha?.planet === 'JU' ? 'time of knowledge and growth' : currentDasha?.planet === 'VE' ? 'period of love and happiness' : currentDasha?.planet === 'SA' ? 'phase of karma and patience' : 'time of balance and progress'}

🎯 **Next 12 Months**:
- ${getSpecificPrediction(currentDasha?.planet, planets, 'en')}
- ${yogas.length > 0 ? `Special benefits from your ${yogas[0]?.name || 'beneficial'} yoga` : 'time to work with patience'}
- ${birthData?.date ? `Important event in ${new Date(birthData.date).getMonth() + 1}th month` : 'good news coming soon'}

💎 **Your Personal Gemstone**: ${getPersonalGemstone(lagna?.signName, sunPosition, 'en')}

🔮 **Future Path**: ${getFuturePath(yogas, currentDasha, 'en')}

May you prosper, ${birthData?.fullName}! My blessings are always with you. 🕉️`;
    }
  };

  // Helper functions for personalized analysis
  const getLagnaLifePurpose = (sign: string | undefined, lang: string) => {
    const purposes: Record<string, { hi: string; en: string }> = {
      'Aries': { hi: 'नेतृत्व और साहस दिखाना', en: 'show leadership and courage' },
      'Taurus': { hi: 'स्थिरता और सुंदरता लाना', en: 'bring stability and beauty' },
      'Gemini': { hi: 'ज्ञान और संचार फैलाना', en: 'spread knowledge and communication' },
      'Cancer': { hi: 'देखभाल और संरक्षण करना', en: 'provide care and protection' },
      'Leo': { hi: 'प्रेरणा और रचनात्मकता देना', en: 'give inspiration and creativity' },
      'Virgo': { hi: 'सेवा और पूर्णता लाना', en: 'bring service and perfection' },
      'Libra': { hi: 'न्याय और संतुलन स्थापित करना', en: 'establish justice and balance' },
      'Scorpio': { hi: 'परिवर्तन और गहराई लाना', en: 'bring transformation and depth' },
      'Sagittarius': { hi: 'ज्ञान और सत्य का प्रसार', en: 'spread wisdom and truth' },
      'Capricorn': { hi: 'अनुशासन और उपलब्धि दिखाना', en: 'show discipline and achievement' },
      'Aquarius': { hi: 'नवाचार और मानव सेवा', en: 'innovation and humanitarian service' },
      'Pisces': { hi: 'आध्यात्म और करुणा फैलाना', en: 'spread spirituality and compassion' }
    };
    
    return purposes[sign || '']?.[lang] || (lang === 'hi' ? 'एक महान उद्देश्य पूरा करना' : 'fulfill a great purpose');
  };

  const getPersonalMantra = (lagna: string | undefined, sun: string | undefined, lang: string) => {
    if (lagna === 'Leo' || sun === 'Leo') {
      return lang === 'hi' ? 'ॐ सूर्याय नमः' : 'Om Suryaya Namah';
    } else if (lagna === 'Cancer' || sun === 'Cancer') {
      return lang === 'hi' ? 'ॐ चंद्राय नमः' : 'Om Chandraya Namah';
    } else if (lagna === 'Sagittarius' || sun === 'Sagittarius') {
      return lang === 'hi' ? 'ॐ गुरवे नमः' : 'Om Gurave Namah';
    } else {
      return lang === 'hi' ? 'ॐ नमो भगवते वासुदेवाय' : 'Om Namo Bhagavate Vasudevaya';
    }
  };

  const getSpecificPrediction = (dasha: string | undefined, planets: any, lang: string) => {
    if (dasha === 'JU') {
      return lang === 'hi' ? 'शिक्षा, धर्म या न्याय क्षेत्र में बड़ी सफलता' : 'major success in education, religion or justice field';
    } else if (dasha === 'VE') {
      return lang === 'hi' ? 'प्रेम, कला या व्यापार में खुशखबरी' : 'good news in love, arts or business';
    } else if (dasha === 'SA') {
      return lang === 'hi' ? 'धैर्य से काम लें, मेहनत का फल मिलेगा' : 'work with patience, hard work will pay off';
    } else {
      return lang === 'hi' ? 'नए अवसरों की शुरुआत' : 'beginning of new opportunities';
    }
  };

  const getPersonalGemstone = (lagna: string | undefined, sun: any, lang: string) => {
    if (lagna === 'Leo' || sun?.rashiName === 'Leo') {
      return lang === 'hi' ? 'माणिक्य (Ruby) - शक्ति और नेतृत्व के लिए' : 'Ruby - for power and leadership';
    } else if (lagna === 'Taurus' || sun?.rashiName === 'Taurus') {
      return lang === 'hi' ? 'हीरा (Diamond) - सुख और समृद्धि के लिए' : 'Diamond - for happiness and prosperity';
    } else if (lagna === 'Sagittarius' || sun?.rashiName === 'Sagittarius') {
      return lang === 'hi' ? 'पुखराज (Yellow Sapphire) - ज्ञान और भाग्य के लिए' : 'Yellow Sapphire - for wisdom and fortune';
    } else {
      return lang === 'hi' ? 'मोती (Pearl) - मानसिक शांति के लिए' : 'Pearl - for mental peace';
    }
  };

  const getFuturePath = (yogas: any[], dasha: any, lang: string) => {
    if (yogas.length > 2) {
      return lang === 'hi' ? '2025-27 में आपके जीवन में बड़ा बदलाव, सफलता निश्चित' : 'major life change in 2025-27, success is certain';
    } else {
      return lang === 'hi' ? 'धीरे-धीरे लेकिन निरंतर प्रगति, धैर्य रखें' : 'slow but steady progress, be patient';
    }
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
        
        if (hoursDiff < 6) {
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
          ? '🙏 नमस्कार मेरे पुत्र! मैं महर्षि पराशर हूं। पहले अपनी कुंडली बनाएं, फिर मैं व्यक्तिगत सहायता करूंगा। 🕉️'
          : '🙏 Hello dear child! I am Maharishi Parashar. Create your birth chart first, then I can provide personalized help. 🕉️',
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
      return;
    }

    const lagna = kundaliData.enhancedCalculations.lagna;
    const planets = kundaliData.enhancedCalculations.planets;
    const activeYogas = kundaliData.enhancedCalculations.yogas?.filter(y => y.isActive) || [];
    const currentDasha = kundaliData.enhancedCalculations.dashas?.find(d => d.isActive);
    
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: language === 'hi' 
        ? `🙏 मेरे प्रिय पुत्र ${kundaliData.birthData?.fullName || ''}, मैं महर्षि पराशर हूं।

🌟 आपका व्यक्तिगत विवरण:
• ${lagna?.signName || 'अज्ञात'} लग्न - ${getLagnaLifePurpose(lagna?.signName, 'hi')}
• चंद्र: ${planets?.MO?.rashiName || 'अज्ञात'} राशि में
• वर्तमान दशा: ${currentDasha?.planet || 'अज्ञात'} - ${getSpecificPrediction(currentDasha?.planet, planets, 'hi')}
• ${activeYogas.length} शुभ योग सक्रिय

मैं आपको व्यक्तिगत सुझाव दूंगा। कैरियर, विवाह, स्वास्थ्य या जीवन के बारे में पूछें! 💫`
        : `🙏 My dear child ${kundaliData.birthData?.fullName || ''}, I am Maharishi Parashar.

🌟 Your Personal Details:
• ${lagna?.signName || 'Unknown'} ascendant - ${getLagnaLifePurpose(lagna?.signName, 'en')}
• Moon: in ${planets?.MO?.rashiName || 'Unknown'} sign
• Current dasha: ${currentDasha?.planet || 'Unknown'} - ${getSpecificPrediction(currentDasha?.planet, planets, 'en')}
• ${activeYogas.length} beneficial yogas active

I will give you personalized guidance. Ask about career, marriage, health or life! 💫`,
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
        setTimeout(() => reject(new Error('AI timeout')), 3000)
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
          session_id: `personalized_session_${Date.now()}`
        });
      } catch (insertError) {
        console.log('Conversation storage failed:', insertError);
      }

    } catch (error) {
      console.log('AI failed, using personalized fallback:', error);
      
      setRetryCount(prev => prev + 1);
      
      // Use enhanced personalized response
      const personalizedResponse = generatePersonalizedResponse(currentInput);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: personalizedResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setCachedResponse(currentInput, personalizedResponse);
      
      if (retryCount === 0) {
        toast({
          title: language === 'hi' ? "व्यक्तिगत मार्गदर्शन" : "Personalized Guidance",
          description: language === 'hi' ? "आपकी कुंडली आधारित विशेष सलाह" : "Special advice based on your Kundali",
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
    setMessages(messages.slice(0, 1));
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
            {language === 'hi' ? `व्यक्तिगत मार्गदर्शन मोड ${retryCount}/3` : `Personalized guidance mode ${retryCount}/3`}
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
              placeholder={language === 'hi' ? "व्यक्तिगत प्रश्न पूछें..." : "Ask personal question..."}
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
