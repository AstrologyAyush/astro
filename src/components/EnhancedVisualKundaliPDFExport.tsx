
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Image, FileText } from "lucide-react";
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";
import KundaliChartGenerator from './KundaliChartGenerator';

interface EnhancedVisualKundaliPDFExportProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const EnhancedVisualKundaliPDFExport: React.FC<EnhancedVisualKundaliPDFExportProps> = ({ 
  kundaliData, 
  language 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [chartImageUrl, setChartImageUrl] = useState<string>('');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Extract planets data from kundaliData
  const extractPlanetsData = () => {
    if (!kundaliData?.enhancedCalculations?.planets) {
      return [];
    }

    return Object.values(kundaliData.enhancedCalculations.planets).map((planet: any) => ({
      id: planet.id || planet.name?.substring(0, 2).toUpperCase(),
      name: planet.name,
      rashi: planet.rashi - 1, // Convert to 0-based index
      degree: planet.degreeInSign || planet.degree,
      house: planet.house || 1
    }));
  };

  const generateEnhancedPDF = async () => {
    if (!chartImageUrl) {
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation("Chart image not ready. Please wait.", "चार्ट इमेज तैयार नहीं है। कृपया प्रतीक्षा करें।"),
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = 297;
      const margin = 20;
      const lineHeight = 6;

      // Helper function to add new page if needed
      const checkPageBreak = (requiredSpace: number = 20) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
      };

      // Cover Page with Enhanced Design
      doc.setFillColor(90, 75, 218); // Purple gradient start
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text(getTranslation('COMPREHENSIVE KUNDALI REPORT', 'संपूर्ण कुंडली रिपोर्ट'), 105, 25, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(getTranslation('With Visual Chart Analysis', 'दृश्य चार्ट विश्लेषण के साथ'), 105, 35, { align: 'center' });

      // Add decorative elements
      doc.setFillColor(255, 215, 0); // Gold
      doc.circle(30, 60, 8, 'F');
      doc.circle(180, 60, 8, 'F');

      // Birth Details Section with enhanced styling
      yPosition = 80;
      doc.setFillColor(255, 248, 220); // Light cream background
      doc.rect(margin, yPosition - 5, 170, 35, 'F');
      
      doc.setTextColor(139, 69, 19); // Saddle brown
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(getTranslation('Birth Details', 'जन्म विवरण'), margin + 5, yPosition + 5);
      
      yPosition += 15;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      const birthDetails = [
        `${getTranslation('Name:', 'नाम:')} ${kundaliData.birthData?.fullName || 'Not provided'}`,
        `${getTranslation('Date:', 'दिनांक:')} ${kundaliData.birthData?.date || 'Not provided'}`,
        `${getTranslation('Time:', 'समय:')} ${kundaliData.birthData?.time || 'Not provided'}`,
        `${getTranslation('Place:', 'स्थान:')} ${kundaliData.birthData?.place || 'Not provided'}`
      ];

      birthDetails.forEach(detail => {
        doc.text(detail, margin + 10, yPosition);
        yPosition += 6;
      });

      // Add Kundali Chart Image
      yPosition += 15;
      checkPageBreak(100);
      
      doc.setFillColor(240, 248, 255); // Light blue background
      doc.rect(margin, yPosition - 5, 170, 110, 'F');
      
      doc.setTextColor(25, 25, 112); // Midnight blue
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(getTranslation('🪐 Birth Chart (D1 - Rashi Chart)', '🪐 जन्म चार्ट (डी1 - राशि चार्ट)'), margin + 5, yPosition + 10);

      // Add the chart image (centered)
      const chartSize = 80;
      const chartX = (210 - chartSize) / 2; // Center horizontally
      doc.addImage(chartImageUrl, 'PNG', chartX, yPosition + 15, chartSize, chartSize);
      
      yPosition += 105;

      // Planetary Positions with enhanced table
      checkPageBreak(60);
      yPosition += 10;
      
      doc.setFillColor(255, 240, 245); // Light pink background
      doc.rect(margin, yPosition - 5, 170, 8, 'F');
      
      doc.setTextColor(139, 0, 139); // Dark magenta
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(getTranslation('📊 Planetary Positions', '📊 ग्रह स्थिति'), margin + 5, yPosition + 2);
      
      yPosition += 15;

      // Table headers with background
      doc.setFillColor(230, 230, 250); // Lavender
      doc.rect(margin, yPosition - 3, 170, 8, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Planet', margin + 5, yPosition + 2);
      doc.text('Sign', margin + 35, yPosition + 2);
      doc.text('Degree', margin + 65, yPosition + 2);
      doc.text('House', margin + 90, yPosition + 2);
      doc.text('Nakshatra', margin + 115, yPosition + 2);
      doc.text('Strength', margin + 150, yPosition + 2);
      
      yPosition += 10;
      doc.setFont('helvetica', 'normal');

      if (kundaliData?.enhancedCalculations?.planets) {
        Object.values(kundaliData.enhancedCalculations.planets).forEach((planet: any, index) => {
          checkPageBreak(8);
          
          // Alternate row colors
          if (index % 2 === 0) {
            doc.setFillColor(248, 248, 255);
            doc.rect(margin, yPosition - 2, 170, 6, 'F');
          }
          
          doc.setTextColor(0, 0, 0);
          doc.text(planet.name || 'Unknown', margin + 5, yPosition + 2);
          doc.text(planet.rashiName || 'Unknown', margin + 35, yPosition + 2);
          doc.text(`${(planet.degreeInSign || 0).toFixed(1)}°`, margin + 65, yPosition + 2);
          doc.text((planet.house || 1).toString(), margin + 90, yPosition + 2);
          doc.text(planet.nakshatraName || 'Unknown', margin + 115, yPosition + 2);
          doc.text(`${(planet.shadbala || 0).toFixed(0)}%`, margin + 150, yPosition + 2);
          
          yPosition += 6;
        });
      }

      // Add a new page for additional sections
      doc.addPage();
      yPosition = margin;

      // Personality Analysis with icons
      doc.setFillColor(255, 255, 224); // Light yellow background
      doc.rect(margin, yPosition - 5, 170, 8, 'F');
      
      doc.setTextColor(184, 134, 11); // Dark gold
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(getTranslation('🧠 Personality Analysis', '🧠 व्यक्तित्व विश्लेषण'), margin + 5, yPosition + 2);
      
      yPosition += 15;
      
      if (kundaliData?.interpretations?.personality) {
        const personality = kundaliData.interpretations.personality;
        
        // Core Traits
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 100, 0); // Dark green
        doc.text(getTranslation('✨ Core Traits:', '✨ मुख्य गुण:'), margin + 5, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        if (personality.coreTraits) {
          personality.coreTraits.slice(0, 5).forEach((trait: string) => {
            checkPageBreak();
            doc.text(`• ${trait}`, margin + 10, yPosition);
            yPosition += 5;
          });
        }
      }

      // Footer with enhanced design
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('Generated by AyuAstro - Professional Vedic Astrology Platform', 105, pageHeight - 15, { align: 'center' });
      doc.text('🔮 Powered by Advanced Astronomical Calculations & AI Analysis', 105, pageHeight - 10, { align: 'center' });
      doc.text('This report combines traditional Vedic wisdom with modern technology', 105, pageHeight - 5, { align: 'center' });

      // Save the PDF
      const fileName = `enhanced-visual-kundali-${kundaliData.birthData?.fullName?.replace(/\s+/g, '-') || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: getTranslation("PDF Generated Successfully", "PDF सफलतापूर्वक बनाया गया"),
        description: getTranslation("Your enhanced visual Kundali report has been downloaded", "आपकी उन्नत दृश्य कुंडली रिपोर्ट डाउनलोड हो गई है")
      });

    } catch (error) {
      console.error('Error generating enhanced PDF:', error);
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation("Failed to generate PDF report", "PDF रिपोर्ट बनाने में असफल"),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Generator (Hidden) */}
      <div className="hidden">
        <KundaliChartGenerator
          planets={extractPlanetsData()}
          chartType="north"
          size={400}
          onImageGenerated={setChartImageUrl}
        />
      </div>

      {/* Enhanced PDF Export Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
          <Image className="h-6 w-6" />
          {getTranslation('Enhanced Visual Kundali PDF', 'उन्नत दृश्य कुंडली PDF')}
        </h3>
        
        <p className="text-sm text-purple-700 mb-4">
          {getTranslation(
            'Download your comprehensive Kundali report with visual chart, enhanced design, and professional formatting including:',
            'अपनी व्यापक कुंडली रिपोर्ट को दृश्य चार्ट, उन्नत डिज़ाइन और पेशेवर फॉर्मेटिंग के साथ डाउनलोड करें जिसमें शामिल है:'
          )}
        </p>
        
        <ul className="text-sm text-purple-600 space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {getTranslation('Interactive Kundali Chart Visual', 'इंटरैक्टिव कुंडली चार्ट दृश्य')}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {getTranslation('Enhanced Professional Design Layout', 'उन्नत पेशेवर डिज़ाइन लेआउट')}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {getTranslation('Color-coded Planetary Information Table', 'रंग-कोडित ग्रहीय जानकारी तालिका')}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {getTranslation('Comprehensive Birth Details Section', 'व्यापक जन्म विवरण अनुभाग')}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {getTranslation('Professional Formatting with Icons & Graphics', 'आइकन और ग्राफिक्स के साथ पेशेवर फॉर्मेटिंग')}
          </li>
        </ul>
        
        <Button 
          onClick={generateEnhancedPDF}
          disabled={isGenerating || !chartImageUrl}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {getTranslation('Generating...', 'बनाया जा रहा है...')}
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              {getTranslation('📊 Download Enhanced Visual PDF', '📊 उन्नत दृश्य PDF डाउनलोड करें')}
            </>
          )}
        </Button>
        
        {!chartImageUrl && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {getTranslation('Chart is being generated...', 'चार्ट बनाया जा रहा है...')}
          </p>
        )}
      </div>
      
      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
        <p className="font-medium mb-1">
          {getTranslation('🎨 Visual Enhancement Features:', '🎨 दृश्य संवर्धन सुविधाएं:')}
        </p>
        <p>
          {getTranslation(
            'This enhanced PDF includes visual chart representation, professional color schemes, formatted tables, and improved readability for a premium astrological report experience.',
            'इस उन्नत PDF में दृश्य चार्ट प्रतिनिधित्व, पेशेवर रंग योजनाएं, स्वरूपित तालिकाएं, और प्रीमियम ज्योतिषीय रिपोर्ट अनुभव के लिए बेहतर पठनीयता शामिल है।'
          )}
        </p>
      </div>
    </div>
  );
};

export default EnhancedVisualKundaliPDFExport;
