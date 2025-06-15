
export interface ChartColors {
  background: string;
  border: string;
  text: string;
  accent: string;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: number;
}

export class ChartRenderer {
  protected ctx: CanvasRenderingContext2D;
  protected dimensions: ChartDimensions;
  protected colors: ChartColors;

  constructor(
    ctx: CanvasRenderingContext2D,
    dimensions: ChartDimensions,
    colors: ChartColors = {
      background: '#ffffff',
      border: '#000000',
      text: '#2C3E50',
      accent: '#3498DB'
    }
  ) {
    this.ctx = ctx;
    this.dimensions = dimensions;
    this.colors = colors;
  }

  protected clearCanvas(): void {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
  }

  protected drawTitle(title: string, y: number = 30): void {
    this.ctx.fillStyle = this.colors.text;
    this.ctx.font = 'bold 18px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, this.dimensions.width / 2, y);
  }

  protected drawLegend(items: Array<{color: string, label: string}>, y: number): void {
    let x = this.dimensions.margin;
    const itemWidth = 80;
    
    items.forEach(item => {
      // Color box
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(x, y - 8, 15, 10);
      
      // Label
      this.ctx.fillStyle = this.colors.text;
      this.ctx.font = '10px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(item.label, x + 20, y);
      
      x += itemWidth;
    });
  }

  protected wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
}

export const planetColors: { [key: string]: string } = {
  'SU': '#FF6B35',
  'MO': '#4A90E2',
  'MA': '#E74C3C',
  'ME': '#2ECC71',
  'JU': '#F39C12',
  'VE': '#9B59B6',
  'SA': '#34495E',
  'RA': '#8E44AD',
  'KE': '#E67E22'
};

export const strengthColors = [
  { min: 80, color: "#27AE60", label: "Strong" },
  { min: 60, color: "#F4D03F", label: "Moderate" },
  { min: 40, color: "#F39C12", label: "Average" },
  { min: 0,  color: "#E74C3C", label: "Weak" },
];
