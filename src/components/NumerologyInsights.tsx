
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NumerologyProfile } from '@/lib/numerologyUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Heart, Brain, Target, Compass, Shield, Lightbulb, TrendingUp } from 'lucide-react';

interface NumerologyInsightsProps {
  profile: NumerologyProfile;
}

const NumerologyInsights: React.FC<NumerologyInsightsProps> = ({ profile }) => {
  const { language } = useLanguage();

  const getText = (en: string, hi: string) => language === 'hi' ? hi : en;

  const getLifePathInsight = (lifePath: number): { title: string; description: string; qualities: string[] } => {
    const insights: Record<number, any> = {
      1: {
        title: getText("The Natural Leader", "प्राकृतिक नेता"),
        description: getText(
          "You are born to lead and pioneer new paths. Your life is about independence, innovation, and taking initiative. You have strong willpower and the ability to start projects from scratch. Leadership comes naturally to you, and you're meant to inspire others through your actions. Your journey involves learning to balance your need for independence with cooperation.",
          "आप नेतृत्व करने और नए रास्ते खोजने के लिए जन्मे हैं। आपका जीवन स्वतंत्रता, नवाचार और पहल करने के बारे में है। आपकी इच्छाशक्ति मजबूत है और आप शुरुआत से प्रोजेक्ट शुरू करने की क्षमता रखते हैं।"
        ),
        qualities: [
          getText("Pioneering spirit", "अग्रणी भावना"),
          getText("Strong determination", "दृढ़ संकल्प"),
          getText("Independent nature", "स्वतंत्र प्रकृति"),
          getText("Leadership abilities", "नेतृत्व क्षमताएं")
        ]
      },
      2: {
        title: getText("The Diplomatic Peacemaker", "कूटनीतिक शांतिदूत"),
        description: getText(
          "Your life path is about cooperation, diplomacy, and bringing harmony to relationships. You are naturally sensitive to others' needs and excel at mediation and partnership. Your strength lies in your ability to see both sides of any situation and find peaceful solutions. You're meant to work with others rather than alone, building bridges between people and ideas.",
          "आपका जीवन पथ सहयोग, कूटनीति और रिश्तों में सामंजस्य लाने के बारे में है। आप दूसरों की जरूरतों के प्रति स्वाभाविक रूप से संवेदनशील हैं।"
        ),
        qualities: [
          getText("Diplomatic nature", "कूटनीतिक प्रकृति"),
          getText("Emotional sensitivity", "भावनात्मक संवेदनशीलता"),
          getText("Partnership skills", "साझेदारी कौशल"),
          getText("Peaceful resolution", "शांतिपूर्ण समाधान")
        ]
      },
      3: {
        title: getText("The Creative Communicator", "रचनात्मक संवादकर्ता"),
        description: getText(
          "You are blessed with creative talents and the gift of communication. Your life is about self-expression, creativity, and inspiring others through your words and artistic abilities. You have a natural charm and optimism that draws people to you. Your path involves using your creative gifts to uplift and entertain others while learning to focus your scattered energies.",
          "आप रचनात्मक प्रतिभाओं और संवाद की देन से धन्य हैं। आपका जीवन स्व-अभिव्यक्ति, रचनात्मकता और अपने शब्दों से दूसरों को प्रेरित करने के बारे में है।"
        ),
        qualities: [
          getText("Artistic expression", "कलात्मक अभिव्यक्ति"),
          getText("Communication skills", "संचार कौशल"),
          getText("Natural optimism", "प्राकृतिक आशावाद"),
          getText("Social charisma", "सामाजिक करिश्मा")
        ]
      },
      4: {
        title: getText("The Systematic Builder", "व्यवस्थित निर्माता"),
        description: getText(
          "Your life is about building solid foundations and creating lasting structures. You are practical, reliable, and have excellent organizational skills. Your path involves bringing order to chaos and creating systems that benefit others. You're meant to be the backbone of society, providing stability and security through your hard work and dedication.",
          "आपका जीवन मजबूत नींव बनाने और स्थायी संरचनाएं बनाने के बारे में है। आप व्यावहारिक, विश्वसनीय हैं और उत्कृष्ट संगठनात्मक कौशल रखते हैं।"
        ),
        qualities: [
          getText("Systematic approach", "व्यवस्थित दृष्टिकोण"),
          getText("Reliability", "विश्वसनीयता"),
          getText("Hard work ethic", "कड़ी मेहनत की नैतिकता"),
          getText("Practical solutions", "व्यावहारिक समाधान")
        ]
      },
      5: {
        title: getText("The Freedom Seeker", "स्वतंत्रता खोजी"),
        description: getText(
          "Your life is about freedom, adventure, and experiencing all that life has to offer. You are naturally curious and have a deep need for variety and change. Your path involves learning through experience and sharing your knowledge with others. You're meant to break free from limitations and inspire others to embrace change and growth.",
          "आपका जीवन स्वतंत्रता, साहसिक कार्य और जीवन की सभी चीजों का अनुभव करने के बारे में है। आप स्वाभाविक रूप से जिज्ञासु हैं।"
        ),
        qualities: [
          getText("Adventurous spirit", "साहसिक भावना"),
          getText("Adaptability", "अनुकूलनशीलता"),
          getText("Curiosity", "जिज्ञासा"),
          getText("Progressive thinking", "प्रगतिशील सोच")
        ]
      },
      6: {
        title: getText("The Nurturing Healer", "पोषणकारी चिकित्सक"),
        description: getText(
          "Your life is centered around service, healing, and caring for others. You have a natural ability to create harmony in your environment and bring comfort to those in need. Your path involves taking responsibility for the wellbeing of others and creating a sense of home and family wherever you go. You're meant to be a source of love and support.",
          "आपका जीवन सेवा, चिकित्सा और दूसरों की देखभाल के इर्द-गिर्द केंद्रित है। आपके पास अपने वातावरण में सामंजस्य बनाने की प्राकृतिक क्षमता है।"
        ),
        qualities: [
          getText("Nurturing nature", "पोषणकारी प्रकृति"),
          getText("Healing abilities", "चिकित्सा क्षमताएं"),
          getText("Responsibility", "जिम्मेदारी"),
          getText("Compassionate heart", "दयालु हृदय")
        ]
      },
      7: {
        title: getText("The Spiritual Seeker", "आध्यात्मिक खोजी"),
        description: getText(
          "Your life is about seeking truth, wisdom, and spiritual understanding. You are naturally introspective and have a deep desire to understand the mysteries of life. Your path involves developing your intuition and inner wisdom to guide others on their spiritual journey. You're meant to be a teacher and guide for those seeking deeper meaning.",
          "आपका जीवन सत्य, ज्ञान और आध्यात्मिक समझ की खोज के बारे में है। आप स्वाभाविक रूप से आत्मनिरीक्षण करने वाले हैं।"
        ),
        qualities: [
          getText("Spiritual wisdom", "आध्यात्मिक ज्ञान"),
          getText("Analytical mind", "विश्लेषणात्मक दिमाग"),
          getText("Intuitive insights", "सहज अंतर्दृष्टि"),
          getText("Inner guidance", "आंतरिक मार्गदर्शन")
        ]
      },
      8: {
        title: getText("The Material Master", "भौतिक गुरु"),
        description: getText(
          "Your life is about achieving material success and learning to use power responsibly. You have natural business acumen and the ability to organize resources for maximum efficiency. Your path involves balancing material achievements with spiritual values and using your success to benefit others. You're meant to be a leader in the material world.",
          "आपका जीवन भौतिक सफलता प्राप्त करने और शक्ति का जिम्मेदारी से उपयोग करना सीखने के बारे में है। आपके पास प्राकृतिक व्यावसायिक बुद्धि है।"
        ),
        qualities: [
          getText("Business acumen", "व्यावसायिक बुद्धि"),
          getText("Leadership skills", "नेतृत्व कौशल"),
          getText("Material success", "भौतिक सफलता"),
          getText("Resource management", "संसाधन प्रबंधन")
        ]
      },
      9: {
        title: getText("The Universal Humanitarian", "सार्वभौमिक मानवतावादी"),
        description: getText(
          "Your life is about service to humanity and making the world a better place. You have a broad perspective and natural compassion for all beings. Your path involves letting go of personal desires to serve the greater good and inspiring others through your example of selfless service. You're meant to be a beacon of love and wisdom.",
          "आपका जीवन मानवता की सेवा और दुनिया को बेहतर बनाने के बारे में है। आपका व्यापक दृष्टिकोण और सभी प्राणियों के लिए प्राकृतिक करुणा है।"
        ),
        qualities: [
          getText("Universal love", "सार्वभौमिक प्रेम"),
          getText("Humanitarian spirit", "मानवतावादी भावना"),
          getText("Wisdom and compassion", "ज्ञान और करुणा"),
          getText("Selfless service", "निस्वार्थ सेवा")
        ]
      },
      11: {
        title: getText("The Inspirational Visionary", "प्रेरणादायक दूरदर्शी"),
        description: getText(
          "You are here to inspire and illuminate others with your spiritual insights and intuitive abilities. Your life is about being a channel for higher wisdom and helping others awaken to their spiritual potential. Your path involves developing your psychic abilities and using them to guide and heal others.",
          "आप यहाँ अपनी आध्यात्मिक अंतर्दृष्टि और सहज क्षमताओं से दूसरों को प्रेरित और प्रकाशित करने के लिए हैं।"
        ),
        qualities: [
          getText("Spiritual inspiration", "आध्यात्मिक प्रेरणा"),
          getText("Intuitive abilities", "सहज क्षमताएं"),
          getText("Visionary thinking", "दूरदर्शी सोच"),
          getText("Higher consciousness", "उच्च चेतना")
        ]
      },
      22: {
        title: getText("The Master Builder", "मास्टर बिल्डर"),
        description: getText(
          "You have the potential to create something of lasting value that will benefit humanity on a large scale. Your life is about turning dreams into reality through practical application of spiritual principles. You're meant to build bridges between the spiritual and material worlds.",
          "आपके पास कुछ स्थायी मूल्य का निर्माण करने की क्षमता है जो बड़े पैमाने पर मानवता को लाभ पहुंचाएगा।"
        ),
        qualities: [
          getText("Master builder energy", "मास्टर बिल्डर ऊर्जा"),
          getText("Large-scale vision", "बड़े पैमाने का दृष्टिकोण"),
          getText("Practical spirituality", "व्यावहारिक आध्यात्म"),
          getText("Global impact", "वैश्विक प्रभाव")
        ]
      },
      33: {
        title: getText("The Master Teacher", "मास्टर शिक्षक"),
        description: getText(
          "Your life is dedicated to teaching, healing, and uplifting humanity through unconditional love and compassion. You are here to be a living example of spiritual principles and to help others heal their emotional and spiritual wounds.",
          "आपका जीवन शिक्षण, चिकित्सा और बिना शर्त प्रेम और करुणा के माध्यम से मानवता को उत्थान देने के लिए समर्पित है।"
        ),
        qualities: [
          getText("Master teacher wisdom", "मास्टर शिक्षक ज्ञान"),
          getText("Unconditional love", "बिना शर्त प्रेम"),
          getText("Healing abilities", "चिकित्सा क्षमताएं"),
          getText("Spiritual guidance", "आध्यात्मिक मार्गदर्शन")
        ]
      }
    };

    return insights[lifePath] || insights[1];
  };

  const getExpressionInsight = (expression: number): string => {
    const insights: Record<number, string> = {
      1: getText(
        "Your natural talents lie in leadership and innovation. You're meant to pioneer new ideas and inspire others to follow your vision. Your creative expression comes through taking initiative and breaking new ground.",
        "आपकी प्राकृतिक प्रतिभाएं नेतृत्व और नवाचार में निहित हैं। आप नए विचारों का अग्रणी बनने और दूसरों को अपने दृष्टिकोण का पालन करने के लिए प्रेरित करने के लिए हैं।"
      ),
      2: getText(
        "Your talents shine through cooperation and diplomacy. You have a gift for bringing people together and creating harmony. Your expression comes through partnerships and collaborative efforts.",
        "आपकी प्रतिभाएं सहयोग और कूटनीति के माध्यम से चमकती हैं। आपके पास लोगों को एक साथ लाने और सामंजस्य बनाने का उपहार है।"
      ),
      3: getText(
        "Your creative and communicative abilities are your greatest assets. You're meant to express yourself through art, writing, speaking, or entertainment. Your joy comes from inspiring others through your creativity.",
        "आपकी रचनात्मक और संचार क्षमताएं आपकी सबसे बड़ी संपत्ति हैं। आप कला, लेखन, बोलने या मनोरंजन के माध्यम से अपने आप को व्यक्त करने के लिए हैं।"
      ),
      4: getText(
        "Your practical skills and systematic approach are your strengths. You excel at organizing, planning, and building lasting structures. Your expression comes through creating order and stability.",
        "आपके व्यावहारिक कौशल और व्यवस्थित दृष्टिकोण आपकी शक्तियां हैं। आप संगठन, योजना और स्थायी संरचनाओं के निर्माण में उत्कृष्ट हैं।"
      ),
      5: getText(
        "Your versatility and love of freedom define your expression. You're meant to explore, communicate, and share your experiences with others. Your talents lie in adaptability and progressive thinking.",
        "आपकी बहुमुखी प्रतिभा और स्वतंत्रता का प्रेम आपकी अभिव्यक्ति को परिभाषित करता है। आप खोजने, संवाद करने और अपने अनुभवों को दूसरों के साथ साझा करने के लिए हैं।"
      ),
      6: getText(
        "Your nurturing and healing abilities are your greatest gifts. You're meant to care for others and create harmony in your environment. Your expression comes through service and responsibility.",
        "आपकी पोषणकारी और चिकित्सा क्षमताएं आपके सबसे बड़े उपहार हैं। आप दूसरों की देखभाल करने और अपने वातावरण में सामंजस्य बनाने के लिए हैं।"
      ),
      7: getText(
        "Your analytical and spiritual insights are your unique talents. You're meant to seek truth and share your wisdom with others. Your expression comes through research, analysis, and spiritual teaching.",
        "आपकी विश्लेषणात्मक और आध्यात्मिक अंतर्दृष्टि आपकी अनूठी प्रतिभाएं हैं। आप सत्य की खोज करने और अपने ज्ञान को दूसरों के साथ साझा करने के लिए हैं।"
      ),
      8: getText(
        "Your business acumen and leadership abilities define your expression. You're meant to achieve material success and use your power responsibly. Your talents lie in organization and resource management.",
        "आपकी व्यावसायिक बुद्धि और नेतृत्व क्षमताएं आपकी अभिव्यक्ति को परिभाषित करती हैं। आप भौतिक सफलता प्राप्त करने और अपनी शक्ति का जिम्मेदारी से उपयोग करने के लिए हैं।"
      ),
      9: getText(
        "Your humanitarian spirit and universal perspective are your gifts to the world. You're meant to serve humanity and inspire others through your compassion. Your expression comes through selfless service.",
        "आपकी मानवतावादी भावना और सार्वभौमिक दृष्टिकोण दुनिया के लिए आपके उपहार हैं। आप मानवता की सेवा करने और अपनी करुणा के माध्यम से दूसरों को प्रेरित करने के लिए हैं।"
      )
    };

    return insights[expression] || insights[1];
  };

  const getSoulUrgeInsight = (soulUrge: number): string => {
    const insights: Record<number, string> = {
      1: getText(
        "Deep within, you crave independence and the freedom to lead. Your soul yearns to be first, to pioneer, and to make your mark on the world through your own unique vision and determination.",
        "गहराई से, आप स्वतंत्रता और नेतृत्व की स्वतंत्रता की लालसा करते हैं। आपकी आत्मा पहले होने, अग्रणी बनने और अपने अनूठे दृष्टिकोण से दुनिया पर अपनी छाप छोड़ने की चाह करती है।"
      ),
      2: getText(
        "Your soul seeks harmony, partnership, and emotional connection. You have a deep need to feel understood and to create peace in your relationships. Cooperation and collaboration fulfill your innermost desires.",
        "आपकी आत्मा सामंजस्य, साझेदारी और भावनात्मक संबंध की खोज करती है। आपको समझे जाने और अपने रिश्तों में शांति बनाने की गहरी आवश्यकता है।"
      ),
      3: getText(
        "Your soul craves creative expression and joy. You have an inner need to communicate, create, and bring beauty into the world. Your heart is fulfilled when you can express yourself freely and inspire others.",
        "आपकी आत्मा रचनात्मक अभिव्यक्ति और आनंद की लालसा करती है। आपको संवाद करने, रचना करने और दुनिया में सुंदरता लाने की आंतरिक आवश्यकता है।"
      ),
      4: getText(
        "Your soul desires security, stability, and the satisfaction of building something lasting. You need order and structure in your life, and you find fulfillment in creating solid foundations for yourself and others.",
        "आपकी आत्मा सुरक्षा, स्थिरता और कुछ स्थायी बनाने की संतुष्टि की इच्छा करती है। आपको अपने जीवन में व्यवस्था और संरचना की आवश्यकता है।"
      ),
      5: getText(
        "Your soul yearns for freedom, adventure, and variety. You have an inner need to explore, experience, and understand life from multiple perspectives. Routine and restriction suffocate your spirit.",
        "आपकी आत्मा स्वतंत्रता, साहसिक कार्य और विविधता की लालसा करती है। आपको खोजने, अनुभव करने और कई दृष्टिकोणों से जीवन को समझने की आंतरिक आवश्यकता है।"
      ),
      6: getText(
        "Your soul seeks to nurture, heal, and care for others. You have a deep need to feel needed and to create a harmonious, loving environment. Family and community are central to your emotional wellbeing.",
        "आपकी आत्मा दूसरों को पोषित करने, चिकित्सा करने और देखभाल करने की खोज करती है। आपको आवश्यकता महसूस करने और एक सामंजस्यपूर्ण, प्रेमपूर्ण वातावरण बनाने की गहरी आवश्यकता है।"
      ),
      7: getText(
        "Your soul craves understanding, wisdom, and spiritual truth. You have an inner need for solitude and reflection. You're fulfilled when you can delve deep into mysteries and share your insights with others.",
        "आपकी आत्मा समझ, ज्ञान और आध्यात्मिक सत्य की लालसा करती है। आपको एकांत और चिंतन की आंतरिक आवश्यकता है।"
      ),
      8: getText(
        "Your soul desires achievement, recognition, and material success. You have an inner drive to attain power and use it to create positive change. You're fulfilled when you can lead and make a significant impact.",
        "आपकी आत्मा उपलब्धि, पहचान और भौतिक सफलता की इच्छा करती है। आपके पास शक्ति प्राप्त करने और इसका उपयोग सकारात्मक परिवर्तन लाने के लिए आंतरिक प्रेरणा है।"
      ),
      9: getText(
        "Your soul seeks to serve humanity and make the world a better place. You have an inner need to give, heal, and inspire others. You're fulfilled when you can contribute to the greater good of all.",
        "आपकी आत्मा मानवता की सेवा करने और दुनिया को बेहतर बनाने की खोज करती है। आपको देने, चिकित्सा करने और दूसरों को प्रेरित करने की आंतरिक आवश्यकता है।"
      )
    };

    return insights[soulUrge] || insights[1];
  };

  const getPersonalityInsight = (personality: number): string => {
    const insights: Record<number, string> = {
      1: getText(
        "Others see you as confident, independent, and naturally authoritative. You project strength and leadership, often being the one others turn to for direction and initiative.",
        "दूसरे आपको आत्मविश्वासी, स्वतंत्र और स्वाभाविक रूप से आधिकारिक के रूप में देखते हैं। आप शक्ति और नेतृत्व का प्रक्षेपण करते हैं।"
      ),
      2: getText(
        "Others perceive you as gentle, diplomatic, and supportive. You appear as someone who values harmony and is always willing to help others find common ground.",
        "दूसरे आपको कोमल, कूटनीतिक और सहायक के रूप में देखते हैं। आप किसी ऐसे व्यक्ति के रूप में दिखाई देते हैं जो सामंजस्य को महत्व देता है।"
      ),
      3: getText(
        "Others see you as creative, charming, and expressive. You appear as someone who brings joy and inspiration wherever you go, with a natural ability to entertain and uplift others.",
        "दूसरे आपको रचनात्मक, आकर्षक और अभिव्यंजक के रूप में देखते हैं। आप किसी ऐसे व्यक्ति के रूप में दिखाई देते हैं जो जहां भी जाता है खुशी और प्रेरणा लाता है।"
      ),
      4: getText(
        "Others perceive you as reliable, practical, and hardworking. You project an image of stability and dependability, someone who can be trusted to get things done.",
        "दूसरे आपको विश्वसनीय, व्यावहारिक और मेहनती के रूप में देखते हैं। आप स्थिरता और निर्भरता की छवि प्रस्तुत करते हैं।"
      ),
      5: getText(
        "Others see you as dynamic, versatile, and adventurous. You appear as someone who embraces change and brings excitement and fresh perspectives to any situation.",
        "दूसरे आपको गतिशील, बहुमुखी और साहसिक के रूप में देखते हैं। आप किसी ऐसे व्यक्ति के रूप में दिखाई देते हैं जो परिवर्तन को अपनाता है।"
      ),
      6: getText(
        "Others perceive you as caring, responsible, and nurturing. You project an image of warmth and compassion, someone who puts family and community first.",
        "दूसरे आपको देखभाल करने वाले, जिम्मेदार और पोषणकारी के रूप में देखते हैं। आप गर्मजोशी और करुणा की छवि प्रस्तुत करते हैं।"
      ),
      7: getText(
        "Others see you as mysterious, wise, and introspective. You appear as someone who possesses deep knowledge and spiritual insight, often being sought out for guidance.",
        "दूसरे आपको रहस्यमय, बुद्धिमान और आत्मनिरीक्षण करने वाले के रूप में देखते हैं। आप किसी ऐसे व्यक्ति के रूप में दिखाई देते हैं जिसके पास गहरा ज्ञान है।"
      ),
      8: getText(
        "Others perceive you as ambitious, successful, and authoritative. You project an image of power and achievement, someone who can handle responsibility and make tough decisions.",
        "दूसरे आपको महत्वाकांक्षी, सफल और आधिकारिक के रूप में देखते हैं। आप शक्ति और उपलब्धि की छवि प्रस्तुत करते हैं।"
      ),
      9: getText(
        "Others see you as compassionate, generous, and wise. You appear as someone who cares about humanity and has a broad perspective on life and its challenges.",
        "दूसरे आपको दयालु, उदार और बुद्धिमान के रूप में देखते हैं। आप किसी ऐसे व्यक्ति के रूप में दिखाई देते हैं जो मानवता की परवाह करता है।"
      )
    };

    return insights[personality] || insights[1];
  };

  const getPersonalYearInsight = (personalYear: number): string => {
    const insights: Record<number, string> = {
      1: getText(
        "2025 is a year of new beginnings for you. This is the perfect time to start new projects, take initiative, and plant seeds for your future. Focus on independence and leadership.",
        "2025 आपके लिए नई शुरुआत का वर्ष है। यह नई परियोजनाओं को शुरू करने, पहल करने और अपने भविष्य के लिए बीज बोने का सही समय है।"
      ),
      2: getText(
        "2025 is about cooperation and patience. Focus on partnerships, relationships, and collaborative efforts. This is a time for diplomacy and working with others to achieve your goals.",
        "2025 सहयोग और धैर्य के बारे में है। साझेदारी, रिश्तों और सहयोगी प्रयासों पर ध्यान दें। यह कूटनीति और दूसरों के साथ मिलकर काम करने का समय है।"
      ),
      3: getText(
        "2025 brings creativity and self-expression. This is your year to shine, communicate your ideas, and engage in creative pursuits. Focus on joy, creativity, and social connections.",
        "2025 रचनात्मकता और स्व-अभिव्यक्ति लाता है। यह आपका चमकने, अपने विचारों को संप्रेषित करने और रचनात्मक गतिविधियों में संलग्न होने का वर्ष है।"
      ),
      4: getText(
        "2025 is about hard work and building foundations. Focus on organization, planning, and systematic progress. This is a time to be practical and work steadily toward your goals.",
        "2025 कड़ी मेहनत और नींव निर्माण के बारे में है। संगठन, योजना और व्यवस्थित प्रगति पर ध्यान दें। यह व्यावहारिक होने और अपने लक्ष्यों की दिशा में लगातार काम करने का समय है।"
      ),
      5: getText(
        "2025 brings freedom and change. This is your year to explore new opportunities, travel, and embrace variety. Focus on adaptability and progressive thinking.",
        "2025 स्वतंत्रता और परिवर्तन लाता है। यह नए अवसरों का पता लगाने, यात्रा करने और विविधता को अपनाने का आपका वर्ष है।"
      ),
      6: getText(
        "2025 is about responsibility and service. Focus on family, home, and caring for others. This is a time to nurture relationships and create harmony in your environment.",
        "2025 जिम्मेदारी और सेवा के बारे में है। परिवार, घर और दूसरों की देखभाल पर ध्यान दें। यह रिश्तों को पोषित करने और अपने वातावरण में सामंजस्य बनाने का समय है।"
      ),
      7: getText(
        "2025 is a year of introspection and spiritual growth. Focus on inner development, study, and seeking truth. This is a time for reflection and deepening your understanding.",
        "2025 आत्मनिरीक्षण और आध्यात्मिक विकास का वर्ष है। आंतरिक विकास, अध्ययन और सत्य की खोज पर ध्यान दें।"
      ),
      8: getText(
        "2025 brings material success and achievement. Focus on business, career advancement, and financial goals. This is a time to take on leadership roles and build your reputation.",
        "2025 भौतिक सफलता और उपलब्धि लाता है। व्यवसाय, करियर में प्रगति और वित्तीय लक्ष्यों पर ध्यान दें।"
      ),
      9: getText(
        "2025 is about completion and humanitarian service. Focus on giving back, helping others, and completing old projects. This is a time for wisdom and universal perspective.",
        "2025 पूर्णता और मानवतावादी सेवा के बारे में है। वापस देने, दूसरों की मदद करने और पुराने प्रोजेक्ट्स को पूरा करने पर ध्यान दें।"
      )
    };

    return insights[personalYear] || insights[1];
  };

  const lifePathData = getLifePathInsight(profile.lifePath);

  return (
    <div className="space-y-6">
      {/* Life Path Analysis */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Star className="h-5 w-5" />
            {getText("Your Life Path Journey", "आपकी जीवन पथ यात्रा")} ({profile.lifePath})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg text-orange-800 mb-2">{lifePathData.title}</h3>
            <p className="text-gray-700 leading-relaxed text-base">{lifePathData.description}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Compass className="h-4 w-4" />
              {getText("Core Qualities", "मुख्य गुण")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {lifePathData.qualities.map((quality, index) => (
                <Badge key={index} variant="outline" className="bg-orange-100 text-orange-700">
                  {quality}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expression Analysis */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Target className="h-5 w-5" />
            {getText("Your Natural Talents", "आपकी प्राकृतिक प्रतिभाएं")} ({profile.expression})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed text-base">
              {getExpressionInsight(profile.expression)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Soul Urge Analysis */}
      <Card className="border-l-4 border-l-pink-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-600">
            <Heart className="h-5 w-5" />
            {getText("Your Inner Desires", "आपकी आंतरिक इच्छाएं")} ({profile.soulUrge})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed text-base">
              {getSoulUrgeInsight(profile.soulUrge)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personality Analysis */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Brain className="h-5 w-5" />
            {getText("How Others See You", "दूसरे आपको कैसे देखते हैं")} ({profile.personality})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed text-base">
              {getPersonalityInsight(profile.personality)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Year Analysis */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <TrendingUp className="h-5 w-5" />
            {getText("Your 2025 Personal Year", "आपका 2025 व्यक्तिगत वर्ष")} ({profile.personalYear})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed text-base">
              {getPersonalYearInsight(profile.personalYear)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Life Integration Guidance */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            <Lightbulb className="h-5 w-5" />
            {getText("Integration & Balance", "एकीकरण और संतुलन")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-indigo-50 p-4 rounded-lg space-y-3">
            <p className="text-gray-700 leading-relaxed text-base">
              {getText(
                `Your life path (${profile.lifePath}) shows your soul's purpose, while your expression (${profile.expression}) reveals how you naturally accomplish this. Your soul urge (${profile.soulUrge}) drives your inner motivations, and your personality (${profile.personality}) is the mask you wear in the world. Understanding these four core aspects helps you align your outer actions with your inner truth.`,
                `आपका जीवन पथ (${profile.lifePath}) आपकी आत्मा का उद्देश्य दिखाता है, जबकि आपकी अभिव्यक्ति (${profile.expression}) बताती है कि आप इसे स्वाभाविक रूप से कैसे पूरा करते हैं।`
              )}
            </p>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-indigo-200">
                <h5 className="font-medium text-indigo-800 mb-1">
                  {getText("Life Purpose Alignment", "जीवन उद्देश्य संरेखण")}
                </h5>
                <p className="text-sm text-gray-600">
                  {getText(
                    "Focus on activities that align with your life path number for maximum fulfillment.",
                    "अधिकतम संतुष्टि के लिए उन गतिविधियों पर ध्यान दें जो आपके जीवन पथ संख्या के साथ संरेखित हैं।"
                  )}
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border border-indigo-200">
                <h5 className="font-medium text-indigo-800 mb-1">
                  {getText("Inner-Outer Harmony", "आंतरिक-बाहरी सामंजस्य")}
                </h5>
                <p className="text-sm text-gray-600">
                  {getText(
                    "Balance your soul urge desires with your personality expression for authentic living.",
                    "प्रामाणिक जीवन के लिए अपनी आत्मा की इच्छाओं को अपनी व्यक्तित्व अभिव्यक्ति के साथ संतुलित करें।"
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NumerologyInsights;
