
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KundaliChart, BirthData, getPlanetDetails, getZodiacDetails } from '@/lib/kundaliUtils';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface DetailedPredictionsProps {
  chart: KundaliChart;
  birthData: BirthData & { fullName?: string };
  language: 'hi' | 'en';
}

const DetailedPredictions: React.FC<DetailedPredictionsProps> = ({ chart, birthData, language }) => {
  // Get key planetary positions
  const sun = chart.planets.find(p => p.id === "SU");
  const moon = chart.planets.find(p => p.id === "MO");
  const ascendantSign = chart.ascendant;
  const mars = chart.planets.find(p => p.id === "MA");
  const venus = chart.planets.find(p => p.id === "VE");
  const jupiter = chart.planets.find(p => p.id === "JU");
  const saturn = chart.planets.find(p => p.id === "SA");
  const mercury = chart.planets.find(p => p.id === "ME");
  const rahu = chart.planets.find(p => p.id === "RA");
  const ketu = chart.planets.find(p => p.id === "KE");
  
  // Get house positions for important planets
  const getHousePosition = (planetSign: number) => {
    return chart.housesList.findIndex(sign => sign === planetSign) + 1;
  };
  
  const sunHouse = sun ? getHousePosition(sun.sign) : 0;
  const moonHouse = moon ? getHousePosition(moon.sign) : 0;
  const marsHouse = mars ? getHousePosition(mars.sign) : 0;
  
  // Calculate aspects and relationships between planets
  const planetsInKendra = chart.planets.filter(p => {
    const house = getHousePosition(p.sign);
    return [1, 4, 7, 10].includes(house);
  });
  
  const planetsInTrikona = chart.planets.filter(p => {
    const house = getHousePosition(p.sign);
    return [1, 5, 9].includes(house);
  });
  
  // Calculate key yogas and doshas
  const hasRajYoga = planetsInKendra.some(p => p.id === "JU" || p.id === "VE") && 
                     planetsInTrikona.some(p => p.id === "JU" || p.id === "VE");
                     
  const hasMangalDosha = mars && [1, 4, 7, 8, 12].includes(marsHouse);
  
  // Get current dasha period
  const currentDasha = chart.dashaPeriods && chart.dashaPeriods.length > 0 ? 
                      chart.dashaPeriods[0] : null;

  // Generate personalized predictions
  const generatePersonalityPrediction = () => {
    const ascendantText = {
      1: {
        hi: "मेष लग्न आपको साहसी, आत्मविश्वासी और उत्साही व्यक्तित्व प्रदान करता है। आप नेतृत्व के गुण रखते हैं और नए कार्यों को प्रारंभ करने में कुशल हैं।",
        en: "Aries ascendant gives you a brave, confident, and enthusiastic personality. You possess leadership qualities and are skilled at initiating new ventures."
      },
      2: {
        hi: "वृषभ लग्न आपको धैर्यवान, दृढ़ और विश्वसनीय बनाता है। आप भौतिक सुख-सुविधाओं और सुरक्षा को महत्व देते हैं।",
        en: "Taurus ascendant makes you patient, determined, and reliable. You value material comforts and security."
      },
      3: {
        hi: "मिथुन लग्न आपको बौद्धिक, जिज्ञासु और संचार में कुशल बनाता है। आपमें विविध रुचियां हैं और आप बहुमुखी प्रतिभा के स्वामी हैं।",
        en: "Gemini ascendant makes you intellectual, curious, and skilled in communication. You have diverse interests and are versatile."
      },
      4: {
        hi: "कर्क लग्न आपको भावनात्मक, संवेदनशील और परिवार-केंद्रित बनाता है। आप अपनों का ख्याल रखने में अच्छे हैं।",
        en: "Cancer ascendant makes you emotional, sensitive, and family-oriented. You excel at taking care of loved ones."
      },
      5: {
        hi: "सिंह लग्न आपको आत्मविश्वासी, महत्वाकांक्षी और रचनात्मक बनाता है। आप नेतृत्व के गुण रखते हैं और प्रशंसा पाना पसंद करते हैं।",
        en: "Leo ascendant makes you confident, ambitious, and creative. You possess leadership qualities and enjoy receiving appreciation."
      },
      6: {
        hi: "कन्या लग्न आपको विश्लेषणात्मक, व्यावहारिक और सेवाभावी बनाता है। आप विवरणों पर ध्यान देते हैं और संगठित रहते हैं।",
        en: "Virgo ascendant makes you analytical, practical, and service-oriented. You pay attention to details and stay organized."
      },
      7: {
        hi: "तुला लग्न आपको संतुलित, न्यायप्रिय और सौंदर्य की सराहना करने वाला बनाता है। आप रिश्तों को महत्व देते हैं और सामंजस्य पसंद करते हैं।",
        en: "Libra ascendant makes you balanced, fair-minded, and appreciative of beauty. You value relationships and prefer harmony."
      },
      8: {
        hi: "वृश्चिक लग्न आपको गहन, रहस्यमयी और दृढ़ बनाता है। आपमें गहरी अंतर्दृष्टि और परिवर्तन की क्षमता है।",
        en: "Scorpio ascendant makes you intense, mysterious, and resilient. You have deep insight and a capacity for transformation."
      },
      9: {
        hi: "धनु लग्न आपको आशावादी, स्वतंत्र और दार्शनिक बनाता है। आप यात्रा, शिक्षा और आध्यात्मिकता में रुचि रखते हैं।",
        en: "Sagittarius ascendant makes you optimistic, independent, and philosophical. You're interested in travel, education, and spirituality."
      },
      10: {
        hi: "मकर लग्न आपको महत्वाकांक्षी, अनुशासित और व्यावहारिक बनाता है। आप अपने लक्ष्यों को प्राप्त करने के लिए कड़ी मेहनत करते हैं।",
        en: "Capricorn ascendant makes you ambitious, disciplined, and practical. You work hard to achieve your goals."
      },
      11: {
        hi: "कुंभ लग्न आपको प्रगतिशील, मानवतावादी और स्वतंत्र विचारक बनाता है। आप नवाचार और सामाजिक सुधार में रुचि रखते हैं।",
        en: "Aquarius ascendant makes you progressive, humanitarian, and an independent thinker. You're interested in innovation and social reform."
      },
      12: {
        hi: "मीन लग्न आपको दयालु, सहानुभूतिपूर्ण और आध्यात्मिक बनाता है। आपमें कलात्मक प्रतिभा और गहरी भावनाएँ हैं।",
        en: "Pisces ascendant makes you compassionate, empathetic, and spiritual. You have artistic talent and deep emotions."
      }
    };
    
    return ascendantText[ascendantSign as keyof typeof ascendantText]?.[language] || 
      (language === 'hi' ? "व्यक्तित्व विश्लेषण उपलब्ध नहीं है।" : "Personality analysis not available.");
  };
  
  const generateCareerPrediction = () => {
    // Based on 10th house and its lord, sun position
    const tenthHouseSign = chart.housesList[9];
    const tenthLordId = getZodiacDetails(tenthHouseSign)?.ruler || "SU";
    const tenthLord = getPlanetDetails(tenthLordId);
    
    if (jupiter && [1, 2, 4, 5, 9, 10, 11].includes(getHousePosition(jupiter.sign))) {
      return language === 'hi' 
        ? "बृहस्पति की स्थिति बताती है कि आप शिक्षा, सलाहकार, वित्त या प्रबंधन के क्षेत्र में सफलता पा सकते हैं। आपके कार्य में आध्यात्मिक या नैतिक पहलू हो सकता है।"
        : "Jupiter's position indicates you may find success in education, counseling, finance, or management. Your work may have a spiritual or ethical dimension.";
    } else if (sun && [1, 3, 5, 10, 11].includes(sunHouse)) {
      return language === 'hi'
        ? "सूर्य की स्थिति दर्शाती है कि आप नेतृत्व पदों, सरकारी सेवा, या प्रशासनिक भूमिकाओं में उत्कृष्टता प्राप्त कर सकते हैं। आप स्वतंत्र उद्यमी भी हो सकते हैं।"
        : "Sun's position shows you may excel in leadership positions, government service, or administrative roles. You may also be an independent entrepreneur.";
    } else {
      return language === 'hi'
        ? "आपकी कुंडली में दसवें भाव और उसके स्वामी की स्थिति सुझाव देती है कि आप संगठनात्मक, विश्लेषणात्मक या रचनात्मक क्षेत्रों में सफलता पा सकते हैं। आपके करियर में कुछ उतार-चढ़ाव हो सकते हैं, लेकिन आपकी मेहनत और प्रतिभा आपको अंततः सफलता दिलाएगी।"
        : "The position of the 10th house and its lord in your chart suggests you may find success in organizational, analytical, or creative fields. Your career may have some fluctuations, but your hard work and talent will eventually bring you success.";
    }
  };
  
  const generateRelationshipPrediction = () => {
    // Based on 7th house, Venus and Mars
    const seventhHouseSign = chart.housesList[6];
    const seventhLordId = getZodiacDetails(seventhHouseSign)?.ruler || "VE";
    const seventhLord = getPlanetDetails(seventhLordId);
    
    if (venus && [1, 4, 5, 7, 10, 11].includes(getHousePosition(venus.sign))) {
      return language === 'hi'
        ? "शुक्र की अनुकूल स्थिति दर्शाती है कि आपका वैवाहिक जीवन सुखद और समृद्ध होगा। आपको एक सौंदर्यप्रेमी, सहयोगी और प्रेमपूर्ण साथी मिल सकता है।"
        : "Venus's favorable position indicates your married life will be pleasant and enriching. You may find an aesthetically inclined, supportive, and loving partner.";
    } else if (venus && venus.isRetrograde) {
      return language === 'hi'
        ? "वक्री शुक्र सूचित करता है कि आपके प्रेम संबंधों में कुछ चुनौतियाँ हो सकती हैं। विवाह में देरी या प्रारंभिक संबंधों में असंतोष की संभावना है। समझ और धैर्य से, आप इन चुनौतियों को पार कर सकते हैं।"
        : "Retrograde Venus indicates you may face some challenges in romantic relationships. Delays in marriage or dissatisfaction in early relationships are possible. With understanding and patience, you can overcome these challenges.";
    } else {
      return language === 'hi'
        ? "आपकी कुंडली में सप्तम भाव और उसके स्वामी की स्थिति सुझाव देती है कि आपका जीवनसाथी बुद्धिमान, सहायक और आपके विकास में सहायक होगा। संवाद और समझौते पर ध्यान देना आपके रिश्ते को मजबूत बनाएगा।"
        : "The position of the 7th house and its lord in your chart suggests your spouse will be intelligent, supportive, and conducive to your growth. Focus on communication and compromise will strengthen your relationship.";
    }
  };
  
  const generateHealthPrediction = () => {
    // Based on 6th house, Sun and Moon
    if (saturn && [1, 6, 8].includes(getHousePosition(saturn.sign))) {
      return language === 'hi'
        ? "शनि की स्थिति आपको जोड़ों की समस्या, पुरानी बीमारियों या हड्डियों से संबंधित मुद्दों के प्रति संवेदनशील बना सकती है। नियमित व्यायाम, उचित पोषण और तनाव प्रबंधन महत्वपूर्ण हैं।"
        : "Saturn's position may make you susceptible to joint issues, chronic illnesses, or bone-related issues. Regular exercise, proper nutrition, and stress management are important.";
    } else if (moon && moon.isRetrograde) {
      return language === 'hi'
        ? "चंद्रमा की स्थिति मानसिक स्वास्थ्य के प्रति सावधानी बरतने का संकेत देती है। तनाव प्रबंधन, पर्याप्त नींद और भावनात्मक कल्याण पर ध्यान दें।"
        : "The Moon's position indicates care for mental health. Focus on stress management, adequate sleep, and emotional well-being.";
    } else {
      return language === 'hi'
        ? "आपकी कुंडली सामान्यतः अच्छे स्वास्थ्य का संकेत देती है, लेकिन संतुलित आहार, नियमित व्यायाम और पर्याप्त आराम सुनिश्चित करें। पाचन संबंधी और तनाव से जुड़ी समस्याओं के प्रति सावधान रहें।"
        : "Your chart generally indicates good health, but ensure a balanced diet, regular exercise, and adequate rest. Be cautious about digestive and stress-related issues.";
    }
  };
  
  const generateWealthPrediction = () => {
    // Based on 2nd and 11th houses, Jupiter and Venus
    if (jupiter && [1, 2, 5, 9, 11].includes(getHousePosition(jupiter.sign))) {
      return language === 'hi'
        ? "बृहस्पति की शुभ स्थिति धन लाभ, वित्तीय विवेक और समृद्धि का संकेत देती है। आपके पास धन अर्जित करने और उसे बुद्धिमानी से प्रबंधित करने की प्राकृतिक क्षमता है।"
        : "Jupiter's auspicious position indicates wealth gain, financial wisdom, and prosperity. You have a natural ability to earn and manage wealth wisely.";
    } else if (rahu && [2, 11].includes(getHousePosition(rahu.sign))) {
      return language === 'hi'
        ? "राहु की स्थिति अचानक लाभ या अप्रत्याशित धन स्रोतों का संकेत दे सकती है, लेकिन वित्तीय अस्थिरता भी हो सकती है। जुआ या जोखिम भरे निवेश से बचें और आय के स्थिर स्रोत बनाएँ।"
        : "Rahu's position may indicate sudden gains or unexpected sources of wealth, but also financial instability. Avoid gambling or risky investments and create stable sources of income.";
    } else {
      return language === 'hi'
        ? "आपकी कुंडली में धन भावों की स्थिति संकेत देती है कि आप अपने प्रयासों से सम्मानजनक धन अर्जित करेंगे। विविध निवेश, मितव्ययिता और दीर्घकालिक वित्तीय योजना से आप वित्तीय सुरक्षा प्राप्त कर सकते हैं।"
        : "The position of wealth houses in your chart indicates you will earn respectable wealth through your efforts. Diversified investments, frugality, and long-term financial planning can help you achieve financial security.";
    }
  };
  
  const generateSpiritualPrediction = () => {
    // Based on 9th house, Jupiter and Ketu
    if (jupiter && [1, 4, 5, 9, 12].includes(getHousePosition(jupiter.sign))) {
      return language === 'hi'
        ? "बृहस्पति की शुभ स्थिति आध्यात्मिक ज्ञान, दर्शन और धार्मिक शिक्षाओं के प्रति गहन रुचि का संकेत देती है। आप एक प्राकृतिक शिक्षक या मार्गदर्शक हो सकते हैं।"
        : "Jupiter's auspicious position indicates deep interest in spiritual knowledge, philosophy, and religious teachings. You may be a natural teacher or guide.";
    } else if (ketu && [9, 12].includes(getHousePosition(ketu.sign))) {
      return language === 'hi'
        ? "केतु की स्थिति आध्यात्मिक प्रगति, मोक्ष की खोज और भौतिक आसक्तियों से विरक्ति का संकेत दे सकती है। आप गहन ध्यान या आध्यात्मिक अभ्यासों की ओर आकर्षित हो सकते हैं।"
        : "Ketu's position may indicate spiritual progress, pursuit of liberation, and detachment from material attachments. You may be drawn to deep meditation or spiritual practices.";
    } else {
      return language === 'hi'
        ? "आपकी कुंडली में नवम भाव की स्थिति संकेत देती है कि आप जीवन के अर्थ और उद्देश्य के बारे में चिंतनशील हैं। आप पारंपरिक धार्मिक शिक्षाओं और आधुनिक आध्यात्मिक अवधारणाओं दोनों को संतुलित रूप से अपना सकते हैं।"
        : "The position of the 9th house in your chart indicates you are contemplative about the meaning and purpose of life. You may balance traditional religious teachings and modern spiritual concepts.";
    }
  };
  
  const generateCurrentPhasePrediction = () => {
    if (!currentDasha) {
      return language === 'hi' 
        ? "वर्तमान दशा जानकारी उपलब्ध नहीं है।" 
        : "Current dasha information not available.";
    }
    
    const dashaPlanet = currentDasha.planet;
    const remainingYears = Math.round((new Date(currentDasha.endDate).getTime() - new Date().getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    const dashaPredictions = {
      "SU": {
        hi: `आप सूर्य महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि आत्मविश्वास, पहचान की स्पष्टता और अधिकार के विकास की है। सरकारी कार्य, पदोन्नति और पिता से संबंधित मामलों में प्रगति संभव है।`,
        en: `You are in Sun Mahadasha which will last for about ${remainingYears} years. This period is for developing confidence, clarity of identity, and authority. Progress in government work, promotion, and father-related matters is possible.`
      },
      "MO": {
        hi: `आप चंद्र महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि भावनात्मक विकास, मन की शांति और मातृत्व/परिवार संबंधों के लिए महत्वपूर्ण है। यात्रा और सामाजिक संपर्क बढ़ेंगे।`,
        en: `You are in Moon Mahadasha which will last for about ${remainingYears} years. This period is significant for emotional growth, peace of mind, and maternal/family relationships. Travel and social contacts will increase.`
      },
      "MA": {
        hi: `आप मंगल महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि साहस, शारीरिक शक्ति और प्रतिस्पर्धा की है। तकनीकी क्षेत्रों, सैन्य, खेल या इंजीनियरिंग में अवसर मिल सकते हैं।`,
        en: `You are in Mars Mahadasha which will last for about ${remainingYears} years. This is a period of courage, physical strength, and competition. Opportunities may come in technical fields, military, sports, or engineering.`
      },
      "ME": {
        hi: `आप बुध महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि बौद्धिक विकास, संचार कौशल और व्यापार के लिए उत्कृष्ट है। शिक्षा, लेखन और विश्लेषणात्मक कार्यों में सफलता मिलेगी।`,
        en: `You are in Mercury Mahadasha which will last for about ${remainingYears} years. This period is excellent for intellectual development, communication skills, and business. Success in education, writing, and analytical work will come.`
      },
      "JU": {
        hi: `आप बृहस्पति महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि विस्तार, आशीर्वाद और ज्ञान की है। शिक्षा, धार्मिक कार्य, परामर्श या कानून में अवसर मिलेंगे। संतान संबंधी सुख भी संभव है।`,
        en: `You are in Jupiter Mahadasha which will last for about ${remainingYears} years. This is a period of expansion, blessings, and knowledge. Opportunities in education, religious work, counseling, or law will come. Children-related happiness is also possible.`
      },
      "VE": {
        hi: `आप शुक्र महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि सुख, सौंदर्य, कला और प्रेम संबंधों के लिए अनुकूल है। वित्तीय समृद्धि, विवाह और भौतिक सुख-सुविधाओं में वृद्धि होगी।`,
        en: `You are in Venus Mahadasha which will last for about ${remainingYears} years. This period is favorable for pleasure, beauty, arts, and love relationships. Financial prosperity, marriage, and increase in material comforts will occur.`
      },
      "SA": {
        hi: `आप शनि महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि अनुशासन, कठोर परिश्रम और धैर्य की है। दीर्घकालिक प्रयास फलदायी होंगे, लेकिन विलंब और चुनौतियों का सामना करना पड़ सकता है।`,
        en: `You are in Saturn Mahadasha which will last for about ${remainingYears} years. This is a period of discipline, hard work, and patience. Long-term efforts will be fruitful, but delays and challenges may be faced.`
      },
      "RA": {
        hi: `आप राहु महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि तीव्र परिवर्तन, अप्रत्याशित अवसरों और महत्वाकांक्षा की है। विदेश यात्रा या अपरंपरागत क्षेत्रों में सफलता मिल सकती है।`,
        en: `You are in Rahu Mahadasha which will last for about ${remainingYears} years. This is a period of intense change, unexpected opportunities, and ambition. Foreign travel or success in unconventional fields may occur.`
      },
      "KE": {
        hi: `आप केतु महादशा में हैं जो लगभग ${remainingYears} वर्ष तक चलेगी। यह अवधि आध्यात्मिक विकास, पुराने बंधनों से मुक्ति और आंतरिक ज्ञान की है। भौतिक आसक्तियों से विरक्ति बढ़ सकती है।`,
        en: `You are in Ketu Mahadasha which will last for about ${remainingYears} years. This is a period of spiritual growth, liberation from old bonds, and inner knowledge. Detachment from material attachments may increase.`
      }
    };
    
    return dashaPredictions[dashaPlanet as keyof typeof dashaPredictions]?.[language] || 
      (language === 'hi' ? "वर्तमान दशा का विश्लेषण उपलब्ध नहीं है।" : "Current period analysis not available.");
  };
  
  // Generate remedies based on chart
  const generateRemedies = () => {
    const remedies = [];
    
    if (saturn && [1, 4, 7, 8, 10].includes(getHousePosition(saturn.sign))) {
      remedies.push(language === 'hi' 
        ? "शनि के प्रभाव को कम करने के लिए शनिवार को काले तिल और तेल दान करें।" 
        : "Donate black sesame seeds and oil on Saturdays to reduce Saturn's influence.");
    }
    
    if (rahu && [1, 2, 4, 7, 8].includes(getHousePosition(rahu.sign)) || 
        ketu && [1, 2, 4, 7, 8].includes(getHousePosition(ketu.sign))) {
      remedies.push(language === 'hi' 
        ? "राहु-केतु के दुष्प्रभाव से बचने के लिए दुर्गा सप्तशती का पाठ करें या करवाएँ।" 
        : "Recite or arrange the recitation of Durga Saptashati to avoid the negative effects of Rahu-Ketu.");
    }
    
    if (mars && [1, 4, 7, 8, 12].includes(marsHouse)) {
      remedies.push(language === 'hi' 
        ? "मंगल दोष के निवारण के लिए मंगलवार को हनुमान चालीसा का पाठ करें और चने की दाल दान करें।" 
        : "Recite Hanuman Chalisa on Tuesdays and donate chana dal to remedy Mars dosha.");
    }
    
    // Add general remedy
    remedies.push(language === 'hi' 
      ? "नियमित रूप से गायत्री मंत्र का जाप करें और पीपल के वृक्ष की परिक्रमा करें।" 
      : "Regularly chant Gayatri mantra and circumambulate a peepal tree.");
    
    return remedies;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {language === 'hi' ? "विस्तृत फलादेश" : "Detailed Predictions"}
        </CardTitle>
        <CardDescription>
          {language === 'hi' 
            ? "आपकी कुंडली के आधार पर जीवन के विभिन्न पहलुओं का व्यापक विश्लेषण" 
            : "Comprehensive analysis of various aspects of life based on your birth chart"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personality Prediction */}
        <div className="bg-card/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Badge variant="outline" className="mr-2">1</Badge>
            {language === 'hi' ? "व्यक्तित्व विश्लेषण" : "Personality Analysis"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'hi' 
              ? "लग्न और ग्रहों की स्थिति के आधार पर आपके स्वभाव का विश्लेषण" 
              : "Analysis of your temperament based on ascendant and planetary positions"}
          </p>
          <Separator className="my-2" />
          <p className="text-sm mt-2">{generatePersonalityPrediction()}</p>
        </div>
        
        {/* Career Prediction */}
        <div className="bg-card/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Badge variant="outline" className="mr-2">2</Badge>
            {language === 'hi' ? "करियर और व्यवसाय" : "Career & Profession"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'hi' 
              ? "दशम भाव और उसके स्वामी के आधार पर करियर संबंधी मार्गदर्शन" 
              : "Career guidance based on 10th house and its lord"}
          </p>
          <Separator className="my-2" />
          <p className="text-sm mt-2">{generateCareerPrediction()}</p>
        </div>
        
        {/* Relationship Prediction */}
        <div className="bg-card/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Badge variant="outline" className="mr-2">3</Badge>
            {language === 'hi' ? "विवाह और संबंध" : "Marriage & Relationships"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'hi' 
              ? "सप्तम भाव और शुक्र की स्थिति के आधार पर वैवाहिक जीवन का पूर्वानुमान" 
              : "Prediction of marital life based on 7th house and Venus position"}
          </p>
          <Separator className="my-2" />
          <p className="text-sm mt-2">{generateRelationshipPrediction()}</p>
        </div>
        
        {/* Health Prediction */}
        <div className="bg-card/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Badge variant="outline" className="mr-2">4</Badge>
            {language === 'hi' ? "स्वास्थ्य" : "Health"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'hi' 
              ? "षष्ठम भाव और ग्रहों के प्रभाव के आधार पर स्वास्थ्य संबंधी संभावनाएँ" 
              : "Health prospects based on 6th house and planetary influences"}
          </p>
          <Separator className="my-2" />
          <p className="text-sm mt-2">{generateHealthPrediction()}</p>
        </div>
        
        {/* Wealth Prediction */}
        <div className="bg-card/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Badge variant="outline" className="mr-2">5</Badge>
            {language === 'hi' ? "धन और संपत्ति" : "Wealth & Property"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'hi' 
              ? "द्वितीय और एकादश भाव के आधार पर वित्तीय संभावनाओं का आकलन" 
              : "Assessment of financial prospects based on 2nd and 11th houses"}
          </p>
          <Separator className="my-2" />
          <p className="text-sm mt-2">{generateWealthPrediction()}</p>
        </div>
        
        {/* Spiritual Prediction */}
        <div className="bg-card/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Badge variant="outline" className="mr-2">6</Badge>
            {language === 'hi' ? "आध्यात्मिक जीवन" : "Spiritual Life"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'hi' 
              ? "नवम भाव और बृहस्पति की स्थिति के आधार पर आध्यात्मिक प्रवृत्तियाँ" 
              : "Spiritual inclinations based on 9th house and Jupiter's position"}
          </p>
          <Separator className="my-2" />
          <p className="text-sm mt-2">{generateSpiritualPrediction()}</p>
        </div>
        
        {/* Current Dasha Period */}
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Badge variant="outline" className="mr-2">7</Badge>
            {language === 'hi' ? "वर्तमान दशा फल" : "Current Period Effects"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'hi' 
              ? "वर्तमान चल रही महादशा का आपके जीवन पर प्रभाव" 
              : "Impact of current running Mahadasha on your life"}
          </p>
          <Separator className="my-2" />
          <p className="text-sm mt-2">{generateCurrentPhasePrediction()}</p>
        </div>
        
        {/* Remedies */}
        <div className="bg-accent/20 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            {language === 'hi' ? "उपचार और उपाय" : "Remedies & Solutions"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'hi' 
              ? "ग्रहों के अशुभ प्रभावों को कम करने के लिए सुझाव" 
              : "Suggestions to mitigate negative planetary influences"}
          </p>
          <Separator className="my-2" />
          <ul className="text-sm mt-2 space-y-1">
            {generateRemedies().map((remedy, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>{remedy}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-md">
          <p>
            {language === 'hi' 
              ? "नोट: ये भविष्यवाणियां आपकी कुंडली के वैज्ञानिक विश्लेषण पर आधारित हैं, लेकिन इनका उपयोग केवल मार्गदर्शन के रूप में करें। महत्वपूर्ण निर्णयों के लिए अनुभवी ज्योतिषी से परामर्श करें।" 
              : "Note: These predictions are based on scientific analysis of your chart but use them only as guidance. Consult an experienced astrologer for important decisions."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedPredictions;
