
import jsPDF from 'jspdf';

export interface PDFSection {
  title: string;
  content: string | string[];
  yPosition: number;
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageHeight = 297;
  private margin = 20;
  private lineHeight = 6;

  constructor() {
    this.doc = new jsPDF();
  }

  checkPageBreak(requiredSpace: number = 20, yPosition: number): number {
    if (yPosition + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      return this.margin;
    }
    return yPosition;
  }

  addCoverPage(title: string, subtitle: string): void {
    this.doc.setFillColor(90, 75, 218);
    this.doc.rect(0, 0, 210, 40, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(28);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 105, 25, { align: 'center' });
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(subtitle, 105, 35, { align: 'center' });

    // Add decorative elements
    this.doc.setFillColor(255, 215, 0);
    this.doc.circle(30, 60, 8, 'F');
    this.doc.circle(180, 60, 8, 'F');
  }

  addBirthDetailsSection(birthData: any, yPosition: number): number {
    this.doc.setFillColor(255, 248, 220);
    this.doc.rect(this.margin, yPosition - 5, 170, 35, 'F');
    
    this.doc.setTextColor(139, 69, 19);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Birth Details', this.margin + 5, yPosition + 5);
    
    yPosition += 15;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);

    const details = [
      `Name: ${birthData?.fullName || 'Not provided'}`,
      `Date: ${birthData?.date || 'Not provided'}`,
      `Time: ${birthData?.time || 'Not provided'}`,
      `Place: ${birthData?.place || 'Not provided'}`
    ];

    details.forEach(detail => {
      this.doc.text(detail, this.margin + 10, yPosition);
      yPosition += 6;
    });

    return yPosition + 15;
  }

  addImageSection(title: string, imageUrl: string, yPosition: number, imageWidth: number = 80, imageHeight: number = 80): number {
    yPosition = this.checkPageBreak(imageHeight + 20, yPosition);
    
    this.doc.setFillColor(240, 248, 255);
    this.doc.rect(this.margin, yPosition - 5, 170, imageHeight + 25, 'F');
    
    this.doc.setTextColor(25, 25, 112);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 5, yPosition + 10);

    const imageX = (210 - imageWidth) / 2;
    this.doc.addImage(imageUrl, 'PNG', imageX, yPosition + 15, imageWidth, imageHeight);
    
    return yPosition + imageHeight + 25;
  }

  addPlanetaryTable(planets: any, yPosition: number): number {
    yPosition = this.checkPageBreak(60, yPosition);
    
    this.doc.setFillColor(255, 240, 245);
    this.doc.rect(this.margin, yPosition - 5, 170, 8, 'F');
    
    this.doc.setTextColor(139, 0, 139);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('📋 Detailed Planetary Information', this.margin + 5, yPosition + 2);
    
    yPosition += 15;

    // Table headers
    this.doc.setFillColor(230, 230, 250);
    this.doc.rect(this.margin, yPosition - 3, 170, 8, 'F');
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Planet', this.margin + 5, yPosition + 2);
    this.doc.text('Sign', this.margin + 35, yPosition + 2);
    this.doc.text('Degree', this.margin + 65, yPosition + 2);
    this.doc.text('House', this.margin + 90, yPosition + 2);
    this.doc.text('Nakshatra', this.margin + 115, yPosition + 2);
    this.doc.text('Strength', this.margin + 150, yPosition + 2);
    
    yPosition += 10;
    this.doc.setFont('helvetica', 'normal');

    if (planets) {
      Object.values(planets).forEach((planet: any, index) => {
        yPosition = this.checkPageBreak(8, yPosition);
        
        if (index % 2 === 0) {
          this.doc.setFillColor(248, 248, 255);
          this.doc.rect(this.margin, yPosition - 2, 170, 6, 'F');
        }
        
        this.doc.setTextColor(0, 0, 0);
        this.doc.text(planet.name || 'Unknown', this.margin + 5, yPosition + 2);
        this.doc.text(planet.rashiName || 'Unknown', this.margin + 35, yPosition + 2);
        this.doc.text(`${(planet.degreeInSign || 0).toFixed(1)}°`, this.margin + 65, yPosition + 2);
        this.doc.text((planet.house || 1).toString(), this.margin + 90, yPosition + 2);
        this.doc.text(planet.nakshatraName || 'Unknown', this.margin + 115, yPosition + 2);
        
        const strength = planet.shadbala || 0;
        this.setStrengthColor(strength);
        this.doc.text(`${strength.toFixed(0)}%`, this.margin + 150, yPosition + 2);
        this.doc.setTextColor(0, 0, 0);
        
        yPosition += 6;
      });
    }

    return yPosition;
  }

  private setStrengthColor(strength: number): void {
    if (strength >= 80) {
      this.doc.setTextColor(39, 174, 96);
    } else if (strength >= 60) {
      this.doc.setTextColor(243, 156, 18);
    } else if (strength >= 40) {
      this.doc.setTextColor(230, 126, 34);
    } else {
      this.doc.setTextColor(231, 76, 60);
    }
  }

  addFooter(): void {
    this.doc.setFontSize(8);
    this.doc.setTextColor(128, 128, 128);
    this.doc.text('Generated by AyuAstro - Professional Vedic Astrology Platform', 105, this.pageHeight - 15, { align: 'center' });
    this.doc.text('🔮 Powered by Advanced Astronomical Calculations & AI Analysis', 105, this.pageHeight - 10, { align: 'center' });
    this.doc.text('This report combines traditional Vedic wisdom with modern technology', 105, this.pageHeight - 5, { align: 'center' });
  }

  save(fileName: string): void {
    this.doc.save(fileName);
  }

  getDocument(): jsPDF {
    return this.doc;
  }
}
