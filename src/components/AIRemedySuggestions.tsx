
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gem, Flower, Sun, Moon, Star, Zap, Heart, Shield } from "lucide-react";

interface AIRemedySuggestionsProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const AIRemedySuggestions: React.FC<AIRemedySuggestionsProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [activeCategory, setActiveCategory] = useState('gemstones');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const remedies = {
    gemstones: {
      primary: {
        name: getTranslation('Blue Sapphire', 'नीलम'),
        planet: getTranslation('Saturn', 'शनि'),
        benefits: getTranslation(
          'Enhances discipline, focus, and career success. Protects from negative influences.',
          'अनुशासन, ध्यान और करियर की सफलता बढ़ाता है। नकारात्मक प्रभावों से सुरक्षा करता है।'
        ),
        wearing: getTranslation('Saturday, middle finger, silver/gold ring', 'शनिवार, मध्यमा अंगुली, चांदी/सोने की अंगूठी'),
        weight: '5-7 carats',
        substitute: getTranslation('Amethyst, Iolite', 'नीलकांत मणि, आयोलाइट')
      },
      secondary: {
        name: getTranslation('Yellow Sapphire', 'पुखराज'),
        planet: getTranslation('Jupiter', 'बृहस्पति'),
        benefits: getTranslation(
          'Brings wisdom, prosperity, and spiritual growth. Enhances learning abilities.',
          'ज्ञान, समृद्धि और आध्यात्मिक विकास लाता है। सीखने की क्षमता बढ़ाता है।'
        ),
        wearing: getTranslation('Thursday, index finger, gold ring', 'गुरुवार, तर्जनी अंगुली, सोने की अंगूठी'),
        weight: '5-7 carats',
        substitute: getTranslation('Citrine, Topaz', 'सुनहला, पुष्पराग')
      }
    },
    mantras: {
      daily: [
        {
          mantra: 'ॐ गं गणपतये नमः',
          transliteration: 'Om Gam Ganapataye Namah',
          purpose: getTranslation('Removes obstacles', 'बाधाओं को हटाता है'),
          times: '108 times daily',
          timing: getTranslation('Morning after bath', 'स्नान के बाद सुबह')
        },
        {
          mantra: 'ॐ श्री गुरवे नमः',
          transliteration: 'Om Shri Gurave Namah',
          purpose: getTranslation('Enhances wisdom and Jupiter', 'ज्ञान और बृहस्पति को बढ़ाता है'),
          times: '108 times',
          timing: getTranslation('Thursday morning', 'गुरुवार सुबह')
        },
        {
          mantra: 'ॐ शं शनैश्चराय नमः',
          transliteration: 'Om Sham Shanaishcharaya Namah',
          purpose: getTranslation('Appeases Saturn', 'शनि को प्रसन्न करता है'),
          times: '108 times',
          timing: getTranslation('Saturday evening', 'शनिवार शाम')
        }
      ],
      powerful: [
        {
          mantra: 'महामृत्युंजय मंत्र',
          transliteration: 'Mahamrityunjaya Mantra',
          full: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्',
          purpose: getTranslation('Health, protection, spiritual growth', 'स्वास्थ्य, सुरक्षा, आध्यात्मिक विकास'),
          times: '108 times',
          timing: getTranslation('During health issues or daily', 'स्वास्थ्य समस्याओं के दौरान या दैनिक')
        }
      ]
    },
    lifestyle: {
      daily: [
        {
          practice: getTranslation('Early morning meditation', 'प्रातःकालीन ध्यान'),
          timing: '5:30-6:30 AM',
          benefits: getTranslation('Mental clarity, spiritual connection', 'मानसिक स्पष्टता, आध्यात्मिक जुड़ाव'),
          method: getTranslation('Focus on breath or chosen deity', 'सांस या चुने गए देवता पर ध्यान दें')
        },
        {
          practice: getTranslation('Charitable giving', 'दान देना'),
          timing: getTranslation('Every Saturday', 'हर शनिवार'),
          benefits: getTranslation('Reduces negative karma, increases Saturn blessings', 'नकारात्मक कर्म घटाता है, शनि का आशीर्वाद बढ़ाता है'),
          method: getTranslation('Food, clothes, or money to needy', 'जरूरतमंदों को खाना, कपड़े या पैसा')
        },
        {
          practice: getTranslation('Surya Namaskar', 'सूर्य नमस्कार'),
          timing: getTranslation('Sunrise', 'सूर्योदय'),
          benefits: getTranslation('Strengthens Sun, improves vitality', 'सूर्य को मजबूत करता है, जीवन शक्ति बढ़ाता है'),
          method: getTranslation('12 rounds facing east', 'पूर्व की ओर मुंह करके 12 चक्र')
        }
      ],
      dietary: [
        {
          recommendation: getTranslation('Avoid alcohol and non-vegetarian food on Saturdays', 'शनिवार को शराब और मांसाहार से बचें'),
          reason: getTranslation('Strengthens Saturn and spiritual energy', 'शनि और आध्यात्मिक ऊर्जा को मजबूत करता है')
        },
        {
          recommendation: getTranslation('Include turmeric, ginger, and honey in diet', 'आहार में हल्दी, अदरक और शहद शामिल करें'),
          reason: getTranslation('Boosts immunity and planetary strength', 'प्रतिरक्षा और ग्रह शक्ति बढ़ाता है')
        },
        {
          recommendation: getTranslation('Drink water from copper vessel', 'तांबे के बर्तन से पानी पिएं'),
          reason: getTranslation('Enhances Sun energy and purifies blood', 'सूर्य ऊर्जा बढ़ाता है और रक्त शुद्ध करता है')
        }
      ]
    },
    rituals: {
      weekly: [
        {
          day: getTranslation('Monday', 'सोमवार'),
          deity: getTranslation('Lord Shiva', 'भगवान शिव'),
          ritual: getTranslation('Visit Shiva temple, offer milk and water', 'शिव मंदिर जाएं, दूध और पानी चढ़ाएं'),
          benefit: getTranslation('Strengthens Moon, emotional balance', 'चंद्रमा को मजबूत करता है, भावनात्मक संतुलन')
        },
        {
          day: getTranslation('Thursday', 'गुरुवार'),
          deity: getTranslation('Lord Vishnu/Guru', 'भगवान विष्णु/गुरु'),
          ritual: getTranslation('Worship with yellow flowers, offer sweets', 'पीले फूलों से पूजा, मिठाई चढ़ाएं'),
          benefit: getTranslation('Enhances Jupiter, wisdom and prosperity', 'बृहस्पति को बढ़ाता है, ज्ञान और समृद्धि')
        },
        {
          day: getTranslation('Saturday', 'शनिवार'),
          deity: getTranslation('Lord Hanuman/Saturn', 'हनुमान जी/शनि'),
          ritual: getTranslation('Recite Hanuman Chalisa, light mustard oil lamp', 'हनुमान चालीसा पढ़ें, सरसों का तेल दीया जलाएं'),
          benefit: getTranslation('Reduces Saturn malefic effects', 'शनि के हानिकारक प्रभावों को कम करता है')
        }
      ],
      special: [
        {
          occasion: getTranslation('Solar Eclipse', 'सूर्य ग्रहण'),
          practice: getTranslation('Chant mantras, avoid eating', 'मंत्र जाप, खाना न खाएं'),
          duration: getTranslation('During eclipse period', 'ग्रहण काल के दौरान')
        },
        {
          occasion: getTranslation('Saturn Transit', 'शनि गोचर'),
          practice: getTranslation('Increase charitable activities, fasting', 'दान कार्य बढ़ाएं, उपवास'),
          duration: getTranslation('Throughout transit period', 'पूरे गोचर काल में')
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-100">
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Gem className="h-5 w-5" />
            {getTranslation('AI-Powered Smart Remedies', 'AI-संचालित स्मार्ट उपाय')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
              <TabsTrigger value="gemstones" className="flex flex-col items-center gap-1 text-xs p-2">
                <Gem className="h-3 w-3" />
                {getTranslation('Gemstones', 'रत्न')}
              </TabsTrigger>
              <TabsTrigger value="mantras" className="flex flex-col items-center gap-1 text-xs p-2">
                <Sun className="h-3 w-3" />
                {getTranslation('Mantras', 'मंत्र')}
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="flex flex-col items-center gap-1 text-xs p-2">
                <Heart className="h-3 w-3" />
                {getTranslation('Lifestyle', 'जीवनशैली')}
              </TabsTrigger>
              <TabsTrigger value="rituals" className="flex flex-col items-center gap-1 text-xs p-2">
                <Flower className="h-3 w-3" />
                {getTranslation('Rituals', 'अनुष्ठान')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gemstones" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-blue-200">
                  <CardHeader className="bg-blue-50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-blue-800 text-lg">
                        {getTranslation('Primary Gemstone', 'मुख्य रत्न')}
                      </CardTitle>
                      <Badge className="bg-blue-600 text-white">
                        {getTranslation('Highly Recommended', 'अत्यधिक अनुशंसित')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Gem className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-lg">{remedies.gemstones.primary.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>{getTranslation('Planet:', 'ग्रह:')}</strong> {remedies.gemstones.primary.planet}
                    </p>
                    <p className="text-sm">{remedies.gemstones.primary.benefits}</p>
                    <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                      <p className="text-xs"><strong>{getTranslation('How to wear:', 'कैसे पहनें:')}</strong> {remedies.gemstones.primary.wearing}</p>
                      <p className="text-xs"><strong>{getTranslation('Weight:', 'वजन:')}</strong> {remedies.gemstones.primary.weight}</p>
                      <p className="text-xs"><strong>{getTranslation('Substitute:', 'विकल्प:')}</strong> {remedies.gemstones.primary.substitute}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardHeader className="bg-yellow-50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-yellow-800 text-lg">
                        {getTranslation('Secondary Gemstone', 'द्वितीयक रत्न')}
                      </CardTitle>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        {getTranslation('Beneficial', 'लाभकारी')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span className="font-semibold text-lg">{remedies.gemstones.secondary.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>{getTranslation('Planet:', 'ग्रह:')}</strong> {remedies.gemstones.secondary.planet}
                    </p>
                    <p className="text-sm">{remedies.gemstones.secondary.benefits}</p>
                    <div className="bg-yellow-50 p-3 rounded-lg space-y-2">
                      <p className="text-xs"><strong>{getTranslation('How to wear:', 'कैसे पहनें:')}</strong> {remedies.gemstones.secondary.wearing}</p>
                      <p className="text-xs"><strong>{getTranslation('Weight:', 'वजन:')}</strong> {remedies.gemstones.secondary.weight}</p>
                      <p className="text-xs"><strong>{getTranslation('Substitute:', 'विकल्प:')}</strong> {remedies.gemstones.secondary.substitute}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mantras" className="space-y-6">
              <div className="space-y-6">
                <Card className="border-orange-200">
                  <CardHeader className="bg-orange-50">
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <Sun className="h-5 w-5" />
                      {getTranslation('Daily Mantras', 'दैनिक मंत्र')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {remedies.mantras.daily.map((mantra, index) => (
                        <div key={index} className="bg-orange-50 p-4 rounded-lg">
                          <div className="font-semibold text-lg mb-2 text-orange-800">{mantra.mantra}</div>
                          <div className="text-sm text-gray-600 mb-1 italic">{mantra.transliteration}</div>
                          <div className="text-sm mb-2"><strong>{getTranslation('Purpose:', 'उद्देश्य:')}</strong> {mantra.purpose}</div>
                          <div className="flex gap-4 text-xs text-gray-600">
                            <span><strong>{getTranslation('Repetition:', 'दोहराव:')}</strong> {mantra.times}</span>
                            <span><strong>{getTranslation('Timing:', 'समय:')}</strong> {mantra.timing}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {getTranslation('Powerful Mantras', 'शक्तिशाली मंत्र')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {remedies.mantras.powerful.map((mantra, index) => (
                      <div key={index} className="bg-red-50 p-4 rounded-lg">
                        <div className="font-semibold text-lg mb-2 text-red-800">{mantra.mantra}</div>
                        <div className="text-sm text-gray-600 mb-2 italic">{mantra.transliteration}</div>
                        <div className="text-sm mb-2 font-medium">{mantra.full}</div>
                        <div className="text-sm mb-2"><strong>{getTranslation('Purpose:', 'उद्देश्य:')}</strong> {mantra.purpose}</div>
                        <div className="flex gap-4 text-xs text-gray-600">
                          <span><strong>{getTranslation('Repetition:', 'दोहराव:')}</strong> {mantra.times}</span>
                          <span><strong>{getTranslation('When:', 'कब:')}</strong> {mantra.timing}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-6">
              <div className="space-y-6">
                <Card className="border-green-200">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      {getTranslation('Daily Practices', 'दैनिक अभ्यास')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {remedies.lifestyle.daily.map((practice, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg">
                          <div className="font-semibold text-lg mb-2 text-green-800">{practice.practice}</div>
                          <div className="text-sm mb-2"><strong>{getTranslation('Timing:', 'समय:')}</strong> {practice.timing}</div>
                          <div className="text-sm mb-2"><strong>{getTranslation('Benefits:', 'लाभ:')}</strong> {practice.benefits}</div>
                          <div className="text-sm text-gray-600"><strong>{getTranslation('Method:', 'विधि:')}</strong> {practice.method}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-teal-200">
                  <CardHeader className="bg-teal-50">
                    <CardTitle className="text-teal-800 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {getTranslation('Dietary Guidelines', 'आहार दिशानिर्देश')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {remedies.lifestyle.dietary.map((item, index) => (
                        <div key={index} className="bg-teal-50 p-4 rounded-lg">
                          <div className="font-semibold mb-2 text-teal-800">{item.recommendation}</div>
                          <div className="text-sm text-gray-600"><strong>{getTranslation('Reason:', 'कारण:')}</strong> {item.reason}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rituals" className="space-y-6">
              <div className="space-y-6">
                <Card className="border-purple-200">
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="text-purple-800 flex items-center gap-2">
                      <Flower className="h-5 w-5" />
                      {getTranslation('Weekly Rituals', 'साप्ताहिक अनुष्ठान')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {remedies.rituals.weekly.map((ritual, index) => (
                        <div key={index} className="bg-purple-50 p-4 rounded-lg">
                          <div className="font-semibold text-lg mb-2 text-purple-800">{ritual.day}</div>
                          <div className="text-sm mb-2"><strong>{getTranslation('Deity:', 'देवता:')}</strong> {ritual.deity}</div>
                          <div className="text-sm mb-2"><strong>{getTranslation('Ritual:', 'अनुष्ठान:')}</strong> {ritual.ritual}</div>
                          <div className="text-sm text-gray-600"><strong>{getTranslation('Benefit:', 'लाभ:')}</strong> {ritual.benefit}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-indigo-200">
                  <CardHeader className="bg-indigo-50">
                    <CardTitle className="text-indigo-800 flex items-center gap-2">
                      <Moon className="h-5 w-5" />
                      {getTranslation('Special Occasions', 'विशेष अवसर')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {remedies.rituals.special.map((special, index) => (
                        <div key={index} className="bg-indigo-50 p-4 rounded-lg">
                          <div className="font-semibold text-lg mb-2 text-indigo-800">{special.occasion}</div>
                          <div className="text-sm mb-2"><strong>{getTranslation('Practice:', 'अभ्यास:')}</strong> {special.practice}</div>
                          <div className="text-sm text-gray-600"><strong>{getTranslation('Duration:', 'अवधि:')}</strong> {special.duration}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              {getTranslation(
                'These remedies are specifically chosen based on your planetary positions and current life challenges. Consult with a qualified astrologer before implementing gemstone remedies.',
                'ये उपाय विशेष रूप से आपकी ग्रह स्थितियों और वर्तमान जीवन चुनौतियों के आधार पर चुने गए हैं। रत्न उपचार लागू करने से पहले एक योग्य ज्योतिषी से सलाह लें।'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRemedySuggestions;
