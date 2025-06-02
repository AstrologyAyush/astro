
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from 'jspdf';
import { KundaliChart, BirthData, getPlanetDetails, getZodiacDetails } from '@/lib/kundaliUtils';

interface KundaliPDFExportProps {
  chart: KundaliChart;
  birthData: BirthData;
  language: 'hi' | 'en';
}

const KundaliPDFExport: React.FC<KundaliPDFExportProps> = ({ chart, birthData, language }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Title
    doc.setFontSize(20);
    doc.text(language === 'hi' ? 'कुंडली रिपोर्ट' : 'Kundali Report', 20, 20);
    
    // Birth Details
    doc.setFontSize(14);
    doc.text(language === 'hi' ? 'जन्म विवरण:' : 'Birth Details:', 20, 40);
    
    doc.setFontSize(12);
    const birthDetails = [
      `${language === 'hi' ? 'नाम:' : 'Name:'} ${birthData.fullName || 'Unknown'}`,
      `${language === 'hi' ? 'जन्म तारीख:' : 'Date of Birth:'} ${birthData.date}`,
      `${language === 'hi' ? 'समय:' : 'Time:'} ${birthData.time}`,
      `${language === 'hi' ? 'स्थान:' : 'Place:'} ${birthData.place}`,
    ];
    
    birthDetails.forEach((detail, index) => {
      doc.text(detail, 20, 50 + (index * 8));
    });
    
    // Chart Details
    doc.setFontSize(14);
    doc.text(language === 'hi' ? 'कुंडली विवरण:' : 'Chart Details:', 20, 90);
    
    doc.setFontSize(12);
    const planets = Array.isArray(chart.planets) ? chart.planets : Object.values(chart.planets);
    const sun = planets.find(p => p.id === "SU");
    const moon = planets.find(p => p.id === "MO");
    const birthElement = getZodiacDetails(chart.ascendant)?.element || 'Unknown';
    
    const chartDetails = [
      `${language === 'hi' ? 'लग्न:' : 'Ascendant:'} ${getZodiacDetails(chart.ascendant)?.name || 'Unknown'}`,
      `${language === 'hi' ? 'चन्द्र राशि:' : 'Moon Sign:'} ${getZodiacDetails(chart.moonSign)?.name || 'Unknown'}`,
      `${language === 'hi' ? 'सूर्य राशि:' : 'Sun Sign:'} ${getZodiacDetails(chart.sunSign)?.name || 'Unknown'}`,
      `${language === 'hi' ? 'तत्व:' : 'Birth Element:'} ${birthElement}`,
    ];
    
    chartDetails.forEach((detail, index) => {
      doc.text(detail, 20, 100 + (index * 8));
    });
    
    // Planetary Positions
    doc.setFontSize(14);
    doc.text(language === 'hi' ? 'ग्रह स्थिति:' : 'Planetary Positions:', 20, 140);
    
    doc.setFontSize(10);
    let yPosition = 150;
    
    planets.forEach((planet) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      
      const planetDetails = getPlanetDetails(planet.id);
      const zodiacDetails = getZodiacDetails(planet.rashi);
      
      const planetInfo = `${planetDetails?.name || planet.id}: ${zodiacDetails?.name || 'Unknown'} (${planet.degree?.toFixed(2) || '0.00'}°)`;
      doc.text(planetInfo, 20, yPosition);
      yPosition += 6;
    });
    
    // Yogas
    if (chart.yogas && chart.yogas.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text(language === 'hi' ? 'योग:' : 'Yogas:', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      chart.yogas.forEach((yoga) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        const yogaInfo = `• ${yoga.name}`;
        doc.text(yogaInfo, 20, yPosition);
        yPosition += 6;
      });
    }
    
    // Dasha Periods
    if (chart.dashaPeriods && chart.dashaPeriods.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text(language === 'hi' ? 'महादशा अवधि:' : 'Dasha Periods:', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      chart.dashaPeriods.slice(0, 5).forEach((dasha) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        const planetDetails = getPlanetDetails(dasha.planet);
        const dashaInfo = `• ${planetDetails?.name || dasha.planet}: ${dasha.years} ${language === 'hi' ? 'वर्ष' : 'years'}`;
        doc.text(dashaInfo, 20, yPosition);
        yPosition += 6;
      });
    }
    
    // Save the PDF
    const fileName = `kundali-${birthData.fullName || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <Button onClick={generatePDF} className="w-full sm:w-auto">
      <Download className="w-4 h-4 mr-2" />
      {language === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF'}
    </Button>
  );
};

export default KundaliPDFExport;
