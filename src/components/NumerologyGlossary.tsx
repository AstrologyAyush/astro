
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Info } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const NumerologyGlossary: React.FC = () => {
  const { language } = useLanguage();

  const getText = (en: string, hi: string) => language === 'hi' ? hi : en;

  const glossaryTerms = [
    {
      term: getText('Life Path Number', 'मूलांक'),
      definition: getText(
        'Your primary life purpose and the path you are meant to walk. Calculated from your birth date.',
        'आपका मुख्य जीवन उद्देश्य और वह मार्ग जिस पर आपको चलना है। जन्म तिथि से गणना की जाती है।'
      ),
      category: getText('Core Numbers', 'मुख्य संख्याएं')
    },
    {
      term: getText('Expression Number', 'भाग्यांक'),
      definition: getText(
        'Your natural talents, abilities, and what you came here to express. Calculated from your full birth name.',
        'आपकी प्राकृतिक प्रतिभाएं, क्षमताएं और जो आप यहाँ व्यक्त करने आए हैं। पूरे जन्म नाम से गणना।'
      ),
      category: getText('Core Numbers', 'मुख्य संख्याएं')
    },
    {
      term: getText('Soul Urge Number', 'अंतरांक'),
      definition: getText(
        'Your inner motivation, deepest desires, and what drives you from within. Calculated from vowels in your name.',
        'आपकी आंतरिक प्रेरणा, गहरी इच्छाएं और जो आपको भीतर से प्रेरित करता है। नाम के स्वरों से गणना।'
      ),
      category: getText('Core Numbers', 'मुख्य संख्याएं')
    },
    {
      term: getText('Personality Number', 'व्यक्तित्व संख्या'),
      definition: getText(
        'How others perceive you and the image you project to the world. Calculated from consonants in your name.',
        'दूसरे आपको कैसे देखते हैं और आप दुनिया के सामने कैसी छवि प्रस्तुत करते हैं। नाम के व्यंजनों से गणना।'
      ),
      category: getText('Core Numbers', 'मुख्य संख्याएं')
    },
    {
      term: getText('Birthday Number', 'जन्मदिन संख्या'),
      definition: getText(
        'Your special gift or talent that supports your life path. Simply the day you were born.',
        'आपका विशेष उपहार या प्रतिभा जो आपके जीवन पथ का समर्थन करती है। केवल आपका जन्म दिन।'
      ),
      category: getText('Core Numbers', 'मुख्य संख्याएं')
    },
    {
      term: getText('Maturity Number', 'परिपक्वता संख्या'),
      definition: getText(
        'What becomes increasingly important in your later years. Sum of Life Path and Expression numbers.',
        'जो आपके बाद के वर्षों में अधिक महत्वपूर्ण होता जाता है। मूलांक और भाग्यांक का योग।'
      ),
      category: getText('Core Numbers', 'मुख्य संख्याएं')
    },
    {
      term: getText('Personal Year', 'व्यक्तिगत वर्ष'),
      definition: getText(
        'The energy and theme that influences your current year. Changes annually based on your birth date.',
        'वह ऊर्जा और विषय जो आपके वर्तमान वर्ष को प्रभावित करता है। जन्म तिथि के आधार पर वार्षिक बदलाव।'
      ),
      category: getText('Cycles', 'चक्र')
    },
    {
      term: getText('Pinnacle Numbers', 'शिखर संख्याएं'),
      definition: getText(
        'Four major life phases representing opportunities and challenges during different periods of your life.',
        'जीवन के चार मुख्य चरण जो आपके जीवन की विभिन्न अवधियों में अवसरों और चुनौतियों का प्रतिनिधित्व करते हैं।'
      ),
      category: getText('Life Cycles', 'जीवन चक्र')
    },
    {
      term: getText('Challenge Numbers', 'चुनौती संख्याएं'),
      definition: getText(
        'Obstacles or lessons you need to overcome during different life phases for personal growth.',
        'व्यक्तिगत विकास के लिए जीवन के विभिन्न चरणों में आपको जो बाधाओं या सबक से गुजरना है।'
      ),
      category: getText('Life Cycles', 'जीवन चक्र')
    },
    {
      term: getText('Karmic Debt', 'कर्म ऋण'),
      definition: getText(
        'Special numbers (13, 14, 16, 19) indicating lessons from past lives that need to be resolved.',
        'विशेष संख्याएं (13, 14, 16, 19) जो पिछले जन्मों के सबक को दर्शाती हैं जिन्हें हल करना आवश्यक है।'
      ),
      category: getText('Karmic', 'कर्मिक')
    },
    {
      term: getText('Missing Numbers', 'अनुपस्थित संख्याएं'),
      definition: getText(
        'Numbers absent from your name that represent qualities you may need to develop in this lifetime.',
        'आपके नाम में अनुपस्थित संख्याएं जो उन गुणों का प्रतिनिधित्व करती हैं जिन्हें आपको इस जीवन में विकसित करना चाहिए।'
      ),
      category: getText('Karmic', 'कर्मिक')
    },
    {
      term: getText('Master Numbers', 'गुरु संख्याएं'),
      definition: getText(
        'Special double-digit numbers (11, 22, 33) with heightened spiritual significance and greater potential.',
        'विशेष दो अंकों की संख्याएं (11, 22, 33) जिनमें उच्च आध्यात्मिक महत्व और अधिक क्षमता है।'
      ),
      category: getText('Special Numbers', 'विशेष संख्याएं')
    },
    {
      term: getText('Personality Archetype', 'व्यक्तित्व आदर्श'),
      definition: getText(
        'A detailed character profile based on your core numbers, describing your strengths, challenges, and life theme.',
        'आपकी मुख्य संख्याओं के आधार पर विस्तृत चरित्र प्रोफाइल, जो आपकी शक्तियों, चुनौतियों और जीवन विषय का वर्णन करती है।'
      ),
      category: getText('Analysis', 'विश्लेषण')
    },
    {
      term: getText('Numerology Compatibility', 'अंकज्योतिष संगतता'),
      definition: getText(
        'Analysis of how two people\'s numbers interact to determine relationship harmony and potential challenges.',
        'दो लोगों की संख्याओं का विश्लेषण यह निर्धारित करने के लिए कि रिश्ते में सामंजस्य और संभावित चुनौतियां क्या हैं।'
      ),
      category: getText('Relationships', 'रिश्ते')
    },
    {
      term: getText('Pythagorean System', 'पाइथागोरसीय पद्धति'),
      definition: getText(
        'The most common numerology system using numbers 1-9, assigning numerical values to letters A-Z.',
        'सबसे आम अंकज्योतिष पद्धति जो 1-9 संख्याओं का उपयोग करती है, A-Z अक्षरों को संख्यात्मक मान प्रदान करती है।'
      ),
      category: getText('Systems', 'पद्धतियां')
    }
  ];

  const categories = [...new Set(glossaryTerms.map(term => term.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <BookOpen className="h-5 w-5" />
          {getText('Numerology Glossary', 'अंकज्योतिष शब्दकोश')}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {getText(
            'Understanding the key terms and concepts used in numerology analysis',
            'अंकज्योतिष विश्लेषण में उपयोग किए जाने वाले मुख्य शब्दों और अवधारणाओं को समझना'
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold text-gray-800">{category}</h3>
            </div>
            
            <div className="grid gap-3">
              {glossaryTerms
                .filter(term => term.category === category)
                .map((term, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                        {term.term}
                      </h4>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {term.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                ))}
            </div>
            
            {categoryIndex < categories.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {getText('Important Note', 'महत्वपूर्ण सूचना')}
          </h4>
          <p className="text-sm text-blue-700">
            {getText(
              'Numerology is a tool for self-understanding and guidance. These interpretations are based on ancient wisdom and should be used as insights for personal growth and reflection.',
              'अंकज्योतिष आत्म-समझ और मार्गदर्शन का एक उपकरण है। ये व्याख्याएं प्राचीन ज्ञान पर आधारित हैं और व्यक्तिगत विकास और चिंतन के लिए अंतर्दृष्टि के रूप में उपयोग की जानी चाहिए।'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NumerologyGlossary;
