
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import jsPDF from 'jspdf';
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';

interface EnhancedKundaliPDFExportProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const EnhancedKundaliPDFExport: React.FC<EnhancedKundaliPDFExportProps> = ({ 
  kundaliData, 
  language 
}) => {
  const generateComprehensivePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageHeight = 297; // A4 height in mm
    const margin = 20;
    const lineHeight = 6;
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number = 20) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };
    
    // Helper function to add text with word wrap
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * (fontSize * 0.35); // Return height used
    };
    
    // Title Page
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'संपूर्ण कुंडली विश्लेषण' : 'Comprehensive Kundali Analysis', 105, 40, { align: 'center' });
    
    // Add logo placeholder
    doc.setFontSize(12);
    doc.text('AyuAstro - Vedic Astrology Consultation', 105, 60, { align: 'center' });
    
    // Birth Details Section
    yPosition = 80;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'जन्म विवरण' : 'Birth Details', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const birthDetails = [
      `${language === 'hi' ? 'नाम:' : 'Name:'} ${kundaliData.birthData.fullName}`,
      `${language === 'hi' ? 'जन्म तिथि:' : 'Date of Birth:'} ${kundaliData.birthData.date.toLocaleDateString()}`,
      `${language === 'hi' ? 'समय:' : 'Time:'} ${kundaliData.birthData.time}`,
      `${language === 'hi' ? 'स्थान:' : 'Place:'} ${kundaliData.birthData.place}`,
      `${language === 'hi' ? 'अक्षांश:' : 'Latitude:'} ${kundaliData.birthData.latitude.toFixed(4)}°`,
      `${language === 'hi' ? 'देशांतर:' : 'Longitude:'} ${kundaliData.birthData.longitude.toFixed(4)}°`
    ];
    
    birthDetails.forEach(detail => {
      doc.text(detail, margin, yPosition);
      yPosition += lineHeight;
    });
    
    // Core Chart Analysis
    checkPageBreak(40);
    yPosition += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'मुख्य चार्ट विश्लेषण' : 'Core Chart Analysis', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const coreAnalysis = [
      `${language === 'hi' ? 'लग्न (उदयकालीन राशि):' : 'Ascendant (Rising Sign):'} ${kundaliData.enhancedCalculations.lagna.signName} (${kundaliData.enhancedCalculations.lagna.degree.toFixed(2)}°)`,
      `${language === 'hi' ? 'चन्द्र राशि:' : 'Moon Sign:'} ${kundaliData.enhancedCalculations.planets.MO.rashiName}`,
      `${language === 'hi' ? 'सूर्य राशि:' : 'Sun Sign:'} ${kundaliData.enhancedCalculations.planets.SU.rashiName}`,
      `${language === 'hi' ? 'जन्म नक्षत्र:' : 'Birth Nakshatra:'} ${kundaliData.enhancedCalculations.planets.MO.nakshatraName} (${kundaliData.enhancedCalculations.planets.MO.nakshatraPada} पाद/Pada)`
    ];
    
    coreAnalysis.forEach(detail => {
      doc.text(detail, margin, yPosition);
      yPosition += lineHeight;
    });
    
    // Planetary Positions
    checkPageBreak(60);
    yPosition += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'ग्रह स्थिति' : 'Planetary Positions', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Planet', margin, yPosition);
    doc.text('Sign', margin + 40, yPosition);
    doc.text('Degree', margin + 70, yPosition);
    doc.text('Nakshatra', margin + 100, yPosition);
    doc.text('Strength', margin + 140, yPosition);
    doc.text('Status', margin + 170, yPosition);
    
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    
    Object.values(kundaliData.enhancedCalculations.planets).forEach(planet => {
      checkPageBreak();
      doc.text(planet.name, margin, yPosition);
      doc.text(planet.rashiName, margin + 40, yPosition);
      doc.text(`${planet.degreeInSign.toFixed(1)}°`, margin + 70, yPosition);
      doc.text(planet.nakshatraName, margin + 100, yPosition);
      doc.text(`${planet.shadbala.toFixed(0)}%`, margin + 140, yPosition);
      doc.text(planet.dignity, margin + 170, yPosition);
      yPosition += 5;
    });
    
    // Yogas Analysis
    checkPageBreak(40);
    yPosition += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'योग विश्लेषण' : 'Yoga Analysis', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (kundaliData.enhancedCalculations.yogas.length > 0) {
      kundaliData.enhancedCalculations.yogas.forEach(yoga => {
        checkPageBreak(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`${yoga.name} (${yoga.sanskritName})`, margin, yPosition);
        yPosition += 6;
        
        doc.setFont('helvetica', 'normal');
        const height = addWrappedText(yoga.description, margin, yPosition, 170);
        yPosition += height + 3;
        
        doc.text(`${language === 'hi' ? 'प्रभाव:' : 'Effects:'} ${yoga.effects.join(', ')}`, margin, yPosition);
        yPosition += 6;
        
        doc.text(`${language === 'hi' ? 'शक्ति:' : 'Strength:'} ${yoga.strength}% (${yoga.type})`, margin, yPosition);
        yPosition += 10;
      });
    } else {
      doc.text(language === 'hi' ? 'कोई विशेष योग नहीं मिला' : 'No specific yogas found', margin, yPosition);
      yPosition += 10;
    }
    
    // Dasha Analysis
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'दशा विश्लेषण (विंशोत्तरी)' : 'Dasha Analysis (Vimshottari)', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    kundaliData.enhancedCalculations.dashas.slice(0, 5).forEach(dasha => {
      checkPageBreak(15);
      const status = dasha.isActive ? (language === 'hi' ? ' (वर्तमान)' : ' (Current)') : '';
      doc.setFont('helvetica', 'bold');
      doc.text(`${dasha.planet} ${language === 'hi' ? 'दशा' : 'Dasha'}${status}`, margin, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`${language === 'hi' ? 'अवधि:' : 'Period:'} ${dasha.startDate.toLocaleDateString()} - ${dasha.endDate.toLocaleDateString()}`, margin, yPosition);
      yPosition += 5;
      doc.text(`${language === 'hi' ? 'कुल समय:' : 'Duration:'} ${dasha.years} ${language === 'hi' ? 'वर्ष' : 'years'}${dasha.months ? ` ${dasha.months} ${language === 'hi' ? 'महीने' : 'months'}` : ''}`, margin, yPosition);
      yPosition += 8;
    });
    
    // Personality Analysis
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'व्यक्तित्व विश्लेषण' : 'Personality Analysis', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'मुख्य गुण:' : 'Core Traits:', margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    kundaliData.interpretations.personality.coreTraits.forEach(trait => {
      checkPageBreak();
      doc.text(`• ${trait}`, margin + 5, yPosition);
      yPosition += 5;
    });
    
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'शक्तियां:' : 'Strengths:', margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    kundaliData.interpretations.personality.strengths.forEach(strength => {
      checkPageBreak();
      doc.text(`• ${strength}`, margin + 5, yPosition);
      yPosition += 5;
    });
    
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'चुनौतियां:' : 'Challenges:', margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    kundaliData.interpretations.personality.challenges.forEach(challenge => {
      checkPageBreak();
      doc.text(`• ${challenge}`, margin + 5, yPosition);
      yPosition += 5;
    });
    
    // Career Guidance
    checkPageBreak(30);
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'करियर मार्गदर्शन:' : 'Career Guidance:', margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    kundaliData.interpretations.personality.careerAptitude.forEach(aptitude => {
      checkPageBreak();
      doc.text(`• ${aptitude}`, margin + 5, yPosition);
      yPosition += 5;
    });
    
    // Life Phase Predictions
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'जीवन चरण भविष्यवाणी' : 'Life Phase Predictions', margin, yPosition);
    
    yPosition += 10;
    
    const phases = [
      { key: 'childhood', title: language === 'hi' ? 'बचपन' : 'Childhood' },
      { key: 'youth', title: language === 'hi' ? 'युवावस्था' : 'Youth' },
      { key: 'adulthood', title: language === 'hi' ? 'प्रौढ़ावस्था' : 'Adulthood' },
      { key: 'maturity', title: language === 'hi' ? 'वृद्धावस्था' : 'Maturity' }
    ];
    
    phases.forEach(phase => {
      checkPageBreak(40);
      const phaseData = kundaliData.interpretations.predictions[phase.key as keyof typeof kundaliData.interpretations.predictions];
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${phase.title} (${phaseData.ageRange})`, margin, yPosition);
      yPosition += 8;
      
      // General Trends
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(language === 'hi' ? 'सामान्य प्रवृत्तियां:' : 'General Trends:', margin, yPosition);
      yPosition += 5;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      phaseData.generalTrends.forEach(trend => {
        checkPageBreak();
        doc.text(`• ${trend}`, margin + 5, yPosition);
        yPosition += 4;
      });
      
      yPosition += 3;
      
      // Career
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(language === 'hi' ? 'करियर:' : 'Career:', margin, yPosition);
      yPosition += 5;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      phaseData.career.forEach(career => {
        checkPageBreak();
        doc.text(`• ${career}`, margin + 5, yPosition);
        yPosition += 4;
      });
      
      yPosition += 5;
    });
    
    // Remedies
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'उपाय सुझाव' : 'Remedy Suggestions', margin, yPosition);
    
    yPosition += 10;
    
    // Gemstones
    if (kundaliData.interpretations.remedies.gemstones.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(language === 'hi' ? 'रत्न:' : 'Gemstones:', margin, yPosition);
      yPosition += 6;
      
      kundaliData.interpretations.remedies.gemstones.forEach(gem => {
        checkPageBreak(25);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${gem.stone} (${gem.planet} ${language === 'hi' ? 'के लिए' : 'for'})`, margin, yPosition);
        yPosition += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`${language === 'hi' ? 'वजन:' : 'Weight:'} ${gem.weight}, ${language === 'hi' ? 'धातु:' : 'Metal:'} ${gem.metal}`, margin + 5, yPosition);
        yPosition += 4;
        doc.text(`${language === 'hi' ? 'उंगली:' : 'Finger:'} ${gem.finger}, ${language === 'hi' ? 'दिन:' : 'Day:'} ${gem.day}`, margin + 5, yPosition);
        yPosition += 6;
      });
    }
    
    // Mantras
    if (kundaliData.interpretations.remedies.mantras.length > 0) {
      checkPageBreak(30);
      yPosition += 5;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(language === 'hi' ? 'मंत्र:' : 'Mantras:', margin, yPosition);
      yPosition += 6;
      
      kundaliData.interpretations.remedies.mantras.forEach(mantra => {
        checkPageBreak(20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${mantra.planet} ${language === 'hi' ? 'मंत्र' : 'Mantra'}:`, margin, yPosition);
        yPosition += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.text(mantra.mantra, margin + 5, yPosition);
        yPosition += 4;
        doc.text(`${language === 'hi' ? 'जाप संख्या:' : 'Count:'} ${mantra.count.toLocaleString()}, ${language === 'hi' ? 'अवधि:' : 'Duration:'} ${mantra.duration}`, margin + 5, yPosition);
        yPosition += 6;
      });
    }
    
    // Compatibility Analysis
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'संगतता विश्लेषण' : 'Compatibility Analysis', margin, yPosition);
    
    yPosition += 10;
    
    // Marriage Compatibility
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'hi' ? 'विवाह संगतता:' : 'Marriage Compatibility:', margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${language === 'hi' ? 'मंगल दोष स्थिति:' : 'Mangal Dosha Status:'} ${kundaliData.interpretations.compatibility.marriageCompatibility.mangalDoshaStatus}`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`${language === 'hi' ? 'अनुशंसित आयु:' : 'Recommended Age:'} ${kundaliData.interpretations.compatibility.marriageCompatibility.recommendedAge}`, margin + 5, yPosition);
    yPosition += 5;
    
    doc.text(`${language === 'hi' ? 'संगत राशियां:' : 'Compatible Signs:'} ${kundaliData.interpretations.compatibility.marriageCompatibility.compatibleSigns.join(', ')}`, margin + 5, yPosition);
    yPosition += 8;
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by AyuAstro - Professional Vedic Astrology Consultation', 105, pageHeight - 10, { align: 'center' });
    doc.text('This is a computer-generated report. Please consult a qualified astrologer for detailed analysis.', 105, pageHeight - 6, { align: 'center' });
    
    // Save the PDF
    const fileName = `comprehensive-kundali-${kundaliData.birthData.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {language === 'hi' ? 'संपूर्ण कुंडली PDF' : 'Comprehensive Kundali PDF'}
        </h3>
        <p className="text-sm text-orange-700 mb-4">
          {language === 'hi' 
            ? 'अपनी विस्तृत कुंडली विश्लेषण को PDF फॉर्मेट में डाउनलोड करें जिसमें शामिल है:'
            : 'Download your detailed Kundali analysis in PDF format including:'
          }
        </p>
        <ul className="text-sm text-orange-600 space-y-1 mb-4">
          <li>• {language === 'hi' ? 'जन्म विवरण और मुख्य चार्ट विश्लेषण' : 'Birth details and core chart analysis'}</li>
          <li>• {language === 'hi' ? 'ग्रह स्थिति और शक्ति विश्लेषण' : 'Planetary positions and strength analysis'}</li>
          <li>• {language === 'hi' ? 'योग और दशा विश्लेषण' : 'Yoga and Dasha analysis'}</li>
          <li>• {language === 'hi' ? 'व्यक्तित्व और करियर मार्गदर्शन' : 'Personality and career guidance'}</li>
          <li>• {language === 'hi' ? 'जीवन चरण भविष्यवाणी' : 'Life phase predictions'}</li>
          <li>• {language === 'hi' ? 'उपाय सुझाव और संगतता विश्लेषण' : 'Remedy suggestions and compatibility analysis'}</li>
        </ul>
        
        <Button 
          onClick={generateComprehensivePDF} 
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          {language === 'hi' ? 'संपूर्ण कुंडली PDF डाउनलोड करें' : 'Download Comprehensive Kundali PDF'}
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
        <p className="font-medium mb-1">
          {language === 'hi' ? 'महत्वपूर्ण सूचना:' : 'Important Note:'}
        </p>
        <p>
          {language === 'hi' 
            ? 'यह एक कंप्यूटर जनरेटेड रिपोर्ट है। विस्तृत विश्लेषण के लिए कृपया किसी योग्य ज्योतिषी से सलाह लें।'
            : 'This is a computer-generated report. Please consult with a qualified astrologer for detailed analysis and interpretation.'
          }
        </p>
      </div>
    </div>
  );
};

export default EnhancedKundaliPDFExport;
