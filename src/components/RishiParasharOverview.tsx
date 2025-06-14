
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Star, Crown } from 'lucide-react';

interface RishiParasharOverviewProps {
  language: 'hi' | 'en';
}

const RishiParasharOverview: React.FC<RishiParasharOverviewProps> = ({ language }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const thoughts = language === 'hi' ? {
    title: "महर्षि पराशर के कुंडली पर विचार",
    subtitle: "वैदिक ज्योतिष के आदि गुरु का ज्ञान",
    quotes: [
      {
        text: "ग्रहाणां चेष्टते यो वै भूतकाल भविष्यते। तत्सर्वं कथयाम्यद्य त्वमेकाग्रमनाः श्रुणु॥",
        meaning: "ग्रह जो गति करते हैं, भूत, वर्तमान और भविष्य में, उन सबका मैं वर्णन करूंगा। तुम एकाग्र मन से सुनो।"
      },
      {
        text: "जन्मकालेऽस्य यद्राश्यादिकं तत्तस्य जीवने फलमाविर्भावते सर्वं शुभाशुभम्।",
        meaning: "जन्म के समय जो राशि आदि होते हैं, उनसे जीवन में सभी शुभ-अशुभ फल प्राप्त होते हैं।"
      },
      {
        text: "कुंडली दर्पणं जीवने, यत्र दृश्यते सर्वकर्म। पूर्वजन्म कृतं कर्म, फलते जीवने सदा॥",
        meaning: "कुंडली जीवन का दर्पण है, जिसमें सभी कर्म दिखाई देते हैं। पूर्वजन्म के कर्म इस जीवन में फल देते हैं।"
      }
    ],
    principles: [
      "कुंडली आत्मा की यात्रा का मार्गदर्शक है",
      "ग्रहों की स्थिति कर्म का फल दर्शाती है",
      "समय और स्थान की गणना अत्यधिक महत्वपूर्ण है",
      "मानव जीवन ब्रह्मांडीय नियमों से संचालित होता है",
      "कुंडली से भूत, वर्तमान और भविष्य का ज्ञान होता है"
    ],
    wisdom: "महर्षि पराशर के अनुसार, कुंडली केवल भविष्यवाणी का साधन नहीं, बल्कि आत्मा की विकास यात्रा का नक्शा है। यह हमारे कर्मों का लेखा-जोखा और मोक्ष के मार्ग का दिशा-निर्देश प्रदान करती है।"
  } : {
    title: "Maharishi Parashar's Thoughts on Kundali",
    subtitle: "Wisdom from the Father of Vedic Astrology",
    quotes: [
      {
        text: "The movements of planets, in past, present and future, I shall describe them all. Listen with concentrated mind.",
        meaning: "The celestial movements govern all temporal existence and reveal the cosmic design of individual destiny."
      },
      {
        text: "Whatever signs and planetary positions exist at birth, from them all auspicious and inauspicious results manifest in life.",
        meaning: "The birth chart captures the cosmic blueprint that unfolds throughout one's lifetime journey."
      },
      {
        text: "The Kundali is a mirror of life, where all actions are reflected. Deeds of past births bear fruit in this life always.",
        meaning: "Birth charts reveal the karmic patterns and spiritual lessons encoded in our cosmic DNA."
      }
    ],
    principles: [
      "Kundali is a guide for the soul's journey",
      "Planetary positions reflect karmic consequences",
      "Precise time and location calculations are crucial",
      "Human life is governed by cosmic laws",
      "Charts reveal past, present and future wisdom"
    ],
    wisdom: "According to Maharishi Parashar, a Kundali is not merely a predictive tool, but a map of the soul's evolutionary journey. It provides an accounting of our karmic actions and guidance toward the path of liberation (moksha)."
  };

  return (
    <Card className="border-orange-200 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 pb-4">
        <CardTitle className="flex items-center gap-3 text-orange-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
              alt="Rishi Parasher" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold">{thoughts.title}</h3>
            <p className="text-sm text-orange-600 font-medium">{thoughts.subtitle}</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Sacred Quotes */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            {language === 'hi' ? 'पवित्र श्लोक' : 'Sacred Verses'}
          </h4>
          <ScrollArea className="h-48">
            <div className="space-y-4">
              {thoughts.quotes.map((quote, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
                  <blockquote className="text-sm font-medium text-gray-800 mb-2 italic">
                    "{quote.text}"
                  </blockquote>
                  <p className="text-xs text-gray-600">{quote.meaning}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Core Principles */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-600" />
            {language === 'hi' ? 'मूल सिद्धांत' : 'Core Principles'}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {thoughts.principles.map((principle, index) => (
              <div key={index} className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{principle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profound Wisdom */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
            <Crown className="h-5 w-5" />
            {language === 'hi' ? 'गहन ज्ञान' : 'Profound Wisdom'}
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">{thoughts.wisdom}</p>
        </div>

        <Badge className="w-full justify-center py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white">
          {language === 'hi' ? '🙏 वैदिक ज्योतिष शास्त्र के अनुसार' : '🙏 According to Vedic Astrological Science'}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default RishiParasharOverview;
