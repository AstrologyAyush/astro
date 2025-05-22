
import React, { useState } from 'react';
import { KundaliChart as KundaliChartType } from '@/lib/kundaliUtils';
import { motion } from 'framer-motion';

interface VisualKundaliChartProps {
  chart: KundaliChartType;
  language: 'hi' | 'en';
}

const VisualKundaliChart: React.FC<VisualKundaliChartProps> = ({ chart, language }) => {
  const [activeHouse, setActiveHouse] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const getZodiacColor = (sign: string) => {
    const colors = {
      'Aries': 'bg-red-500/20 text-red-700 border-red-300',
      'Taurus': 'bg-emerald-500/20 text-emerald-700 border-emerald-300',
      'Gemini': 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
      'Cancer': 'bg-blue-500/20 text-blue-700 border-blue-300',
      'Leo': 'bg-orange-500/20 text-orange-700 border-orange-300',
      'Virgo': 'bg-green-500/20 text-green-700 border-green-300',
      'Libra': 'bg-sky-500/20 text-sky-700 border-sky-300',
      'Scorpio': 'bg-purple-500/20 text-purple-700 border-purple-300',
      'Sagittarius': 'bg-pink-500/20 text-pink-700 border-pink-300',
      'Capricorn': 'bg-fuchsia-500/20 text-fuchsia-700 border-fuchsia-300',
      'Aquarius': 'bg-indigo-500/20 text-indigo-700 border-indigo-300',
      'Pisces': 'bg-teal-500/20 text-teal-700 border-teal-300'
    };
    return colors[sign as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getPlanetSymbol = (planetId: string) => {
    const symbols: Record<string, string> = {
      SU: '☉', // Sun
      MO: '☽', // Moon
      MA: '♂', // Mars
      ME: '☿', // Mercury
      JU: '♃', // Jupiter
      VE: '♀', // Venus
      SA: '♄', // Saturn
      RA: '☊', // Rahu
      KE: '☋', // Ketu
    };
    return symbols[planetId] || planetId;
  };

  const getPlanetColor = (planetId: string) => {
    const colors: Record<string, string> = {
      SU: 'bg-amber-500/20 text-amber-700',
      MO: 'bg-slate-300/30 text-slate-700',
      MA: 'bg-red-500/20 text-red-700',
      ME: 'bg-emerald-500/20 text-emerald-700',
      JU: 'bg-yellow-500/20 text-yellow-700',
      VE: 'bg-cyan-500/20 text-cyan-700',
      SA: 'bg-blue-700/20 text-blue-700',
      RA: 'bg-purple-500/20 text-purple-700',
      KE: 'bg-violet-500/20 text-violet-700',
    };
    return colors[planetId] || 'bg-gray-100 text-gray-700';
  };

  // Updated: Check if planet has a house property before filtering
  const getHousePlanets = (houseNumber: number) => {
    return chart.planets.filter(planet => 
      'house' in planet && planet.house === houseNumber
    );
  };

  const handleHouseClick = (houseNumber: number) => {
    setActiveHouse(activeHouse === houseNumber ? null : houseNumber);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="kundali-chart">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-primary/5 rounded-md"></div>
        
        {/* Interactive visualization overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="h-48 w-48 md:h-64 md:w-64 rounded-full chakra-element"
            style={{ 
              background: 'radial-gradient(circle at center, rgba(251,191,36,0.1) 0%, rgba(147,51,234,0.05) 70%, transparent 100%)' 
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          
          {/* Ascendant marker */}
          {chart.ascendant && (
            <motion.div 
              className="absolute h-full w-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 transform -translate-y-1/2">
                <div className="h-4 w-4 bg-primary rounded-full"></div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="kundali-grid relative z-10">
          {/* Generate houses 1-12 */}
          {Array.from({ length: 12 }, (_, i) => {
            const houseNumber = i + 1;
            const planets = getHousePlanets(houseNumber);
            // Fix: Convert the zodiac sign to string before using it
            const zodiacSign = chart.housesList[i] ? String(chart.housesList[i]) : "Unknown";
            
            return (
              <motion.div
                key={houseNumber}
                className={`kundali-house kundali-house-${houseNumber} ${getZodiacColor(zodiacSign)} ${activeHouse === houseNumber ? 'ring-2 ring-primary' : ''}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleHouseClick(houseNumber)}
              >
                {/* Fix: Ensure zodiacSign is a string before using substring */}
                <div className="zodiac-symbol mb-1">{zodiacSign.substring(0, 3)}</div>
                <div className="text-xs font-medium mb-1">House {houseNumber}</div>
                {planets.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {planets.map(planet => (
                      <div
                        key={planet.id}
                        className={`planet-symbol ${getPlanetColor(planet.id)}`}
                        title={planet.name}
                      >
                        {getPlanetSymbol(planet.id)}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {showDetails && activeHouse !== null && (
        <motion.div
          className="p-4 bg-card border rounded-lg mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-2">
            House {activeHouse}: {chart.housesList[activeHouse - 1] ? String(chart.housesList[activeHouse - 1]) : "Unknown"}
          </h3>
          
          {chart.housesList[activeHouse - 1] && (
            <p className="text-sm text-muted-foreground mb-3">
              {language === 'hi' ? 'इस भाव का राशि:' : 'Sign for this house:'} 
              <span className="font-medium"> {String(chart.housesList[activeHouse - 1])}</span>
            </p>
          )}
          
          {getHousePlanets(activeHouse).length > 0 ? (
            <div>
              <h4 className="font-medium text-sm mb-2">{language === 'hi' ? 'उपस्थित ग्रह:' : 'Planets Present:'}</h4>
              <div className="grid grid-cols-2 gap-2">
                {getHousePlanets(activeHouse).map(planet => (
                  <div key={planet.id} className={`p-2 rounded-md ${getPlanetColor(planet.id)}`}>
                    <div className="flex items-center gap-2">
                      <div className="text-lg">{getPlanetSymbol(planet.id)}</div>
                      <div>
                        <div className="font-medium text-sm">{planet.name}</div>
                        <div className="text-xs">{planet.sign}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {language === 'hi' ? 'इस भाव में कोई ग्रह उपस्थित नहीं है।' : 'No planets present in this house.'}
            </p>
          )}
          
          <div className="mt-4 pt-3 border-t">
            <h4 className="font-medium text-sm mb-1">{language === 'hi' ? 'भाव का अर्थ:' : 'House Meaning:'}</h4>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' 
                ? getHouseMeaningHindi(activeHouse)
                : getHouseMeaningEnglish(activeHouse)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// House meanings in English
const getHouseMeaningEnglish = (houseNumber: number): string => {
  const houseMeanings = [
    "Self, personality, physical body, and new beginnings.",
    "Material possessions, values, and personal resources.",
    "Communication, siblings, short travel, and early education.",
    "Home, family, roots, and emotional foundation.",
    "Creativity, romance, children, and pleasure.",
    "Health, daily routines, service, and pets.",
    "Partnerships, marriage, contracts, and open enemies.",
    "Transformation, shared resources, and deep psychological matters.",
    "Philosophy, higher education, long journeys, and beliefs.",
    "Career, public status, reputation, and authority.",
    "Friends, social groups, aspirations, and collective consciousness.",
    "Spirituality, hidden matters, and self-undoing."
  ];
  return houseMeanings[houseNumber - 1] || "Meaning not available.";
};

// House meanings in Hindi
const getHouseMeaningHindi = (houseNumber: number): string => {
  const houseMeanings = [
    "स्वयं, व्यक्तित्व, शारीरिक शरीर और नई शुरुआत।",
    "भौतिक संपत्ति, मूल्य और व्यक्तिगत संसाधन।",
    "संचार, भाई-बहन, छोटी यात्रा और प्रारंभिक शिक्षा।",
    "घर, परिवार, जड़ें और भावनात्मक आधार।",
    "रचनात्मकता, रोमांस, बच्चे और आनंद।",
    "स्वास्थ्य, दैनिक दिनचर्या, सेवा और पालतू जानवर।",
    "साझेदारी, विवाह, अनुबंध और खुले दुश्मन।",
    "परिवर्तन, साझा संसाधन और गहरे मनोवैज्ञानिक मामले।",
    "दर्शन, उच्च शिक्षा, लंबी यात्राएं और विश्वास।",
    "करियर, सार्वजनिक स्थिति, प्रतिष्ठा और अधिकार।",
    "दोस्त, सामाजिक समूह, आकांक्षाएं और सामूहिक चेतना।",
    "अध्यात्मिकता, छिपे हुए मामले और स्वयं का विनाश।"
  ];
  return houseMeanings[houseNumber - 1] || "अर्थ उपलब्ध नहीं है।";
};

export default VisualKundaliChart;
