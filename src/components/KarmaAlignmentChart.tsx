
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Target,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';

interface KarmaAlignmentChartProps {
  alignmentPercentage: number;
  grahaEnergies: Array<{
    name: string;
    role: string;
    strength: number;
    color: string;
  }>;
  dashaTimeline: Array<{
    period: string;
    planet: string;
    status: 'growth' | 'transition' | 'challenge';
    startYear: number;
    endYear: number;
  }>;
  weeklyTracker: Array<{
    week: number;
    action: string;
    planet: string;
    status: 'done' | 'missed' | 'repeating';
  }>;
  language: 'hi' | 'en';
}

const KarmaAlignmentChart: React.FC<KarmaAlignmentChartProps> = ({
  alignmentPercentage,
  grahaEnergies,
  dashaTimeline,
  weeklyTracker,
  language
}) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const getAlignmentColor = (percentage: number) => {
    if (percentage >= 75) return '#10B981'; // Green
    if (percentage >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getAlignmentMessage = (percentage: number) => {
    if (language === 'hi') {
      if (percentage >= 75) return `आपके कर्म आपके कर्मिक नक्शे से ${percentage}% मेल खाते हैं। उत्कृष्ट संरेखण!`;
      if (percentage >= 50) return `आपके कर्म आपके कर्मिक नक्शे से ${percentage}% मेल खाते हैं। साप्ताहिक कर्मिक अनुष्ठानों से सुधार संभव।`;
      return `आपके कर्म आपके कर्मिक नक्शे से केवल ${percentage}% मेल खाते हैं। तत्काल सुधार की आवश्यकता।`;
    } else {
      if (percentage >= 75) return `Your actions match your karmic blueprint by ${percentage}%. Excellent alignment!`;
      if (percentage >= 50) return `Your actions match your karmic blueprint by ${percentage}%. Improvement possible with weekly karmic rituals.`;
      return `Your actions match your karmic blueprint by only ${percentage}%. Immediate improvement needed.`;
    }
  };

  const pieData = [
    { name: 'Aligned', value: alignmentPercentage, color: getAlignmentColor(alignmentPercentage) },
    { name: 'Misaligned', value: 100 - alignmentPercentage, color: '#E5E7EB' }
  ];

  const getDashaStatusIcon = (status: string) => {
    switch (status) {
      case 'growth': return '🚦';
      case 'transition': return '🟡';
      case 'challenge': return '🔴';
      default: return '⚪';
    }
  };

  const getTrackerIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'missed': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'repeating': return <RotateCcw className="h-5 w-5 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Karma Alignment Donut Chart */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            {getTranslation('Karma Alignment Graph', 'कर्म संरेखण ग्राफ')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: getAlignmentColor(alignmentPercentage) }}>
                    {alignmentPercentage}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {getTranslation('Aligned', 'संरेखित')}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-700 max-w-md">
              {getAlignmentMessage(alignmentPercentage)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Graha Energy Bar Chart */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {getTranslation('Graha Energy Signature', 'ग्रह ऊर्जा हस्ताक्षर')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {grahaEnergies.map((graha, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-800">{graha.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({graha.role})</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-gray-100"
                  >
                    {graha.strength}%
                  </Badge>
                </div>
                <Progress 
                  value={graha.strength} 
                  className="h-3"
                  style={{ 
                    background: `linear-gradient(to right, ${graha.color} 0%, ${graha.color} ${graha.strength}%, #E5E7EB ${graha.strength}%, #E5E7EB 100%)`
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {getTranslation(
              'These forces are shaping your career karma and life direction.',
              'ये शक्तियां आपके करियर कर्म और जीवन दिशा को आकार दे रही हैं।'
            )}
          </p>
        </CardContent>
      </Card>

      {/* Dasha Timeline Slider */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getTranslation('Dasha Timeline', 'दशा समयरेखा')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{dashaTimeline[0]?.startYear}</span>
                <span>{dashaTimeline[dashaTimeline.length - 1]?.endYear}</span>
              </div>
              <div className="flex w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                {dashaTimeline.map((dasha, index) => {
                  const width = ((dasha.endYear - dasha.startYear) / 
                    (dashaTimeline[dashaTimeline.length - 1].endYear - dashaTimeline[0].startYear)) * 100;
                  const colors = {
                    growth: '#10B981',
                    transition: '#F59E0B',
                    challenge: '#EF4444'
                  };
                  return (
                    <div
                      key={index}
                      className="h-full flex items-center justify-center text-xs text-white font-medium"
                      style={{ 
                        width: `${width}%`,
                        backgroundColor: colors[dasha.status]
                      }}
                    >
                      {getDashaStatusIcon(dasha.status)}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashaTimeline.map((dasha, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getDashaStatusIcon(dasha.status)}</span>
                    <span className="font-semibold">{dasha.planet}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {dasha.startYear} - {dasha.endYear}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dasha.period}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Karma Tracker */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {getTranslation('Weekly Karma Tracker', 'साप्ताहिक कर्म ट्रैकर')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-700 border-b pb-2">
              <span>{getTranslation('Week', 'सप्ताह')}</span>
              <span>{getTranslation('Action', 'कर्म')}</span>
              <span>{getTranslation('Planet', 'ग्रह')}</span>
              <span>{getTranslation('Status', 'स्थिति')}</span>
            </div>
            {weeklyTracker.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-100">
                <span className="font-medium">{item.week}</span>
                <span className="text-gray-700">{item.action}</span>
                <Badge variant="outline" className="text-xs">
                  {item.planet}
                </Badge>
                <div className="flex items-center">
                  {getTrackerIcon(item.status)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {getTranslation(
                'Complete these karmic actions to improve your alignment score!',
                'अपना संरेखण स्कोर बेहतर बनाने के लिए इन कर्मिक कार्यों को पूरा करें!'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KarmaAlignmentChart;
