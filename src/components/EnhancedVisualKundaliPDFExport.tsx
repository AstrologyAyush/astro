
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFGenerator } from '../lib/pdfUtils';
import KundaliChartGenerator from './KundaliChartGenerator';
import PlanetaryStrengthChart from './PlanetaryStrengthChart';
import DashaTimelineChart from './DashaTimelineChart';
import YogaStrengthIndicators from './YogaStrengthIndicators';

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
  const [strengthChartUrl, setStrengthChartUrl] = useState<string>('');
  const [dashaTimelineUrl, setDashaTimelineUrl] = useState<string>('');
  const [yogaIndicatorsUrl, setYogaIndicatorsUrl] = useState<string>("");

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
      rashi: planet.rashi - 1,
      degree: planet.degreeInSign || planet.degree,
      house: planet.house || 1,
      shadbala: planet.shadbala || 0
    }));
  };

  // Extract dashas data from kundaliData
  const extractDashasData = () => {
    if (!kundaliData?.enhancedCalculations?.dashas) {
      return [];
    }

    return kundaliData.enhancedCalculations.dashas.map((dasha: any) => ({
      planet: dasha.planet,
      startDate: dasha.startDate,
      endDate: dasha.endDate,
      years: dasha.years,
      months: dasha.months,
      isActive: dasha.isActive
    }));
  };

  // Extract yogas data for visualization
  const extractYogasData = () => {
    if (!kundaliData?.enhancedCalculations?.yogas) return [];
    return kundaliData.enhancedCalculations.yogas.map((y: any) => ({
      name: y.name,
      strength: y.strength || 0,
      type: y.type,
      sanskritName: y.sanskritName,
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
      const pdfGen = new PDFGenerator();
      let yPosition = 20;

      // Cover Page
      pdfGen.addCoverPage(
        getTranslation('COMPREHENSIVE KUNDALI REPORT', 'संपूर्ण कुंडली रिपोर्ट'),
        getTranslation('With Visual Charts & Timeline Analysis', 'दृश्य चार्ट और समयरेखा विश्लेषण के साथ')
      );

      // Birth Details Section
      yPosition = 80;
      yPosition = pdfGen.addBirthDetailsSection(kundaliData.birthData, yPosition);

      // Add Charts
      yPosition = pdfGen.addImageSection(
        getTranslation('🪐 Birth Chart (D1 - Rashi Chart)', '🪐 जन्म चार्ट (डी1 - राशि चार्ट)'),
        chartImageUrl,
        yPosition,
        80,
        80
      );

      if (dashaTimelineUrl) {
        yPosition = pdfGen.addImageSection(
          getTranslation('⏰ Dasha Timeline Analysis', '⏰ दशा समयरेखा विश्लेषण'),
          dashaTimelineUrl,
          yPosition,
          160,
          80
        );
      }

      if (strengthChartUrl) {
        yPosition = pdfGen.addImageSection(
          getTranslation('📊 Planetary Strength Analysis', '📊 ग्रहीय शक्ति विश्लेषण'),
          strengthChartUrl,
          yPosition,
          160,
          100
        );
      }

      // Planetary Table
      pdfGen.addPlanetaryTable(kundaliData?.enhancedCalculations?.planets, yPosition);

      // Add new page for personality analysis
      const doc = pdfGen.getDocument();
      doc.addPage();
      yPosition = 20;

      // Personality Analysis
      if (kundaliData?.interpretations?.personality) {
        const personality = kundaliData.interpretations.personality;
        const margin = 20;
        
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
            yPosition = pdfGen.checkPageBreak(8, yPosition);
            doc.text(`• ${trait}`, margin + 10, yPosition);
            yPosition += 5;
          });
        }
      }

      // Footer
      pdfGen.addFooter();

      // Save
      const fileName = `enhanced-visual-kundali-${kundaliData.birthData?.fullName?.replace(/\s+/g, '-') || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdfGen.save(fileName);

      toast({
        title: getTranslation("PDF Generated Successfully", "PDF सफलतापूर्वक बनाया"),
        description: getTranslation("Your enhanced visual Kundali report with timeline analysis has been downloaded", "समयरेखा विश्लेषण के साथ आपकी उन्नत दृश्य कुंडली रिपोर्ट डाउनलोड हो गई है")
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
      {/* Chart Generators (Hidden) */}
      <div className="hidden">
        <KundaliChartGenerator
          planets={extractPlanetsData()}
          chartType="north"
          size={400}
          onImageGenerated={setChartImageUrl}
        />
        <PlanetaryStrengthChart
          planets={extractPlanetsData()}
          onImageGenerated={setStrengthChartUrl}
          width={600}
          height={400}
        />
        <DashaTimelineChart
          dashas={extractDashasData()}
          onImageGenerated={setDashaTimelineUrl}
          width={700}
          height={300}
        />
        <YogaStrengthIndicators
          yogas={extractYogasData()}
          onImageGenerated={setYogaIndicatorsUrl}
          width={600}
          height={110}
        />
      </div>

      {/* Enhanced PDF Export Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
          <Image className="h-5 w-5 sm:h-6 sm:w-6" />
          {getTranslation('Enhanced Visual Kundali PDF', 'उन्नत दृश्य कुंडली PDF')}
        </h3>
        
        <p className="text-sm text-purple-700 mb-4">
          {getTranslation(
            'Download your comprehensive Kundali report with visual charts, planetary strength analysis, Dasha timeline, and professional formatting including:',
            'अपनी व्यापक कुंडली रिपोर्ट को दृश्य चार्ट, ग्रहीय शक्ति विश्लेषण, दशा समयरेखा और पेशेवर फॉर्मेटिंग के साथ डाउनलोड करें जिसमें शामिल है:'
          )}
        </p>
        
        <ul className="text-sm text-purple-600 space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {getTranslation('Interactive Kundali Chart Visual', 'इंटरैक्टिव कुंडली चार्ट दृश्य')}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {getTranslation('Dasha Timeline Visualization (NEW)', 'दशा समयरेखा दृश्यीकरण (नया)')}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {getTranslation('Planetary Strength Bar Chart Analysis', 'ग्रहीय शक्ति बार चार्ट विश्लेषण')}
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
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white min-h-[44px]"
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
        
        {(!chartImageUrl || !strengthChartUrl || !dashaTimelineUrl) && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {getTranslation('Charts are being generated...', 'चार्ट बनाए जा रहे हैं...')}
          </p>
        )}
      </div>
      
      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
        <p className="font-medium mb-1">
          {getTranslation('🎨 Enhanced Visual Features:', '🎨 उन्नत दृश्य सुविधाएं:')}
        </p>
        <p>
          {getTranslation(
            'This enhanced PDF now includes visual chart representation, Dasha timeline visualization, planetary strength bar charts, professional color schemes, formatted tables, and improved readability for a premium astrological report experience.',
            'इस उन्नत PDF में अब दृश्य चार्ट प्रतिनिधित्व, दशा समयरेखा दृश्यीकरण, ग्रहीय शक्ति बार चार्ट, पेशेवर रंग योजनाएं, स्वरूपित तालिकाएं, और प्रीमियम ज्योतिषीय रिपोर्ट अनुभव के लिए बेहतर पठनीयता शामिल है।'
          )}
        </p>
      </div>
    </div>
  );
};

export default EnhancedVisualKundaliPDFExport;
