
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Target, Book, Heart, Sun, Moon, Star, Lotus } from "lucide-react";

interface AISpiritualGuidanceProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const AISpiritualGuidance: React.FC<AISpiritualGuidanceProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [activeTab, setActiveTab] = useState('life-purpose');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const spiritualData = {
    lifePurpose: {
      primaryDharma: getTranslation(
        'Teacher and Healer - Your soul\'s purpose is to guide and heal others through knowledge and compassion',
        'शिक्षक और चिकित्सक - आपकी आत्मा का उद्देश्य ज्ञान और करुणा के माध्यम से दूसरों का मार्गदर्शन और उपचार करना है'
      ),
      karmicLessons: [
        getTranslation('Learning patience and humility', 'धैर्य और विनम्रता सीखना'),
        getTranslation('Balancing material and spiritual goals', 'भौतिक और आध्यात्मिक लक्ष्यों का संतुलन'),
        getTranslation('Developing unconditional love', 'बिना शर्त प्रेम विकसित करना'),
        getTranslation('Transcending ego and attachment', 'अहंकार और आसक्ति से ऊपर उठना')
      ],
      soulEvolution: {
        currentLevel: getTranslation('Advanced Seeker', 'उन्नत साधक'),
        nextPhase: getTranslation('Spiritual Teacher', 'आध्यात्मिक शिक्षक'),
        progressIndicators: [
          getTranslation('Increasing intuitive abilities', 'बढ़ती अंतर्दृष्टि क्षमताएं'),
          getTranslation('Natural healing presence', 'प्राकृतिक चिकित्सा उपस्थिति'),
          getTranslation('Desire to serve others', 'दूसरों की सेवा की इच्छा')
        ]
      }
    },
    practicesRecommended: {
      daily: [
        {
          practice: getTranslation('Sunrise Meditation', 'सूर्योदय ध्यान'),
          duration: '20-30 minutes',
          timing: getTranslation('Before 7 AM', 'सुबह 7 बजे से पहले'),
          benefits: getTranslation('Connects with solar energy, increases vitality', 'सौर ऊर्जा से जुड़ाव, जीवन शक्ति बढ़ाता है'),
          method: getTranslation('Face east, focus on breath and sun energy', 'पूर्व की ओर मुंह करके, सांस और सूर्य ऊर्जा पर ध्यान दें')
        },
        {
          practice: getTranslation('Gratitude Practice', 'कृतज्ञता अभ्यास'),
          duration: '10 minutes',
          timing: getTranslation('Before sleep', 'सोने से पहले'),
          benefits: getTranslation('Raises vibration, attracts abundance', 'कंपन बढ़ाता है, प्रचुरता आकर्षित करता है'),
          method: getTranslation('Write or think of 5 things you\'re grateful for', '5 चीजें लिखें या सोचें जिनके लिए आप कृतज्ञ हैं')
        },
        {
          practice: getTranslation('Mantra Chanting', 'मंत्र जाप'),
          duration: '15 minutes',
          timing: getTranslation('After meditation', 'ध्यान के बाद'),
          benefits: getTranslation('Purifies mind, enhances spiritual connection', 'मन शुद्ध करता है, आध्यात्मिक जुड़ाव बढ़ाता है'),
          method: getTranslation('108 repetitions of chosen mantra', 'चुने गए मंत्र के 108 जाप')
        }
      ],
      weekly: [
        {
          practice: getTranslation('Fasting and Purification', 'उपवास और शुद्धिकरण'),
          timing: getTranslation('Every Monday or Ekadashi', 'हर सोमवार या एकादशी'),
          description: getTranslation('Consume only fruits, water, and milk', 'केवल फल, पानी और दूध का सेवन')
        },
        {
          practice: getTranslation('Temple/Sacred Space Visit', 'मंदिर/पवित्र स्थान की यात्रा'),
          timing: getTranslation('Friday evenings', 'शुक्रवार शाम'),
          description: getTranslation('Connect with divine energy, offer prayers', 'दिव्य ऊर्जा से जुड़ें, प्रार्थना करें')
        }
      ]
    },
    mantrasForGrowth: [
      {
        mantra: 'ॐ गुरवे नमः',
        transliteration: 'Om Gurave Namah',
        purpose: getTranslation('Connects with inner guru and wisdom', 'आंतरिक गुरु और ज्ञान से जुड़ाव'),
        timing: getTranslation('Daily morning', 'दैनिक सुबह'),
        repetitions: '108 times'
      },
      {
        mantra: 'ॐ श्री राम जय राम जय जय राम',
        transliteration: 'Om Shri Ram Jai Ram Jai Jai Ram',
        purpose: getTranslation('Develops devotion and surrender', 'भक्ति और समर्पण विकसित करता है'),
        timing: getTranslation('Throughout the day', 'दिन भर'),
        repetitions: getTranslation('As many as possible', 'जितना संभव हो')
      },
      {
        mantra: 'सर्वे भवन्तु सुखिनः',
        transliteration: 'Sarve Bhavantu Sukhinah',
        purpose: getTranslation('Cultivates universal love and compassion', 'सार्वभौमिक प्रेम और करुणा की खेती करता है'),
        timing: getTranslation('Before meals', 'भोजन से पहले'),
        repetitions: '3 times'
      }
    ],
    spiritualMilestones: [
      {
        age: '25-30',
        milestone: getTranslation('Spiritual Awakening', 'आध्यात्मिक जागृति'),
        description: getTranslation('Recognition of higher purpose, beginning of conscious journey', 'उच्च उद्देश्य की पहचान, सचेत यात्रा की शुरुआत'),
        signs: [
          getTranslation('Increased intuition', 'बढ़ी हुई अंतर्दृष्टि'),
          getTranslation('Questioning material pursuits', 'भौतिक लक्ष्यों पर सवाल'),
          getTranslation('Seeking deeper meaning', 'गहरे अर्थ की तलाश')
        ]
      },
      {
        age: '30-40',
        milestone: getTranslation('Service and Teaching', 'सेवा और शिक्षा'),
        description: getTranslation('Active involvement in helping others, sharing knowledge', 'दूसरों की मदद में सक्रिय भागीदारी, ज्ञान साझा करना'),
        signs: [
          getTranslation('Natural teaching abilities emerge', 'प्राकृतिक शिक्षण क्षमताएं उभरती हैं'),
          getTranslation('Desire to heal and guide', 'चिकित्सा और मार्गदर्शन की इच्छा'),
          getTranslation('Recognition as spiritual guide', 'आध्यात्मिक मार्गदर्शक के रूप में पहचान')
        ]
      },
      {
        age: '40-50',
        milestone: getTranslation('Wisdom and Mastery', 'ज्ञान और निपुणता'),
        description: getTranslation('Deep spiritual understanding, ability to transform others', 'गहरी आध्यात्मिक समझ, दूसरों को परिवर्तित करने की क्षमता'),
        signs: [
          getTranslation('Profound inner peace', 'गहरी आंतरिक शांति'),
          getTranslation('Miraculous healing abilities', 'चमत्कारी चिकित्सा क्षमताएं'),
          getTranslation('Students and followers seeking guidance', 'मार्गदर्शन पाने वाले छात्र और अनुयायी')
        ]
      }
    ],
    chakraAlignment: {
      primary: getTranslation('Heart Chakra (Anahata)', 'हृदय चक्र (अनाहत)'),
      secondary: getTranslation('Throat Chakra (Vishuddha)', 'कंठ चक्र (विशुद्ध)'),
      focus: [
        getTranslation('Developing unconditional love', 'बिना शर्त प्रेम विकसित करना'),
        getTranslation('Clear communication of truth', 'सत्य का स्पष्ट संचार'),
        getTranslation('Balancing giving and receiving', 'देना और लेना का संतुलन')
      ]
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100 via-indigo-100 to-violet-100">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Sparkles className="h-5 w-5" />
            {getTranslation('AI Spiritual Guidance & Soul Purpose', 'AI आध्यात्मिक मार्गदर्शन और आत्मा का उद्देश्य')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
              <TabsTrigger value="life-purpose" className="flex flex-col items-center gap-1 text-xs p-2">
                <Target className="h-3 w-3" />
                {getTranslation('Soul Purpose', 'आत्मा का उद्देश्य')}
              </TabsTrigger>
              <TabsTrigger value="practices" className="flex flex-col items-center gap-1 text-xs p-2">
                <Lotus className="h-3 w-3" />
                {getTranslation('Practices', 'अभ्यास')}
              </TabsTrigger>
              <TabsTrigger value="mantras" className="flex flex-col items-center gap-1 text-xs p-2">
                <Book className="h-3 w-3" />
                {getTranslation('Sacred Mantras', 'पवित्र मंत्र')}
              </TabsTrigger>
              <TabsTrigger value="evolution" className="flex flex-col items-center gap-1 text-xs p-2">
                <Star className="h-3 w-3" />
                {getTranslation('Soul Evolution', 'आत्मा का विकास')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="life-purpose" className="space-y-6">
              <Card className="border-gold-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    {getTranslation('Your Divine Life Purpose', 'आपका दिव्य जीवन उद्देश्य')}
                  </h3>
                  <p className="text-orange-700 mb-6 text-lg leading-relaxed">
                    {spiritualData.lifePurpose.primaryDharma}
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-3">
                        {getTranslation('Karmic Lessons to Master', 'मास्टर करने के लिए कर्मिक पाठ')}
                      </h4>
                      <ul className="space-y-2">
                        {spiritualData.lifePurpose.karmicLessons.map((lesson, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <Heart className="h-3 w-3 text-orange-600" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-3">
                        {getTranslation('Soul Evolution Status', 'आत्मा विकास स्थिति')}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{getTranslation('Current Level:', 'वर्तमान स्तर:')}</span>
                          <Badge className="bg-orange-600 text-white">
                            {spiritualData.lifePurpose.soulEvolution.currentLevel}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{getTranslation('Next Phase:', 'अगला चरण:')}</span>
                          <Badge variant="outline" className="border-orange-600 text-orange-600">
                            {spiritualData.lifePurpose.soulEvolution.nextPhase}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-2">{getTranslation('Progress Signs:', 'प्रगति के संकेत:')}</h5>
                        <ul className="space-y-1">
                          {spiritualData.lifePurpose.soulEvolution.progressIndicators.map((indicator, idx) => (
                            <li key={idx} className="text-xs flex items-center gap-2">
                              <Star className="h-2 w-2 text-orange-500" />
                              {indicator}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-200 bg-indigo-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {getTranslation('Chakra Alignment Focus', 'चक्र संरेखण फोकस')}
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <span className="text-sm font-medium">{getTranslation('Primary Focus:', 'प्राथमिक फोकस:')}</span>
                      <p className="text-sm text-indigo-700">{spiritualData.chakraAlignment.primary}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">{getTranslation('Secondary Focus:', 'द्वितीयक फोकस:')}</span>
                      <p className="text-sm text-indigo-700">{spiritualData.chakraAlignment.secondary}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h5 className="text-sm font-medium mb-2">{getTranslation('Development Areas:', 'विकास क्षेत्र:')}</h5>
                    <ul className="space-y-1">
                      {spiritualData.chakraAlignment.focus.map((area, idx) => (
                        <li key={idx} className="text-xs flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practices" className="space-y-6">
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    {getTranslation('Daily Spiritual Practices', 'दैनिक आध्यात्मिक अभ्यास')}
                  </h4>
                  <div className="space-y-4">
                    {spiritualData.practicesRecommended.daily.map((practice, idx) => (
                      <div key={idx} className="border border-emerald-200 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-emerald-800">{practice.practice}</h5>
                          <Badge variant="outline" className="text-xs">{practice.duration}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>{getTranslation('Best Time:', 'सर्वोत्तम समय:')}</strong> {practice.timing}
                        </p>
                        <p className="text-sm mb-2">
                          <strong>{getTranslation('Benefits:', 'लाभ:')}</strong> {practice.benefits}
                        </p>
                        <p className="text-xs text-emerald-700">
                          <strong>{getTranslation('Method:', 'विधि:')}</strong> {practice.method}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    {getTranslation('Weekly Spiritual Observances', 'साप्ताहिक आध्यात्मिक अनुष्ठान')}
                  </h4>
                  <div className="space-y-3">
                    {spiritualData.practicesRecommended.weekly.map((practice, idx) => (
                      <div key={idx} className="border border-blue-200 rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-blue-800">{practice.practice}</h5>
                          <span className="text-xs text-blue-600">{practice.timing}</span>
                        </div>
                        <p className="text-sm text-gray-600">{practice.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mantras" className="space-y-6">
              <div className="space-y-4">
                {spiritualData.mantrasForGrowth.map((mantra, idx) => (
                  <Card key={idx} className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <h4 className="text-xl font-bold text-purple-800 mb-2">{mantra.mantra}</h4>
                        <p className="text-sm text-purple-600 italic">{mantra.transliteration}</p>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <h5 className="font-medium text-purple-800 mb-1">{getTranslation('Purpose:', 'उद्देश्य:')}</h5>
                          <p className="text-sm text-gray-700">{mantra.purpose}</p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">{getTranslation('Best Time:', 'सर्वोत्तम समय:')}</span>
                            <span className="text-sm text-gray-600 ml-2">{mantra.timing}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">{getTranslation('Repetitions:', 'दोहराव:')}</span>
                            <span className="text-sm text-gray-600 ml-2">{mantra.repetitions}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="evolution" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-violet-800 mb-4">
                  {getTranslation('Spiritual Evolution Timeline', 'आध्यात्मिक विकास समयरेखा')}
                </h3>
                {spiritualData.spiritualMilestones.map((milestone, idx) => (
                  <Card key={idx} className="border-violet-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Badge className="bg-violet-600 text-white">{milestone.age}</Badge>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-violet-800 mb-2">{milestone.milestone}</h4>
                          <p className="text-sm text-gray-700 mb-3">{milestone.description}</p>
                          <div>
                            <h5 className="text-sm font-medium text-violet-700 mb-2">
                              {getTranslation('Key Signs:', 'मुख्य संकेत:')}
                            </h5>
                            <ul className="space-y-1">
                              {milestone.signs.map((sign, signIdx) => (
                                <li key={signIdx} className="text-xs flex items-center gap-2">
                                  <Star className="h-2 w-2 text-violet-500" />
                                  {sign}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISpiritualGuidance;
