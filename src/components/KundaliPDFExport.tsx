
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { BirthData, KundaliChart as KundaliChartType } from '@/lib/kundaliUtils';
import { NumerologyProfile } from '@/lib/numerologyUtils';
import { useToast } from "@/hooks/use-toast";

interface KundaliPDFExportProps {
  birthData: BirthData & { fullName: string };
  chart: KundaliChartType;
  numerologyData?: NumerologyProfile;
  language: 'hi' | 'en';
}

const KundaliPDFExport: React.FC<KundaliPDFExportProps> = ({ 
  birthData, 
  chart, 
  numerologyData, 
  language 
}) => {
  const { toast } = useToast();

  const generatePDFContent = () => {
    const content = `
# ${language === 'hi' ? 'वैदिक कुंडली रिपोर्ट' : 'Vedic Kundali Report'}

## ${language === 'hi' ? 'व्यक्तिगत विवरण' : 'Personal Details'}
${language === 'hi' ? 'नाम' : 'Name'}: ${birthData.fullName}
${language === 'hi' ? 'जन्म तिथि' : 'Birth Date'}: ${new Date(birthData.date).toLocaleDateString()}
${language === 'hi' ? 'जन्म समय' : 'Birth Time'}: ${birthData.time}
${language === 'hi' ? 'जन्म स्थान' : 'Birth Place'}: ${birthData.place}

## ${language === 'hi' ? 'मुख्य ज्योतिषीय जानकारी' : 'Main Astrological Information'}
${language === 'hi' ? 'लग्न (Ascendant)' : 'Ascendant'}: ${chart.ascendantSanskrit} (${chart.ascendant})
${language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}: ${chart.planets.find(p => p.id === "MO")?.signSanskrit}
${language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}: ${chart.planets.find(p => p.id === "SU")?.signSanskrit}
${language === 'hi' ? 'जन्म तत्त्व' : 'Birth Element'}: ${chart.birthElement}

## ${language === 'hi' ? 'ग्रह स्थिति' : 'Planetary Positions'}
${chart.planets.map(planet => 
  `${planet.name} (${planet.id}): ${planet.signSanskrit} ${planet.degreeInSign.toFixed(2)}°`
).join('\n')}

## ${language === 'hi' ? 'सक्रिय योग' : 'Active Yogas'}
${chart.yogas.filter(y => y.present).map(yoga => 
  `${yoga.sanskritName} (${yoga.name}): ${yoga.description}`
).join('\n')}

${numerologyData ? `
## ${language === 'hi' ? 'अंकज्योतिष विश्लेषण' : 'Numerology Analysis'}
${language === 'hi' ? 'मूलांक' : 'Life Path'}: ${numerologyData.lifePath}
${language === 'hi' ? 'भाग्यांक' : 'Expression'}: ${numerologyData.expression}
${language === 'hi' ? 'अंतरांक' : 'Soul Urge'}: ${numerologyData.soulUrge}
${language === 'hi' ? 'व्यक्तित्व अंक' : 'Personality'}: ${numerologyData.personality}
${language === 'hi' ? 'वर्तमान वर्ष' : 'Personal Year'}: ${numerologyData.personalYear}
` : ''}

## ${language === 'hi' ? 'AI गुरु का सुझाव' : 'AI Guru Recommendations'}
${language === 'hi' ? 
  'आपकी कुंडली के अनुसार, नियमित रूप से ध्यान और प्राणायाम का अभ्यास करें। अपने इष्ट देव की पूजा करें और सत्कर्म में लगे रहें।' :
  'According to your kundali, practice regular meditation and pranayama. Worship your chosen deity and engage in righteous actions.'}

${language === 'hi' ? 
  '* यह रिपोर्ट केवल शैक्षणिक उद्देश्यों के लिए है। महत्वपूर्ण निर्णयों के लिए योग्य ज्योतिषी से सलाह लें।' :
  '* This report is for educational purposes only. Consult a qualified astrologer for important decisions.'}
    `;

    return content;
  };

  const downloadPDF = async () => {
    try {
      // Create a simple text file for now (can be enhanced to actual PDF later)
      const content = generatePDFContent();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${birthData.fullName}_Kundali_Report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: language === 'hi' ? "डाउनलोड सफल" : "Download Successful",
        description: language === 'hi' ? "आपकी कुंडली रिपोर्ट डाउनलोड हो गई है।" : "Your kundali report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "डाउनलोड में समस्या हुई है।" : "There was an issue with the download.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={downloadPDF} className="w-full" variant="outline">
      <FileText className="h-4 w-4 mr-2" />
      {language === 'hi' ? 'कुंडली रिपोर्ट डाउनलोड करें' : 'Download Kundali Report'}
    </Button>
  );
};

export default KundaliPDFExport;
