
import React, { useEffect, useRef } from "react";

interface YogaStrengthIndicatorsProps {
  yogas: {
    name: string;
    strength: number; // 0-100
    type: string;
    sanskritName?: string;
  }[];
  onImageGenerated?: (imageUrl: string) => void;
  width?: number;
  height?: number;
}

const strengthColors = [
  { min: 80, color: "#27AE60", label: "Strong" },     // Green
  { min: 60, color: "#F4D03F", label: "Moderate" },   // Yellow
  { min: 40, color: "#F39C12", label: "Average" },    // Orange
  { min: 0,  color: "#E74C3C", label: "Weak" },       // Red
];

const YogaStrengthIndicators: React.FC<YogaStrengthIndicatorsProps> = ({
  yogas,
  onImageGenerated,
  width = 600,
  height = 70,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !yogas || yogas.length === 0) return;

    canvas.width = width;
    canvas.height = Math.max(80, yogas.length * 35);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // White background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, canvas.height);

    ctx.font = "bold 17px Arial";
    ctx.fillStyle = "#5B2C6F";
    ctx.textAlign = "left";
    ctx.fillText("Yoga Strength Indicators", 18, 26);

    // Bars
    const startY = 40;
    yogas.slice(0, 5).forEach((yoga, i) => {
      const barY = startY + i * 30;
      // Bar background
      ctx.fillStyle = "#ECF0F1";
      ctx.fillRect(32, barY, 380, 16);

      // Yoga bar (colored by strength)
      const entry = strengthColors.find(c => yoga.strength >= c.min) || strengthColors[strengthColors.length - 1];
      ctx.fillStyle = entry.color;
      ctx.fillRect(32, barY, (yoga.strength / 100) * 380, 16);

      // Yoga label and type
      ctx.font = "bold 11px Arial";
      ctx.fillStyle = "#222";
      ctx.fillText(`${yoga.name}${yoga.sanskritName ? ` (${yoga.sanskritName})` : ""}`, 440, barY + 14);

      // Strength %
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = entry.color;
      ctx.fillText(`${Math.round(yoga.strength)}%`, 420, barY + 14);
    });

    // Legend
    let lx = 32, ly = canvas.height - 18;
    strengthColors.forEach((c, idx) => {
      ctx.fillStyle = c.color;
      ctx.fillRect(lx, ly, 16, 12);
      ctx.fillStyle = "#222";
      ctx.font = "10px Arial";
      ctx.fillText(c.label, lx + 20, ly + 10);
      lx += 70;
    });

    // Output image to callback
    if (onImageGenerated) {
      onImageGenerated(canvas.toDataURL("image/png"));
    }
  }, [yogas, width, height]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
      <p className="text-xs text-gray-600 mt-1">Visual summary of major yogas detected</p>
    </div>
  );
};

export default YogaStrengthIndicators;
