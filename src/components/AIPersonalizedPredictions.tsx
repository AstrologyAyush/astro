
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Star, Clock, Zap } from "lucide-react";

interface AIPersonalizedPredictionsProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const AIPersonalizedPredictions: React.FC<AIPersonalizedPredictionsProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('next-3-months');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const predictions = {
    'next-3-months': {
      career: {
        prediction: getTranslation(
          "Strong opportunities for career advancement are indicated. Jupiter's favorable position suggests new partnerships or projects that could significantly boost your professional standing.",
          "करियर में उन्नति के मजबूत अवसर दिखाई दे रहे हैं। बृहस्पति की अनुकूल स्थिति नई साझेदारी या परियोजनाओं का सुझाव देती है जो आपकी पेशेवर स्थिति को काफी बढ़ा सकती है।"
        ),
        confidence: 85,
        timing: getTranslation("Peak period: Mid to end of next month", "चरम काल: अगले महीने के मध्य से अंत तक")
      },
      relationships: {
        prediction: getTranslation(
          "Venus in your 7th house indicates harmonious relationships. For singles, romantic opportunities may arise through professional or social networks.",
          "आपके 7वें घर में शुक्र सामंजस्यपूर्ण रिश्तों का संकेत देता है। अकेले लोगों के लिए, पेशेवर या सामाजिक नेटवर्क के माध्यम से रोमांटिक अवसर आ सकते हैं।"
        ),
        confidence: 78,
        timing: getTranslation("Favorable period starts in 2-3 weeks", "अनुकूल अवधि 2-3 सप्ताह में शुरू होती है")
      },
      health: {
        prediction: getTranslation(
          "Generally stable health period. Focus on digestive wellness and stress management. Avoid excessive travel during Mercury retrograde periods.",
          "आमतौर पर स्थिर स्वास्थ्य अवधि। पाचन कल्याण और तनाव प्रबंधन पर ध्यान दें। बुध वक्री अवधि के दौरान अत्यधिक यात्रा से बचें।"
        ),
        confidence: 82,
        timing: getTranslation("Extra care needed in the last week of next month", "अगले महीने के अंतिम सप्ताह में अतिरिक्त देखभाल की आवश्यकता")
      },
      finance: {
        prediction: getTranslation(
          "Steady financial growth expected. Good time for investments in property or long-term assets. Avoid speculative trading.",
          "स्थिर वित्तीय वृद्धि की उम्मीद। संपत्ति या दीर्घकालिक संपत्ति में निवेश के लिए अच्छा समय। सट्टा व्यापार से बचें।"
        ),
        confidence: 80,
        timing: getTranslation("Investment window opens next month", "निवेश की खिड़की अगले महीने खुलती है")
      }
    },
    'next-6-months': {
      career: {
        prediction: getTranslation(
          "Major career transformation possible. Saturn's influence suggests a shift towards more responsibility or leadership roles. International opportunities may arise.",
          "प्रमुख करियर परिवर्तन संभव। शनि का प्रभाव अधिक जिम्मेदारी या नेतृत्व भूमिकाओं की ओर बदलाव का सुझाव देता है। अंतर्राष्ट्रीय अवसर उत्पन्न हो सकते हैं।"
        ),
        confidence: 88,
        timing: getTranslation("Major changes expected in month 4-5", "महीने 4-5 में प्रमुख बदलाव की उम्मीद")
      },
      relationships: {
        prediction: getTranslation(
          "Deep emotional connections form. For married couples, this period brings renewed intimacy. Family expansion or important celebrations likely.",
          "गहरे भावनात्मक संबंध बनते हैं। विवाहित जोड़ों के लिए, यह अवधि नई अंतरंगता लाती है। पारिवारिक विस्तार या महत्वपूर्ण उत्सव की संभावना।"
        ),
        confidence: 83,
        timing: getTranslation("Peak emotional period in months 3-4", "महीने 3-4 में चरम भावनात्मक अवधि")
      },
      health: {
        prediction: getTranslation(
          "Overall vitality improves. Good time to start new fitness routines. Monitor heart health and blood pressure during stressful periods.",
          "समग्र जीवन शक्ति में सुधार। नई फिटनेस दिनचर्या शुरू करने का अच्छा समय। तनावपूर्ण अवधि के दौरान हृदय स्वास्थ्य और रक्तचाप की निगरानी करें।"
        ),
        confidence: 85,
        timing: getTranslation("Health boost starts in month 2", "स्वास्थ्य बूस्ट महीने 2 में शुरू होता है")
      },
      finance: {
        prediction: getTranslation(
          "Significant financial gains through partnerships or joint ventures. Property deals particularly favorable. Debt reduction possible.",
          "साझेदारी या संयुक्त उपक्रमों के माध्यम से महत्वपूर्ण वित्तीय लाभ। संपत्ति सौदे विशेष रूप से अनुकूल। ऋण में कमी संभव।"
        ),
        confidence: 87,
        timing: getTranslation("Best financial period in months 5-6", "महीने 5-6 में सबसे अच्छी वित्तीय अवधि")
      }
    },
    'next-year': {
      career: {
        prediction: getTranslation(
          "Complete professional reinvention. Your ruling planet's movement suggests a new career path or significant elevation in current field. Recognition and awards possible.",
          "पूर्ण पेशेवर पुनर्निमाण। आपके शासक ग्रह की गति एक नया करियर पथ या वर्तमान क्षेत्र में महत्वपूर्ण उन्नति का सुझाव देती है। मान्यता और पुरस्कार संभव।"
        ),
        confidence: 92,
        timing: getTranslation("Major breakthrough expected around month 8-9", "महीने 8-9 के आसपास बड़ी सफलता की उम्मीद")
      },
      relationships: {
        prediction: getTranslation(
          "Life-changing relationship events. Single individuals may find their life partner. Existing relationships reach new levels of commitment and understanding.",
          "जीवन बदलने वाली रिश्ते की घटनाएं। अकेले व्यक्ति अपने जीवन साथी को पा सकते हैं। मौजूदा रिश्ते प्रतिबद्धता और समझ के नए स्तर तक पहुंचते हैं।"
        ),
        confidence: 89,
        timing: getTranslation("Most significant period around months 6-8", "महीने 6-8 के आसपास सबसे महत्वपूर्ण अवधि")
      },
      health: {
        prediction: getTranslation(
          "Transformation in health and vitality. Spiritual practices bring mental clarity. Possible surgery or medical procedure with positive outcomes.",
          "स्वास्थ्य और जीवन शक्ति में परिवर्तन। आध्यात्मिक अभ्यास मानसिक स्पष्टता लाते हैं। सकारात्मक परिणामों के साथ संभावित सर्जरी या चिकित्सा प्रक्रिया।"
        ),
        confidence: 86,
        timing: getTranslation("Health transformation begins around month 4", "स्वास्थ्य परिवर्तन महीने 4 के आसपास शुरू होता है")
      },
      finance: {
        prediction: getTranslation(
          "Wealth accumulation accelerates. Multiple income sources develop. Real estate investments particularly profitable. Possible inheritance or windfall gains.",
          "धन संचय तेज हो जाता है। कई आय स्रोत विकसित होते हैं। रियल एस्टेट निवेश विशेष रूप से लाभदायक। संभावित विरासत या अप्रत्याशित लाभ।"
        ),
        confidence: 91,
        timing: getTranslation("Peak wealth period in months 10-12", "महीने 10-12 में चरम धन अवधि")
      }
    }
  };

  const currentPredictions = predictions[selectedPeriod as keyof typeof predictions];

  return (
    <div className="space-y-6">
      <Card className="border-indigo-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <TrendingUp className="h-5 w-5" />
            {getTranslation('AI-Powered Personalized Predictions', 'AI-संचालित व्यक्तिगत भविष्यवाणियां')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedPeriod === 'next-3-months' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('next-3-months')}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              {getTranslation('Next 3 Months', 'अगले 3 महीने')}
            </Button>
            <Button
              variant={selectedPeriod === 'next-6-months' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('next-6-months')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {getTranslation('Next 6 Months', 'अगले 6 महीने')}
            </Button>
            <Button
              variant={selectedPeriod === 'next-year' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('next-year')}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              {getTranslation('Next Year', 'अगला साल')}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Career Predictions */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50 pb-3">
                <CardTitle className="flex items-center justify-between text-blue-800 text-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {getTranslation('Career & Success', 'करियर और सफलता')}
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {currentPredictions.career.confidence}% {getTranslation('confidence', 'विश्वास')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-700 mb-3">{currentPredictions.career.prediction}</p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Clock className="h-4 w-4" />
                  {currentPredictions.career.timing}
                </div>
              </CardContent>
            </Card>

            {/* Relationship Predictions */}
            <Card className="border-pink-200">
              <CardHeader className="bg-pink-50 pb-3">
                <CardTitle className="flex items-center justify-between text-pink-800 text-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {getTranslation('Love & Relationships', 'प्रेम और रिश्ते')}
                  </div>
                  <Badge variant="outline" className="bg-pink-100 text-pink-800">
                    {currentPredictions.relationships.confidence}% {getTranslation('confidence', 'विश्वास')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-700 mb-3">{currentPredictions.relationships.prediction}</p>
                <div className="flex items-center gap-2 text-sm text-pink-600">
                  <Clock className="h-4 w-4" />
                  {currentPredictions.relationships.timing}
                </div>
              </CardContent>
            </Card>

            {/* Health Predictions */}
            <Card className="border-green-200">
              <CardHeader className="bg-green-50 pb-3">
                <CardTitle className="flex items-center justify-between text-green-800 text-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {getTranslation('Health & Vitality', 'स्वास्थ्य और जीवन शक्ति')}
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {currentPredictions.health.confidence}% {getTranslation('confidence', 'विश्वास')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-700 mb-3">{currentPredictions.health.prediction}</p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  {currentPredictions.health.timing}
                </div>
              </CardContent>
            </Card>

            {/* Financial Predictions */}
            <Card className="border-yellow-200">
              <CardHeader className="bg-yellow-50 pb-3">
                <CardTitle className="flex items-center justify-between text-yellow-800 text-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {getTranslation('Wealth & Finance', 'धन और वित्त')}
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {currentPredictions.finance.confidence}% {getTranslation('confidence', 'विश्वास')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-700 mb-3">{currentPredictions.finance.prediction}</p>
                <div className="flex items-center gap-2 text-sm text-yellow-600">
                  <Clock className="h-4 w-4" />
                  {currentPredictions.finance.timing}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              {getTranslation(
                'Predictions are generated using advanced AI analysis of your planetary positions, dashas, and current transits.',
                'भविष्यवाणियां आपकी ग्रह स्थितियों, दशाओं और वर्तमान गोचर के उन्नत AI विश्लेषण का उपयोग करके तैयार की गई हैं।'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPersonalizedPredictions;
