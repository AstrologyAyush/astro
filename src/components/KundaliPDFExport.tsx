
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { BirthData, KundaliChart as KundaliChartType } from '@/lib/kundaliUtils';
import { NumerologyProfile } from '@/lib/numerologyUtils';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

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

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let currentY = margin;

      // Set font
      pdf.setFont('helvetica');

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      const title = language === 'hi' ? 'वैदिक कुंडली रिपोर्ट' : 'Vedic Kundali Report';
      pdf.text(title, pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;

      // Add decorative line
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;

      // Personal Details Section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const personalTitle = language === 'hi' ? 'व्यक्तिगत विवरण' : 'Personal Details';
      pdf.text(personalTitle, margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const personalDetails = [
        `${language === 'hi' ? 'नाम' : 'Name'}: ${birthData.fullName}`,
        `${language === 'hi' ? 'जन्म तिथि' : 'Birth Date'}: ${new Date(birthData.date).toLocaleDateString()}`,
        `${language === 'hi' ? 'जन्म समय' : 'Birth Time'}: ${birthData.time}`,
        `${language === 'hi' ? 'जन्म स्थान' : 'Birth Place'}: ${birthData.place}`,
        `${language === 'hi' ? 'अक्षांश' : 'Latitude'}: ${birthData.latitude}°`,
        `${language === 'hi' ? 'देशांतर' : 'Longitude'}: ${birthData.longitude}°`
      ];

      personalDetails.forEach(detail => {
        pdf.text(detail, margin, currentY);
        currentY += 5;
      });
      currentY += 5;

      // Main Astrological Information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const astroTitle = language === 'hi' ? 'मुख्य ज्योतिषीय जानकारी' : 'Main Astrological Information';
      pdf.text(astroTitle, margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const astroInfo = [
        `${language === 'hi' ? 'लग्न (Ascendant)' : 'Ascendant'}: ${chart.ascendantSanskrit} (${chart.ascendant})`,
        `${language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}: ${chart.planets.find(p => p.id === "MO")?.signSanskrit || 'N/A'}`,
        `${language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}: ${chart.planets.find(p => p.id === "SU")?.signSanskrit || 'N/A'}`,
        `${language === 'hi' ? 'जन्म तत्त्व' : 'Birth Element'}: ${chart.birthElement}`
      ];

      astroInfo.forEach(info => {
        pdf.text(info, margin, currentY);
        currentY += 5;
      });
      currentY += 10;

      // Planetary Positions Table
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const planetTitle = language === 'hi' ? 'ग्रह स्थिति' : 'Planetary Positions';
      pdf.text(planetTitle, margin, currentY);
      currentY += 8;

      // Table headers
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      const headers = language === 'hi' 
        ? ['ग्रह', 'राशि', 'अंश', 'नक्षत्र', 'भाव']
        : ['Planet', 'Sign', 'Degree', 'Nakshatra', 'House'];
      
      const colWidths = [30, 40, 25, 40, 25];
      let startX = margin;
      
      headers.forEach((header, index) => {
        pdf.text(header, startX, currentY);
        startX += colWidths[index];
      });
      currentY += 2;

      // Draw line under headers
      pdf.line(margin, currentY, margin + 160, currentY);
      currentY += 5;

      // Planet data
      pdf.setFont('helvetica', 'normal');
      chart.planets.forEach(planet => {
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = margin;
        }

        const houseNumber = chart.housesList.findIndex(sign => sign === planet.sign) + 1;
        const planetData = [
          `${planet.name}`,
          `${planet.signSanskrit}`,
          `${planet.degreeInSign?.toFixed(1)}°`,
          `${planet.nakshatra || 'N/A'}`,
          `${houseNumber}`
        ];

        startX = margin;
        planetData.forEach((data, index) => {
          pdf.text(data, startX, currentY);
          startX += colWidths[index];
        });
        currentY += 4;
      });
      currentY += 10;

      // Active Yogas
      const activeYogas = chart.yogas?.filter(y => y.present) || [];
      if (activeYogas.length > 0) {
        if (currentY > pageHeight - 50) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const yogaTitle = language === 'hi' ? 'सक्रिय योग' : 'Active Yogas';
        pdf.text(yogaTitle, margin, currentY);
        currentY += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        activeYogas.forEach(yoga => {
          if (currentY > pageHeight - 20) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(`• ${yoga.sanskritName} (${yoga.name})`, margin, currentY);
          currentY += 4;
          const description = pdf.splitTextToSize(yoga.description, contentWidth - 10);
          pdf.text(description, margin + 5, currentY);
          currentY += description.length * 4 + 2;
        });
        currentY += 5;
      }

      // Numerology Section
      if (numerologyData) {
        if (currentY > pageHeight - 80) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const numTitle = language === 'hi' ? 'अंकज्योतिष विश्लेषण' : 'Numerology Analysis';
        pdf.text(numTitle, margin, currentY);
        currentY += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const numData = [
          `${language === 'hi' ? 'मूलांक' : 'Life Path'}: ${numerologyData.lifePath}`,
          `${language === 'hi' ? 'भाग्यांक' : 'Expression'}: ${numerologyData.expression}`,
          `${language === 'hi' ? 'अंतरांक' : 'Soul Urge'}: ${numerologyData.soulUrge}`,
          `${language === 'hi' ? 'व्यक्तित्व अंक' : 'Personality'}: ${numerologyData.personality}`,
          `${language === 'hi' ? 'वर्तमान वर्ष' : 'Personal Year'}: ${numerologyData.personalYear}`
        ];

        numData.forEach(data => {
          pdf.text(data, margin, currentY);
          currentY += 5;
        });
        currentY += 10;
      }

      // Current Dasha Period
      if (chart.dashaPeriods && chart.dashaPeriods.length > 0) {
        if (currentY > pageHeight - 50) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const dashaTitle = language === 'hi' ? 'वर्तमान दशा काल' : 'Current Dasha Period';
        pdf.text(dashaTitle, margin, currentY);
        currentY += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const currentDasha = chart.dashaPeriods[0];
        const dashaInfo = [
          `${language === 'hi' ? 'महादशा' : 'Mahadasha'}: ${currentDasha.planetSanskrit} (${currentDasha.planet})`,
          `${language === 'hi' ? 'अवधि' : 'Duration'}: ${currentDasha.years} ${language === 'hi' ? 'वर्ष' : 'years'}`,
          `${language === 'hi' ? 'समाप्ति तिथि' : 'End Date'}: ${new Date(currentDasha.endDate).toLocaleDateString()}`
        ];

        dashaInfo.forEach(info => {
          pdf.text(info, margin, currentY);
          currentY += 5;
        });
        currentY += 10;
      }

      // AI Guru Recommendations
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const recoTitle = language === 'hi' ? 'AI गुरु के सुझाव' : 'AI Guru Recommendations';
      pdf.text(recoTitle, margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const recommendations = language === 'hi' 
        ? 'आपकी कुंडली के अनुसार, नियमित रूप से ध्यान और प्राणायाम का अभ्यास करें। अपने इष्ट देव की पूजा करें और सत्कर्म में लगे रहें। दान-पुण्य करें और अपने गुरु का आदर करें।'
        : 'According to your kundali, practice regular meditation and pranayama. Worship your chosen deity and engage in righteous actions. Perform charity and respect your guru.';

      const recoText = pdf.splitTextToSize(recommendations, contentWidth);
      pdf.text(recoText, margin, currentY);
      currentY += recoText.length * 4 + 10;

      // Footer/Disclaimer
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      const disclaimer = language === 'hi'
        ? '* यह रिपोर्ट केवल शैक्षणिक उद्देश्यों के लिए है। महत्वपूर्ण निर्णयों के लिए योग्य ज्योतिषी से सलाह लें।'
        : '* This report is for educational purposes only. Consult a qualified astrologer for important decisions.';
      
      const disclaimerText = pdf.splitTextToSize(disclaimer, contentWidth);
      pdf.text(disclaimerText, margin, pageHeight - 20);

      // Add page numbers using the correct method
      const totalPages = pdf.internal.pages.length - 1; // Subtract 1 because pages array includes a null element at index 0
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.text(`${language === 'hi' ? 'पृष्ठ' : 'Page'} ${i} ${language === 'hi' ? 'of' : 'of'} ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      // Save the PDF
      const fileName = `${birthData.fullName.replace(/\s+/g, '_')}_Kundali_Report.pdf`;
      pdf.save(fileName);

      toast({
        title: language === 'hi' ? "PDF डाउनलोड सफल" : "PDF Download Successful",
        description: language === 'hi' ? "आपकी कुंडली रिपोर्ट PDF में डाउनलोड हो गई है।" : "Your kundali report has been downloaded as PDF.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "PDF जेनरेशन में समस्या हुई है।" : "There was an issue generating the PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={generatePDF} className="w-full" variant="outline">
      <FileText className="h-4 w-4 mr-2" />
      {language === 'hi' ? 'कुंडली PDF डाउनलोड करें' : 'Download Kundali PDF'}
    </Button>
  );
};

export default KundaliPDFExport;
