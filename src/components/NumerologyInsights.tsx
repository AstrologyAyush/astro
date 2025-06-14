
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NumerologyProfile } from '@/lib/numerologyUtils';
import { Star, Heart, Briefcase, Users, Clock, TrendingUp } from 'lucide-react';

interface NumerologyInsightsProps {
  profile: NumerologyProfile;
  language: 'hi' | 'en';
}

const NumerologyInsights: React.FC<NumerologyInsightsProps> = ({ profile, language }) => {
  const getText = (hi: string, en: string) => language === 'hi' ? hi : en;

  const getLifePathInsights = (number: number) => {
    const insights = {
      1: {
        purpose: getText("नेतृत्व और स्वतंत्रता के माध्यम से दुनिया का नेतृत्व करना", "To lead and inspire others through independence and innovation"),
        strengths: getText("प्राकृतिक नेता, अग्रणी, निर्णायक", "Natural leader, pioneer, decisive"),
        challenges: getText("अधीरता, अहंकार, अकेलापन", "Impatience, ego, loneliness"),
        careerPath: getText("उद्यमी, सीईओ, राजनेता, आविष्कारक", "Entrepreneur, CEO, politician, inventor"),
        loveStyle: getText("स्वतंत्र प्रेमी, नेतृत्व चाहते हैं", "Independent lover, needs to lead in relationships")
      },
      2: {
        purpose: getText("सहयोग और शांति के माध्यम से दूसरों की सेवा करना", "To serve others through cooperation and bringing peace"),
        strengths: getText("कूटनीतिक, संवेदनशील, सहयोगी", "Diplomatic, sensitive, cooperative"),
        challenges: getText("अत्यधिक संवेदनशीलता, निर्णय लेने में कठिनाई", "Over-sensitivity, difficulty making decisions"),
        careerPath: getText("परामर्शदाता, शिक्षक, मध्यस्थ, चिकित्सक", "Counselor, teacher, mediator, therapist"),
        loveStyle: getText("रोमांटिक, भावनात्मक गहराई चाहते हैं", "Romantic, seeks emotional depth")
      },
      3: {
        purpose: getText("रचनात्मकता और संवाद के माध्यम से दुनिया को प्रेरित करना", "To inspire the world through creativity and communication"),
        strengths: getText("रचनात्मक, अभिव्यंजक, आशावादी", "Creative, expressive, optimistic"),
        challenges: getText("बिखराव, सतही व्यवहार", "Scattered energy, superficiality"),
        careerPath: getText("कलाकार, लेखक, अभिनेता, डिजाइनर", "Artist, writer, actor, designer"),
        loveStyle: getText("मजेदार, सामाजिक, विविधता चाहते हैं", "Fun-loving, social, needs variety")
      },
      4: {
        purpose: getText("अनुशासन और कड़ी मेहनत के माध्यम से स्थिर आधार बनाना", "To build stable foundations through discipline and hard work"),
        strengths: getText("व्यवस्थित, विश्वसनीय, मेहनती", "Organized, reliable, hardworking"),
        challenges: getText("कठोरता, बदलाव का डर", "Rigidity, fear of change"),
        careerPath: getText("इंजीनियर, अकाउंटेंट, प्रबंधक, वास्तुकार", "Engineer, accountant, manager, architect"),
        loveStyle: getText("वफादार, स्थिर रिश्ते चाहते हैं", "Loyal, seeks stable relationships")
      },
      5: {
        purpose: getText("स्वतंत्रता और अनुभव के माध्यम से दुनिया का अन्वेषण करना", "To explore the world through freedom and experience"),
        strengths: getText("साहसिक, बहुमुखी, जिज्ञासु", "Adventurous, versatile, curious"),
        challenges: getText("अस्थिरता, जिम्मेदारी से बचना", "Instability, avoiding responsibility"),
        careerPath: getText("यात्रा एजेंट, पत्रकार, सेल्स, अन्वेषक", "Travel agent, journalist, sales, explorer"),
        loveStyle: getText("स्वतंत्रता चाहते हैं, विविधता पसंद", "Needs freedom, loves variety")
      },
      6: {
        purpose: getText("देखभाल और सेवा के माध्यम से परिवार और समुदाय की सेवा करना", "To serve family and community through care and nurturing"),
        strengths: getText("पोषणकर्ता, जिम्मेदार, प्रेमपूर्ण", "Nurturing, responsible, loving"),
        challenges: getText("अत्यधिक नियंत्रण, शहीद की भावना", "Over-controlling, martyr complex"),
        careerPath: getText("डॉक्टर, नर्स, परामर्शदाता, शिक्षक", "Doctor, nurse, counselor, teacher"),
        loveStyle: getText("देखभाल करने वाला, पारिवारिक", "Caring, family-oriented")
      },
      7: {
        purpose: getText("आध्यात्मिकता और ज्ञान के माध्यम से सत्य की खोज करना", "To seek truth through spirituality and knowledge"),
        strengths: getText("बुद्धिमान, आध्यात्मिक, विश्लेषणात्मक", "Wise, spiritual, analytical"),
        challenges: getText("अकेलापन, संदेह", "Loneliness, skepticism"),
        careerPath: getText("शोधकर्ता, आध्यात्मिक शिक्षक, वैज्ञानिक", "Researcher, spiritual teacher, scientist"),
        loveStyle: getText("गहरा कनेक्शन चाहते हैं, बौद्धिक साझेदारी", "Seeks deep connection, intellectual partnership")
      },
      8: {
        purpose: getText("शक्ति और भौतिक सफलता के माध्यम से दुनिया पर प्रभाव डालना", "To impact the world through power and material success"),
        strengths: getText("शक्तिशाली, लक्ष्य-उन्मुख, अधिकारी", "Powerful, goal-oriented, authoritative"),
        challenges: getText("भौतिकवाद, शक्ति का दुरुपयोग", "Materialism, power abuse"),
        careerPath: getText("व्यापारिक कार्यकारी, बैंकर, रियल एस्टेट", "Business executive, banker, real estate"),
        loveStyle: getText("महत्वाकांक्षी साझेदारी, स्थिति-सचेत", "Ambitious partnership, status-conscious")
      },
      9: {
        purpose: getText("करुणा और सेवा के माध्यम से मानवता की सेवा करना", "To serve humanity through compassion and universal service"),
        strengths: getText("करुणामय, आदर्शवादी, व्यापक सोच", "Compassionate, idealistic, broad-minded"),
        challenges: getText("भोलापन, भावनात्मक अस्थिरता", "Naivety, emotional instability"),
        careerPath: getText("मानवतावादी, एनजीओ कार्यकर्ता, परोपकारी", "Humanitarian, NGO worker, philanthropist"),
        loveStyle: getText("प्रेमपूर्ण, समझदार, आध्यात्मिक कनेक्शन", "Loving, understanding, spiritual connection")
      }
    };
    
    return insights[number as keyof typeof insights] || insights[1];
  };

  const getPersonalYearGuidance = (year: number) => {
    const guidance = {
      1: getText("नई शुरुआत का साल - नए प्रोजेक्ट शुरू करें", "Year of new beginnings - start new projects"),
      2: getText("सहयोग और धैर्य का साल - रिश्तों पर फोकस करें", "Year of cooperation and patience - focus on relationships"),
      3: getText("रचनात्मकता और संवाद का साल - अपनी प्रतिभा व्यक्त करें", "Year of creativity and communication - express your talents"),
      4: getText("कड़ी मेहनत और आधार निर्माण का साल", "Year of hard work and building foundations"),
      5: getText("बदलाव और स्वतंत्रता का साल - नए अनुभव करें", "Year of change and freedom - seek new experiences"),
      6: getText("परिवार और जिम्मेदारी का साल", "Year of family and responsibility"),
      7: getText("आध्यात्मिक खोज और आत्म-चिंतन का साल", "Year of spiritual seeking and self-reflection"),
      8: getText("भौतिक सफलता और उपलब्धि का साल", "Year of material success and achievement"),
      9: getText("समापन और नई तैयारी का साल", "Year of completion and preparation for new cycles")
    };
    
    return guidance[year as keyof typeof guidance] || guidance[1];
  };

  const lifePathInsights = getLifePathInsights(profile.lifePath);

  return (
    <div className="space-y-6">
      {/* Life Purpose & Destiny */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Star className="h-5 w-5" />
            {getText("आपका जीवन उद्देश्य", "Your Life Purpose")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">
              {getText("जीवन पथ", "Life Path")} {profile.lifePath}: {getText("आपका मुख्य उद्देश्य", "Your Main Purpose")}
            </h4>
            <p className="text-purple-700 text-sm mb-3">
              {lifePathInsights.purpose}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h5 className="font-medium text-green-700 mb-1">
                  {getText("आपकी शक्तियां", "Your Strengths")}
                </h5>
                <p className="text-sm text-green-600">{lifePathInsights.strengths}</p>
              </div>
              <div>
                <h5 className="font-medium text-orange-700 mb-1">
                  {getText("चुनौतियां", "Challenges to Overcome")}
                </h5>
                <p className="text-sm text-orange-600">{lifePathInsights.challenges}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career & Money Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Briefcase className="h-5 w-5" />
            {getText("करियर और पैसा मार्गदर्शन", "Career & Money Guidance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              {getText("आदर्श करियर पथ", "Ideal Career Path")}
            </h4>
            <p className="text-green-700 text-sm mb-3">
              {lifePathInsights.careerPath}
            </p>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <h5 className="font-medium text-yellow-800 mb-1">
                {getText("धन संबंधी सलाह", "Money Advice")}
              </h5>
              <p className="text-sm text-yellow-700">
                {profile.lifePath === 8 ? 
                  getText("आपको व्यापार और निवेश में सफलता मिलेगी", "You'll succeed in business and investments") :
                  profile.lifePath === 4 ?
                  getText("धीमी लेकिन स्थिर संपत्ति निर्माण", "Slow but steady wealth building") :
                  getText("रचनात्मक कार्यों से आर्थिक लाभ", "Financial gains through creative work")
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Love & Relationships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-700">
            <Heart className="h-5 w-5" />
            {getText("प्रेम और रिश्ते", "Love & Relationships")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="font-semibold text-pink-800 mb-2">
              {getText("आपकी प्रेम शैली", "Your Love Style")}
            </h4>
            <p className="text-pink-700 text-sm mb-3">
              {lifePathInsights.loveStyle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-red-50 p-3 rounded">
                <h5 className="font-medium text-red-700 mb-1">
                  {getText("सबसे अच्छा मैच", "Best Match")}
                </h5>
                <div className="flex gap-1">
                  {getCompatibleNumbers(profile.lifePath).map(num => (
                    <Badge key={num} variant="outline" className="bg-red-100 text-red-700">
                      {num}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <h5 className="font-medium text-blue-700 mb-1">
                  {getText("रिश्ते में सलाह", "Relationship Advice")}
                </h5>
                <p className="text-xs text-blue-600">
                  {getRelationshipAdvice(profile.lifePath, language)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Year Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Clock className="h-5 w-5" />
            {getText("2025 का मार्गदर्शन", "2025 Guidance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              {getText("व्यक्तिगत वर्ष", "Personal Year")} {profile.personalYear}
            </h4>
            <p className="text-blue-700 text-sm mb-3">
              {getPersonalYearGuidance(profile.personalYear)}
            </p>
            <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
              <h5 className="font-medium text-indigo-800 mb-1">
                {getText("महत्वपूर्ण महीने", "Important Months")}
              </h5>
              <p className="text-sm text-indigo-700">
                {getText("मार्च, जून, सितंबर - महत्वपूर्ण अवसर", "March, June, September - Key opportunities")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Life Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <TrendingUp className="h-5 w-5" />
            {getText("दैनिक जीवन मार्गदर्शन", "Daily Life Guidance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">
                {getText("भाग्यशाली दिन", "Lucky Days")}
              </h4>
              <div className="flex gap-1 mb-2">
                {getLuckyDays(profile.lifePath).map(day => (
                  <Badge key={day} className="bg-orange-200 text-orange-800">{day}</Badge>
                ))}
              </div>
              <p className="text-xs text-orange-600">
                {getText("इन दिनों महत्वपूर्ण निर्णय लें", "Make important decisions on these days")}
              </p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-800 mb-2">
                {getText("भाग्यशाली रंग", "Lucky Colors")}
              </h4>
              <div className="flex gap-1 mb-2">
                {getLuckyColors(profile.lifePath).map(color => (
                  <div key={color} className="w-6 h-6 rounded border" style={{backgroundColor: color.toLowerCase()}}></div>
                ))}
              </div>
              <p className="text-xs text-teal-600">
                {getText("इन रंगों का प्रयोग करें", "Use these colors in your daily life")}
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
