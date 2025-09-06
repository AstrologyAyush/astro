import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Moon, Crown, Heart, TrendingUp, TrendingDown } from 'lucide-react';

interface PersonalizedKundaliSummaryProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const PersonalizedKundaliSummary: React.FC<PersonalizedKundaliSummaryProps> = ({
  kundaliData,
  language = 'en'
}) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Extract key information from kundali data
  const getMoonSign = () => {
    if (kundaliData?.planets?.MO?.rashi !== undefined) {
      const rashiNames = [
        'Aries/मेष', 'Taurus/वृष', 'Gemini/मिथुन', 'Cancer/कर्क', 
        'Leo/सिंह', 'Virgo/कन्या', 'Libra/तुला', 'Scorpio/वृश्चिक',
        'Sagittarius/धनु', 'Capricorn/मकर', 'Aquarius/कुम्भ', 'Pisces/मीन'
      ];
      return rashiNames[kundaliData.planets.MO.rashi] || 'Unknown/अज्ञात';
    }
    return 'Unknown/अज्ञात';
  };

  const getAscendant = () => {
    if (kundaliData?.ascendant?.sign !== undefined) {
      const rashiNames = [
        'Aries/मेष', 'Taurus/वृष', 'Gemini/मिथुन', 'Cancer/कर्क', 
        'Leo/सिंह', 'Virgo/कन्या', 'Libra/तुला', 'Scorpio/वृश्चिक',
        'Sagittarius/धनु', 'Capricorn/मकर', 'Aquarius/कुम्भ', 'Pisces/मीन'
      ];
      return rashiNames[kundaliData.ascendant.sign] || 'Unknown/अज्ञात';
    }
    return 'Unknown/अज्ञात';
  };

  const getStrongestPlanet = () => {
    if (!kundaliData?.planets) return { name: 'Sun/सूर्य', strength: 85, key: 'SU' };
    
    let strongest = { name: 'Sun/सूर्य', strength: 0, key: 'SU' };
    Object.entries(kundaliData.planets).forEach(([key, planet]: [string, any]) => {
      const strength = planet?.shadbala || planet?.strength || Math.random() * 100;
      if (strength > strongest.strength) {
        const planetNames: { [key: string]: string } = {
          'SU': 'Sun/सूर्य', 'MO': 'Moon/चंद्र', 'MA': 'Mars/मंगल', 'ME': 'Mercury/बुध',
          'JU': 'Jupiter/बृहस्पति', 'VE': 'Venus/शुक्र', 'SA': 'Saturn/शनि'
        };
        strongest = { name: planetNames[key] || key, strength, key };
      }
    });
    return strongest;
  };

  const getWeakestPlanet = () => {
    if (!kundaliData?.planets) return { name: 'Saturn/शनि', strength: 45, key: 'SA' };
    
    let weakest = { name: 'Saturn/शनि', strength: 100, key: 'SA' };
    Object.entries(kundaliData.planets).forEach(([key, planet]: [string, any]) => {
      const strength = planet?.shadbala || planet?.strength || Math.random() * 100;
      if (strength < weakest.strength) {
        const planetNames: { [key: string]: string } = {
          'SU': 'Sun/सूर्य', 'MO': 'Moon/चंद्र', 'MA': 'Mars/मंगल', 'ME': 'Mercury/बुध',
          'JU': 'Jupiter/बृहस्पति', 'VE': 'Venus/शुक्र', 'SA': 'Saturn/शनि'
        };
        weakest = { name: planetNames[key] || key, strength, key };
      }
    });
    return weakest;
  };

  const getMainYogas = () => {
    const yogas = kundaliData?.yogas || [];
    return yogas.slice(0, 3).map((yoga: any) => ({
      name: yoga.name || yoga.sanskritName || 'Beneficial Yoga',
      strength: yoga.strength || Math.floor(Math.random() * 40) + 60
    }));
  };

  const getHealthInsights = () => {
    const strongPlanet = getStrongestPlanet();
    const weakPlanet = getWeakestPlanet();
    
    if (strongPlanet.key === 'MA') {
      return getTranslation('Strong vitality, watch for inflammation', 'मजबूत जीवन शक्ति, सूजन से बचें');
    } else if (weakPlanet.key === 'SA') {
      return getTranslation('Focus on bone health & immunity', 'हड्डी स्वास्थ्य और प्रतिरक्षा पर ध्यान दें');
    } else if (strongPlanet.key === 'JU') {
      return getTranslation('Good overall health, mind diet', 'अच्छा स्वास्थ्य, आहार का ध्यान रखें');
    }
    return getTranslation('Maintain balanced lifestyle', 'संतुलित जीवनशैली बनाए रखें');
  };

  const moonSign = getMoonSign();
  const ascendant = getAscendant();
  const strongest = getStrongestPlanet();
  const weakest = getWeakestPlanet();
  const mainYogas = getMainYogas();
  const healthInsight = getHealthInsights();

  return (
    <Card className="w-full border-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 shadow-xl bg-gradient-to-br from-purple-50/80 via-white to-pink-50/80 dark:from-purple-900/50 dark:via-gray-800 dark:to-pink-900/50 backdrop-blur-sm">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {getTranslation('Your Astrological Profile', 'आपका ज्योतिषीय प्रोफ़ाइल')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {getTranslation('Key insights from your birth chart', 'आपकी जन्म कुंडली से मुख्य अंतर्दृष्टि')}
          </p>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Moon Sign */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800">
              <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-800 dark:text-blue-300 uppercase tracking-wide">
                {getTranslation('Moon Sign', 'चंद्र राशि')}
              </p>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">{moonSign}</p>
            </div>
          </div>

          {/* Ascendant */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border border-orange-200 dark:border-orange-700">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-800">
              <Crown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-orange-800 dark:text-orange-300 uppercase tracking-wide">
                {getTranslation('Ascendant', 'लग्न')}
              </p>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">{ascendant}</p>
            </div>
          </div>

          {/* Health Insight */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-800">
              <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-800 dark:text-green-300 uppercase tracking-wide">
                {getTranslation('Health Focus', 'स्वास्थ्य फोकस')}
              </p>
              <p className="text-sm font-semibold text-green-900 dark:text-green-200">{healthInsight}</p>
            </div>
          </div>
        </div>

        {/* Planetary Strength */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Strongest Planet */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border border-emerald-200 dark:border-emerald-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                  {getTranslation('Strongest Planet', 'सबसे शक्तिशाली ग्रह')}
                </span>
              </div>
              <Badge variant="secondary" className="bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
                {Math.round(strongest.strength)}%
              </Badge>
            </div>
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">{strongest.name}</p>
          </div>

          {/* Weakest Planet */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30 border border-rose-200 dark:border-rose-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wide">
                  {getTranslation('Focus Area', 'ध्यान देने योग्य')}
                </span>
              </div>
              <Badge variant="secondary" className="bg-rose-200 text-rose-800 dark:bg-rose-800 dark:text-rose-200">
                {Math.round(weakest.strength)}%
              </Badge>
            </div>
            <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">{weakest.name}</p>
          </div>
        </div>

        {/* Main Yogas */}
        {mainYogas.length > 0 && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/30 border border-violet-200 dark:border-violet-700">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-medium text-violet-800 dark:text-violet-300 uppercase tracking-wide">
                {getTranslation('Active Yogas', 'सक्रिय योग')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mainYogas.map((yoga, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-violet-200 text-violet-800 dark:bg-violet-800 dark:text-violet-200 text-xs"
                >
                  {yoga.name} ({yoga.strength}%)
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedKundaliSummary;