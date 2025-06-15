
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Star, Heart, Sun, Moon, Gift } from "lucide-react";

interface AISpiritualGuidanceProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const AISpiritualGuidance: React.FC<AISpiritualGuidanceProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [activeTab, setActiveTab] = useState('spiritual-path');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const spiritualData = {
    spiritualPath: {
      primaryPath: getTranslation('Bhakti Yoga - Path of Devotion', 'भक्ति योग - भक्ति का मार्ग'),
      secondaryPath: getTranslation('Karma Yoga - Path of Action', 'कर्म योग - कर्म का मार्ग'),
      suitability: '94%',
      description: getTranslation(
        'Your chart shows strong devotional tendencies with Jupiter in a prominent position. You are naturally inclined towards spiritual practices that involve love, devotion, and surrender.',
        'आपकी कुंडली में बृहस्पति की प्रमुख स्थिति भक्ति की प्रवृत्ति दिखाती है। आप प्रेम, भक्ति और समर्पण वाली आध्यात्मिक प्रथाओं की ओर स्वाभाविक रूप से आकर्षित हैं।'
      )
    },
    practices: {
      daily: [
        {
          practice: getTranslation('Morning Sun Meditation', 'प्रातःकालीन सूर्य ध्यान'),
          duration: getTranslation('15-20 minutes', '15-20 मिनट'),
          benefit: getTranslation('Enhances spiritual clarity and vitality', 'आध्यात्मिक स्पष्टता और जीवन शक्ति बढ़ाता है')
        },
        {
          practice: getTranslation('Mantra Chanting (Om Namah Shivaya)', 'मंत्र जप (ॐ नमः शिवाय)'),
          duration: getTranslation('108 times', '108 बार'),
          benefit: getTranslation('Purifies mind and connects with divine consciousness', 'मन को शुद्ध करता है और दिव्य चेतना से जोड़ता है')
        },
        {
          practice: getTranslation('Evening Gratitude Practice', 'सांयकालीन कृतज्ञता अभ्यास'),
          duration: getTranslation('10 minutes', '10 मिनट'),
          benefit: getTranslation('Cultivates contentment and spiritual satisfaction', 'संतुष्टि और आध्यात्मिक तृप्ति विकसित करता है')
        }
      ],
      weekly: [
        {
          practice: getTranslation('Fasting on Ekadashi', 'एकादशी व्रत'),
          frequency: getTranslation('Twice monthly', 'महीने में दो बार'),
          benefit: getTranslation('Spiritual purification and self-discipline', 'आध्यात्मिक शुद्धिकरण और आत्म-अनुशासन')
        },
        {
          practice: getTranslation('Temple/Sacred Space Visit', 'मंदिर/पवित्र स्थान दर्शन'),
          frequency: getTranslation('Weekly', 'साप्ताहिक'),
          benefit: getTranslation('Divine connection and spiritual charging', 'दिव्य संबंध और आध्यात्मिक ऊर्जा')
        }
      ]
    },
    sacredTiming: {
      bestTimes: [
        {
          time: getTranslation('Brahma Muhurta (4:00-6:00 AM)', 'ब्रह्म मुहूर्त (4:00-6:00 AM)'),
          activity: getTranslation('Deep meditation and spiritual study', 'गहरा ध्यान और आध्यात्मिक अध्ययन'),
          power: 'Maximum'
        },
        {
          time: getTranslation('Sunset (6:00-7:00 PM)', 'सूर्यास्त (6:00-7:00 PM)'),
          activity: getTranslation('Prayer and reflection', 'प्रार्थना और चिंतन'),
          power: 'High'
        },
        {
          time: getTranslation('Full Moon nights', 'पूर्णिमा की रातें'),
          activity: getTranslation('Group meditation and chanting', 'सामूहिक ध्यान और भजन'),
          power: 'Elevated'
        }
      ],
      avoidTimes: [
        getTranslation('Rahu Kaal periods', 'राहु काल समय'),
        getTranslation('New moon nights for beginners', 'नए साधकों के लिए अमावस्या की रातें')
      ]
    },
    spiritualGoals: {
      shortTerm: [
        getTranslation('Establish daily meditation routine', 'दैनिक ध्यान दिनचर्या स्थापित करना'),
        getTranslation('Learn Sanskrit mantras', 'संस्कृत मंत्र सीखना'),
        getTranslation('Study Bhagavad Gita', 'भगवद गीता का अध्ययन'),
        getTranslation('Practice non-violence in thoughts', 'विचारों में अहिंसा का अभ्यास')
      ],
      longTerm: [
        getTranslation('Achieve inner peace and equanimity', 'आंतरिक शांति और समभाव प्राप्त करना'),
        getTranslation('Develop unconditional love and compassion', 'निःशर्त प्रेम और करुणा विकसित करना'),
        getTranslation('Realize self and divine connection', 'आत्म-साक्षात्कार और दिव्य संबंध'),
        getTranslation('Become a source of light for others', 'दूसरों के लिए प्रकाश का स्रोत बनना')
      ]
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-indigo-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Sparkles className="h-5 w-5" />
            {getTranslation('AI Spiritual Guidance & Path Discovery', 'AI आध्यात्मिक मार्गदर्शन और पथ खोज')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
              <TabsTrigger value="spiritual-path" className="flex flex-col items-center gap-1 text-xs p-2">
                <Star className="h-3 w-3" />
                {getTranslation('Your Path', 'आपका मार्ग')}
              </TabsTrigger>
              <TabsTrigger value="practices" className="flex flex-col items-center gap-1 text-xs p-2">
                <Sparkles className="h-3 w-3" />
                {getTranslation('Practices', 'अभ्यास')}
              </TabsTrigger>
              <TabsTrigger value="sacred-timing" className="flex flex-col items-center gap-1 text-xs p-2">
                <Sun className="h-3 w-3" />
                {getTranslation('Sacred Timing', 'पवित्र समय')}
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex flex-col items-center gap-1 text-xs p-2">
                <Heart className="h-3 w-3" />
                {getTranslation('Spiritual Goals', 'आध्यात्मिक लक्ष्य')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="spiritual-path" className="space-y-6">
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-800 mb-2">
                      {spiritualData.spiritualPath.primaryPath}
                    </h3>
                    <Badge className="bg-purple-600 text-white text-lg px-4 py-1">
                      {spiritualData.spiritualPath.suitability}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 text-center mb-4">
                    {spiritualData.spiritualPath.description}
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      {getTranslation('Secondary Path:', 'द्वितीयक मार्ग:')}
                    </h4>
                    <p className="text-gray-700">{spiritualData.spiritualPath.secondaryPath}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practices" className="space-y-6">
              <div className="grid gap-6">
                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {getTranslation('Daily Practices', 'दैनिक अभ्यास')}
                    </h4>
                    <div className="space-y-4">
                      {spiritualData.practices.daily.map((practice, index) => (
                        <div key={index} className="border-l-4 border-green-400 pl-4">
                          <h5 className="font-medium text-green-800">{practice.practice}</h5>
                          <p className="text-sm text-gray-600">
                            <strong>{getTranslation('Duration:', 'अवधि:')}</strong> {practice.duration}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{practice.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      {getTranslation('Weekly Practices', 'साप्ताहिक अभ्यास')}
                    </h4>
                    <div className="space-y-4">
                      {spiritualData.practices.weekly.map((practice, index) => (
                        <div key={index} className="border-l-4 border-blue-400 pl-4">
                          <h5 className="font-medium text-blue-800">{practice.practice}</h5>
                          <p className="text-sm text-gray-600">
                            <strong>{getTranslation('Frequency:', 'आवृत्ति:')}</strong> {practice.frequency}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{practice.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sacred-timing" className="space-y-6">
              <div className="grid gap-4">
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-yellow-800 mb-4">
                      {getTranslation('Most Powerful Times for Spiritual Practice', 'आध्यात्मिक अभ्यास के लिए सबसे शक्तिशाली समय')}
                    </h4>
                    {spiritualData.sacredTiming.bestTimes.map((timing, index) => (
                      <div key={index} className="mb-4 p-3 bg-white rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-yellow-800">{timing.time}</span>
                          <Badge variant={timing.power === 'Maximum' ? 'default' : 'secondary'}>
                            {timing.power}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{timing.activity}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-red-800 mb-3">
                      {getTranslation('Times to Avoid', 'बचने योग्य समय')}
                    </h4>
                    <ul className="space-y-2">
                      {spiritualData.sacredTiming.avoidTimes.map((time, idx) => (
                        <li key={idx} className="text-sm text-red-700 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {time}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-teal-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-teal-800 mb-4 flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      {getTranslation('Short-term Goals (3-6 months)', 'अल्पकालिक लक्ष्य (3-6 महीने)')}
                    </h4>
                    <ul className="space-y-2">
                      {spiritualData.spiritualGoals.shortTerm.map((goal, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2"></span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-violet-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-violet-800 mb-4 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {getTranslation('Long-term Goals (1-3 years)', 'दीर्घकालिक लक्ष्य (1-3 वर्ष)')}
                    </h4>
                    <ul className="space-y-2">
                      {spiritualData.spiritualGoals.longTerm.map((goal, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2"></span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISpiritualGuidance;
