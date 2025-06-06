
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Target, Star } from 'lucide-react';

interface FeatureCardsProps {
  language: 'hi' | 'en';
  kundaliData: any;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ language, kundaliData }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  if (kundaliData) return null; // Don't show when kundali is generated

  return (
    <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
      <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <Crown className="h-10 w-10 md:h-12 md:w-12 mx-auto text-orange-500 mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2 text-orange-800">
            {getTranslation('Swiss Ephemeris Precision', 'Swiss Ephemeris सटीकता')}
          </h3>
          <p className="text-gray-600 text-sm">
            {getTranslation(
              'NASA-grade accuracy for planetary positions and yoga calculations',
              'NASA ग्रेड सटीकता के साथ ग्रह स्थिति और योग गणना'
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <Target className="h-10 w-10 md:h-12 md:w-12 mx-auto text-blue-500 mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2 text-blue-800">
            {getTranslation('Rishi Parasher Guidance', 'पं. ऋषि पराशर मार्गदर्शन')}
          </h3>
          <p className="text-gray-600 text-sm">
            {getTranslation(
              'Personalized consultation based on the great sage of Vedic astrology principles',
              'वैदिक ज्योतिष के महान गुरु के सिद्धांतों पर आधारित व्यक्तिगत परामर्श'
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <Star className="h-10 w-10 md:h-12 md:w-12 mx-auto text-green-500 mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2 text-green-800">
            {getTranslation('90+ Page Analysis', '90+ पेज विश्लेषण')}
          </h3>
          <p className="text-gray-600 text-sm">
            {getTranslation(
              'Complete life analysis with remedies and predictions',
              'संपूर्ण जीवन विश्लेषण, उपाय और भविष्यवाणी के साथ'
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCards;
