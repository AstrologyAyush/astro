
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NumerologyProfile } from '@/lib/numerologyUtils';
import { Star, Heart, Briefcase, Users, Clock, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NumerologyInsightsProps {
  profile: NumerologyProfile;
  language: 'hi' | 'en';
}

const NumerologyInsights: React.FC<NumerologyInsightsProps> = ({ profile, language }) => {
  const { t } = useLanguage();

  const getLifePathInsights = (number: number) => {
    const insights = {
      1: {
        purpose: language === 'hi' ? "नेतृत्व और स्वतंत्रता के माध्यम से दुनिया का नेतृत्व करना" : "To lead and inspire others through independence and innovation",
        strengths: language === 'hi' ? "प्राकृतिक नेता, अग्रणी, निर्णायक" : "Natural leader, pioneer, decisive",
        challenges: language === 'hi' ? "अधीरता, अहंकार, अकेलापन" : "Impatience, ego, loneliness",
        careerPath: language === 'hi' ? "उद्यमी, सीईओ, राजनेता, आविष्कारक" : "Entrepreneur, CEO, politician, inventor",
        loveStyle: language === 'hi' ? "स्वतंत्र प्रेमी, नेतृत्व चाहते हैं" : "Independent lover, needs to lead in relationships"
      },
      2: {
        purpose: language === 'hi' ? "सहयोग और शांति के माध्यम से दूसरों की सेवा करना" : "To serve others through cooperation and bringing peace",
        strengths: language === 'hi' ? "कूटनीतिक, संवेदनशील, सहयोगी" : "Diplomatic, sensitive, cooperative",
        challenges: language === 'hi' ? "अत्यधिक संवेदनशीलता, निर्णय लेने में कठिनाई" : "Over-sensitivity, difficulty making decisions",
        careerPath: language === 'hi' ? "परामर्शदाता, शिक्षक, मध्यस्थ, चिकित्सक" : "Counselor, teacher, mediator, therapist",
        loveStyle: language === 'hi' ? "रोमांटिक, भावनात्मक गहराई चाहते हैं" : "Romantic, seeks emotional depth"
      },
      3: {
        purpose: language === 'hi' ? "रचनात्मकता और संवाद के माध्यम से दुनिया को प्रेरित करना" : "To inspire the world through creativity and communication",
        strengths: language === 'hi' ? "रचनात्मक, अभिव्यंजक, आशावादी" : "Creative, expressive, optimistic",
        challenges: language === 'hi' ? "बिखराव, सतही व्यवहार" : "Scattered energy, superficiality",
        careerPath: language === 'hi' ? "कलाकार, लेखक, अभिनेता, डिजाइनर" : "Artist, writer, actor, designer",
        loveStyle: language === 'hi' ? "मजेदार, सामाजिक, विविधता चाहते हैं" : "Fun-loving, social, needs variety"
      },
      4: {
        purpose: language === 'hi' ? "अनुशासन और कड़ी मेहनत के माध्यम से स्थिर आधार बनाना" : "To build stable foundations through discipline and hard work",
        strengths: language === 'hi' ? "व्यवस्थित, विश्वसनीय, मेहनती" : "Organized, reliable, hardworking",
        challenges: language === 'hi' ? "कठोरता, बदलाव का डर" : "Rigidity, fear of change",
        careerPath: language === 'hi' ? "इंजीनियर, अकाउंटेंट, प्रबंधक, वास्तुकार" : "Engineer, accountant, manager, architect",
        loveStyle: language === 'hi' ? "वफादार, स्थिर रिश्ते चाहते हैं" : "Loyal, seeks stable relationships"
      },
      5: {
        purpose: language === 'hi' ? "स्वतंत्रता और अनुभव के माध्यम से दुनिया का अन्वेषण करना" : "To explore the world through freedom and experience",
        strengths: language === 'hi' ? "साहसिक, बहुमुखी, जिज्ञासु" : "Adventurous, versatile, curious",
        challenges: language === 'hi' ? "अस्थिरता, जिम्मेदारी से बचना" : "Instability, avoiding responsibility",
        careerPath: language === 'hi' ? "यात्रा एजेंट, पत्रकार, सेल्स, अन्वेषक" : "Travel agent, journalist, sales, explorer",
        loveStyle: language === 'hi' ? "स्वतंत्रता चाहते हैं, विविधता पसंद" : "Needs freedom, loves variety"
      },
      6: {
        purpose: language === 'hi' ? "देखभाल और सेवा के माध्यम से परिवार और समुदाय की सेवा करना" : "To serve family and community through care and nurturing",
        strengths: language === 'hi' ? "पोषणकर्ता, जिम्मेदार, प्रेमपूर्ण" : "Nurturing, responsible, loving",
        challenges: language === 'hi' ? "अत्यधिक नियंत्रण, शहीद की भावना" : "Over-controlling, martyr complex",
        careerPath: language === 'hi' ? "डॉक्टर, नर्स, परामर्शदाता, शिक्षक" : "Doctor, nurse, counselor, teacher",
        loveStyle: language === 'hi' ? "देखभाल करने वाला, पारिवारिक" : "Caring, family-oriented"
      },
      7: {
        purpose: language === 'hi' ? "आध्यात्मिकता और ज्ञान के माध्यम से सत्य की खोज करना" : "To seek truth through spirituality and knowledge",
        strengths: language === 'hi' ? "बुद्धिमान, आध्यात्मिक, विश्लेषणात्मक" : "Wise, spiritual, analytical",
        challenges: language === 'hi' ? "अकेलापन, संदेह" : "Loneliness, skepticism",
        careerPath: language === 'hi' ? "शोधकर्ता, आध्यात्मिक शिक्षक, वैज्ञानिक" : "Researcher, spiritual teacher, scientist",
        loveStyle: language === 'hi' ? "गहरा कनेक्शन चाहते हैं, बौद्धिक साझेदारी" : "Seeks deep connection, intellectual partnership"
      },
      8: {
        purpose: language === 'hi' ? "शक्ति और भौतिक सफलता के माध्यम से दुनिया पर प्रभाव डालना" : "To impact the world through power and material success",
        strengths: language === 'hi' ? "शक्तिशाली, लक्ष्य-उन्मुख, अधिकारी" : "Powerful, goal-oriented, authoritative",
        challenges: language === 'hi' ? "भौतिकवाद, शक्ति का दुरुपयोग" : "Materialism, power abuse",
        careerPath: language === 'hi' ? "व्यापारिक कार्यकारी, बैंकर, रियल एस्टेट" : "Business executive, banker, real estate",
        loveStyle: language === 'hi' ? "महत्वाकांक्षी साझेदारी, स्थिति-सचेत" : "Ambitious partnership, status-conscious"
      },
      9: {
        purpose: language === 'hi' ? "करुणा और सेवा के माध्यम से मानवता की सेवा करना" : "To serve humanity through compassion and universal service",
        strengths: language === 'hi' ? "करुणामय, आदर्शवादी, व्यापक सोच" : "Compassionate, idealistic, broad-minded",
        challenges: language === 'hi' ? "भोलापन, भावनात्मक अस्थिरता" : "Naivety, emotional instability",
        careerPath: language === 'hi' ? "मानवतावादी, एनजीओ कार्यकर्ता, परोपकारी" : "Humanitarian, NGO worker, philanthropist",
        loveStyle: language === 'hi' ? "प्रेमपूर्ण, समझदार, आध्यात्मिक कनेक्शन" : "Loving, understanding, spiritual connection"
      }
    };
    
    return insights[number as keyof typeof insights] || insights[1];
  };

  const getPersonalYearGuidance = (year: number) => {
    const guidance = {
      1: language === 'hi' ? "नई शुरुआत का साल - नए प्रोजेक्ट शुरू करें" : "Year of new beginnings - start new projects",
      2: language === 'hi' ? "सहयोग और धैर्य का साल - रिश्तों पर फोकस करें" : "Year of cooperation and patience - focus on relationships",
      3: language === 'hi' ? "रचनात्मकता और संवाद का साल - अपनी प्रतिभा व्यक्त करें" : "Year of creativity and communication - express your talents",
      4: language === 'hi' ? "कड़ी मेहनत और आधार निर्माण का साल" : "Year of hard work and building foundations",
      5: language === 'hi' ? "बदलाव और स्वतंत्रता का साल - नए अनुभव करें" : "Year of change and freedom - seek new experiences",
      6: language === 'hi' ? "परिवार और जिम्मेदारी का साल" : "Year of family and responsibility",
      7: language === 'hi' ? "आध्यात्मिक खोज और आत्म-चिंतन का साल" : "Year of spiritual seeking and self-reflection",
      8: language === 'hi' ? "भौतिक सफलता और उपलब्धि का साल" : "Year of material success and achievement",
      9: language === 'hi' ? "समापन और नई तैयारी का साल" : "Year of completion and preparation for new cycles"
    };
    
    return guidance[year as keyof typeof guidance] || guidance[1];
  };

  const lifePathInsights = getLifePathInsights(profile.lifePath);

  return (
    <div className="space-y-3 md:space-y-6 px-1 md:px-0">
      {/* Life Purpose & Destiny */}
      <Card className="shadow-md">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-purple-700 text-base md:text-lg">
            <Star className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-base">
              {t('your_life_purpose')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
          <div className="bg-purple-50 p-3 md:p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm md:text-base">
              {t('life_path')} {profile.lifePath}: {t('your_main_purpose')}
            </h4>
            <p className="text-purple-700 text-xs md:text-sm mb-3 leading-relaxed">
              {lifePathInsights.purpose}
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <h5 className="font-medium text-green-700 mb-1 text-xs md:text-sm">
                  {t('your_strengths')}
                </h5>
                <p className="text-xs md:text-sm text-green-600">{lifePathInsights.strengths}</p>
              </div>
              <div>
                <h5 className="font-medium text-orange-700 mb-1 text-xs md:text-sm">
                  {t('challenges_to_overcome')}
                </h5>
                <p className="text-xs md:text-sm text-orange-600">{lifePathInsights.challenges}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career & Money Guidance */}
      <Card className="shadow-md">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-green-700 text-base md:text-lg">
            <Briefcase className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-base">
              {t('career_money_guidance')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
          <div className="bg-green-50 p-3 md:p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2 text-sm md:text-base">
              {t('ideal_career_path')}
            </h4>
            <p className="text-green-700 text-xs md:text-sm mb-3 leading-relaxed">
              {lifePathInsights.careerPath}
            </p>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <h5 className="font-medium text-yellow-800 mb-1 text-xs md:text-sm">
                {t('money_advice')}
              </h5>
              <p className="text-xs md:text-sm text-yellow-700">
                {profile.lifePath === 8 ? 
                  (language === 'hi' ? "आपको व्यापार और निवेश में सफलता मिलेगी" : "You'll succeed in business and investments") :
                  profile.lifePath === 4 ?
                  (language === 'hi' ? "धीमी लेकिन स्थिर संपत्ति निर्माण" : "Slow but steady wealth building") :
                  (language === 'hi' ? "रचनात्मक कार्यों से आर्थिक लाभ" : "Financial gains through creative work")
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Love & Relationships */}
      <Card className="shadow-md">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-pink-700 text-base md:text-lg">
            <Heart className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-base">
              {t('love_relationships')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
          <div className="bg-pink-50 p-3 md:p-4 rounded-lg">
            <h4 className="font-semibold text-pink-800 mb-2 text-sm md:text-base">
              {t('your_love_style')}
            </h4>
            <p className="text-pink-700 text-xs md:text-sm mb-3 leading-relaxed">
              {lifePathInsights.loveStyle}
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-red-50 p-3 rounded">
                <h5 className="font-medium text-red-700 mb-1 text-xs md:text-sm">
                  {t('best_match')}
                </h5>
                <div className="flex gap-1 flex-wrap">
                  {getCompatibleNumbers(profile.lifePath).map(num => (
                    <Badge key={num} variant="outline" className="bg-red-100 text-red-700 text-xs">
                      {num}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <h5 className="font-medium text-blue-700 mb-1 text-xs md:text-sm">
                  {t('relationship_advice')}
                </h5>
                <p className="text-xs text-blue-600 leading-relaxed">
                  {getRelationshipAdvice(profile.lifePath, language)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Year Guidance */}
      <Card className="shadow-md">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-blue-700 text-base md:text-lg">
            <Clock className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-base">
              {t('2025_guidance')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
          <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">
              {t('personal_year_2025').replace('2025', profile.personalYear.toString())}
            </h4>
            <p className="text-blue-700 text-xs md:text-sm mb-3 leading-relaxed">
              {getPersonalYearGuidance(profile.personalYear)}
            </p>
            <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
              <h5 className="font-medium text-indigo-800 mb-1 text-xs md:text-sm">
                {t('important_months')}
              </h5>
              <p className="text-xs md:text-sm text-indigo-700">
                {t('march_june_september')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Life Guidance */}
      <Card className="shadow-md">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-orange-700 text-base md:text-lg">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-base">
              {t('daily_life_guidance')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            <div className="bg-orange-50 p-3 md:p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2 text-sm md:text-base">
                {t('lucky_days')}
              </h4>
              <div className="flex gap-1 mb-2 flex-wrap">
                {getLuckyDays(profile.lifePath).map(day => (
                  <Badge key={day} className="bg-orange-200 text-orange-800 text-xs">{day}</Badge>
                ))}
              </div>
              <p className="text-xs text-orange-600 leading-relaxed">
                {t('make_important_decisions')}
              </p>
            </div>
            <div className="bg-teal-50 p-3 md:p-4 rounded-lg">
              <h4 className="font-semibold text-teal-800 mb-2 text-sm md:text-base">
                {t('lucky_colors')}
              </h4>
              <div className="flex gap-1 mb-2">
                {getLuckyColors(profile.lifePath).map(color => (
                  <div key={color} className="w-5 h-5 md:w-6 md:h-6 rounded border" style={{backgroundColor: color.toLowerCase()}}></div>
                ))}
              </div>
              <p className="text-xs text-teal-600 leading-relaxed">
                {t('use_these_colors')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
const getCompatibleNumbers = (lifePath: number): number[] => {
  const compatibility: Record<number, number[]> = {
    1: [2, 5, 9], 2: [1, 3, 6, 8], 3: [2, 6, 9], 4: [6, 7, 8], 
    5: [1, 7, 9], 6: [2, 3, 4, 8, 9], 7: [4, 5], 8: [2, 4, 6], 9: [1, 3, 5, 6]
  };
  return compatibility[lifePath] || [1, 5, 9];
};

const getRelationshipAdvice = (lifePath: number, language: 'hi' | 'en'): string => {
  const advice: Record<number, {hi: string, en: string}> = {
    1: {hi: "नेतृत्व और स्वतंत्रता को संतुलित करें", en: "Balance leadership with partnership"},
    2: {hi: "अपनी भावनाओं को स्पष्ट रूप से व्यक्त करें", en: "Express your emotions clearly"},
    3: {hi: "गहरे कनेक्शन पर फोकस करें", en: "Focus on deeper connections"},
    4: {hi: "लचीलापन अपनाएं", en: "Practice flexibility"},
    5: {hi: "प्रतिबद्धता का अभ्यास करें", en: "Practice commitment"},
    6: {hi: "अपना भी ख्याल रखें", en: "Take care of yourself too"},
    7: {hi: "खुला संवाद करें", en: "Communicate openly"},
    8: {hi: "भावनात्मक कनेक्शन को प्राथमिकता दें", en: "Prioritize emotional connection"},
    9: {hi: "व्यावहारिक सीमाएं निर्धारित करें", en: "Set practical boundaries"}
  };
  return language === 'hi' ? advice[lifePath]?.hi || advice[1].hi : advice[lifePath]?.en || advice[1].en;
};

const getLuckyDays = (lifePath: number): string[] => {
  const days: Record<number, string[]> = {
    1: ['Sun', 'Mon'], 2: ['Mon', 'Fri'], 3: ['Wed', 'Thu'], 4: ['Sat', 'Sun'],
    5: ['Wed', 'Fri'], 6: ['Fri', 'Sat'], 7: ['Mon', 'Tue'], 8: ['Sat', 'Thu'], 9: ['Tue', 'Thu']
  };
  return days[lifePath] || ['Sun', 'Wed'];
};

const getLuckyColors = (lifePath: number): string[] => {
  const colors: Record<number, string[]> = {
    1: ['Red', 'Orange'], 2: ['White', 'Silver'], 3: ['Yellow', 'Gold'], 4: ['Blue', 'Grey'],
    5: ['Green', 'Turquoise'], 6: ['Pink', 'Rose'], 7: ['Purple', 'Violet'], 8: ['Black', 'Brown'], 9: ['Red', 'Crimson']
  };
  return colors[lifePath] || ['Red', 'Gold'];
};

export default NumerologyInsights;
