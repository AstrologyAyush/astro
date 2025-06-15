
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Star, TrendingUp, AlertCircle } from 'lucide-react';

interface EnhancedDashaTimingProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const EnhancedDashaTiming: React.FC<EnhancedDashaTimingProps> = ({ kundaliData, language }) => {
  const [selectedDasha, setSelectedDasha] = useState('current');
  const getTranslation = (en: string, hi: string) => (language === 'hi' ? hi : en);

  // Helper: get dashas from kundaliData
  const dashas = kundaliData?.enhancedCalculations?.dashas || [];
  // Helper: flatten sub-periods for Antardasha, Pratyantardasha
  function flattenDashaPeriods(dashas: any[], depth = 3) {
    if (!Array.isArray(dashas) || !dashas.length || depth < 1) return [];
    let periods: any[] = [];
    for (const dasha of dashas) {
      periods.push(dasha);
      if (dasha.subPeriods && depth > 1) {
        periods = periods.concat(flattenDashaPeriods(dasha.subPeriods, depth - 1));
      }
    }
    return periods;
  }

  const [currentMahadasha, currentAntardasha, currentPratyantardasha] = useMemo(() => {
    let maha = null, antar = null, pratyantar = null;
    let now = Date.now();

    // Get current Mahadasha from main list
    if (dashas.length > 0) {
      maha = dashas.find((d: any) => {
        const start = new Date(d.startDate).getTime(), end = new Date(d.endDate).getTime();
        return now >= start && now <= end;
      }) || dashas[0];
    }
    // Current Antardasha from subPeriods
    if (maha && Array.isArray(maha.subPeriods) && maha.subPeriods.length > 0) {
      antar = maha.subPeriods.find((a: any) => {
        const start = new Date(a.startDate).getTime(), end = new Date(a.endDate).getTime();
        return now >= start && now <= end;
      }) || maha.subPeriods[0];
    }
    // Current Pratyantardasha from subPeriods of antar
    if (antar && Array.isArray(antar.subPeriods) && antar.subPeriods.length > 0) {
      pratyantar = antar.subPeriods.find((p: any) => {
        const start = new Date(p.startDate).getTime(), end = new Date(p.endDate).getTime();
        return now >= start && now <= end;
      }) || antar.subPeriods[0];
    }
    return [maha, antar, pratyantar];
  }, [dashas]);

  // For showing upcoming periods
  const upcomingAntardashas = useMemo(() => {
    if (!currentMahadasha?.subPeriods) return [];
    // Only future periods, sorted
    const now = Date.now();
    return currentMahadasha.subPeriods.filter((a: any) => new Date(a.startDate).getTime() > now)
      .slice(0, 3); // up to 3 upcoming
  }, [currentMahadasha]);

  // Formatting and progress helpers
  const getPlanetNameHi = (name: string) => {
    const mapping: any = {
      Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
    };
    return mapping[name] || name;
  };
  const calculateProgress = (start: string | Date, end: string | Date) => {
    if (!start || !end) return 0;
    const s = typeof start === 'string' ? new Date(start).getTime() : start.getTime();
    const e = typeof end === 'string' ? new Date(end).getTime() : end.getTime();
    const n = Date.now();
    if (n < s) return 0;
    if (n > e) return 100;
    return Math.round((n - s) / (e - s) * 100);
  };
  const formatTimeLeft = (end: string | Date) => {
    if (!end) return "";
    const e = typeof end === 'string' ? new Date(end).getTime() : end.getTime();
    const n = Date.now();
    let ms = e - n;
    if (ms < 0) ms = 0;
    const y = Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
    const m = Math.floor(((ms / (365.25 * 24 * 60 * 60 * 1000)) % 1) * 12);
    if (y > 0) return `${y}Y ${m}M`;
    if (m > 0) {
      const d = Math.floor((((ms / (365.25 * 24 * 60 * 60 * 1000)) * 12) % 1) * 30);
      return `${m}M ${d}D`;
    }
    const d = Math.floor(ms / (24 * 60 * 60 * 1000));
    return `${d} day${d !== 1 ? "s" : ""}`;
  };
  const getDashaStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Fallback error
  if (!currentMahadasha) {
    return (
      <Card className="border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
          <CardTitle className="text-indigo-800 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {getTranslation('Enhanced Dasha Timing', 'उन्नत दशा समय')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-700 font-semibold">
            {getTranslation('No dasha timing data available for this Kundali.', 'इस कुंडली के लिए कोई दशा समय डेटा उपलब्ध नहीं है।')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-200">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
        <CardTitle className="text-indigo-800 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {getTranslation('Enhanced Dasha Timing', 'उन्नत दशा समय')}
        </CardTitle>
        <p className="text-sm text-indigo-600">
          {getTranslation('Precise planetary period analysis with timing', 'समय के साथ सटीक ग्रहीय काल विश्लेषण')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">
              {getTranslation('Current', 'वर्तमान')}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              {getTranslation('Upcoming', 'आगामी')}
            </TabsTrigger>
            <TabsTrigger value="analysis">
              {getTranslation('Analysis', 'विश्लेषण')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            {/* Mahadasha */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge className="bg-indigo-600 text-white mb-2">
                    {getTranslation('Current Mahadasha', 'वर्तमान महादशा')}
                  </Badge>
                  <h3 className="text-xl font-bold text-indigo-800">
                    {language === 'hi' ? getPlanetNameHi(currentMahadasha.planet) : currentMahadasha.planet}
                    {getTranslation(' Mahadasha', ' महादशा')}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-700">
                    {formatTimeLeft(currentMahadasha.endDate)} left
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Period', 'काल')}</div>
                  <div className="font-semibold text-xs">
                    {new Date(currentMahadasha.startDate).toLocaleDateString()} - {new Date(currentMahadasha.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Progress', 'प्रगति')}</div>
                  <div className="font-semibold">{calculateProgress(currentMahadasha.startDate, currentMahadasha.endDate)}%</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Total Duration', 'कुल अवधि')}</div>
                  <div className="font-semibold">{currentMahadasha.years || currentMahadasha.totalYears || "-"} {getTranslation('years', 'वर्ष')}</div>
                </div>
              </div>
              <Progress
                value={calculateProgress(currentMahadasha.startDate, currentMahadasha.endDate)}
                className="h-2"
              />
            </div>

            {/* Antardasha */}
            {currentAntardasha && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="border-blue-300 text-blue-700 mb-2">
                      {getTranslation('Current Antardasha', 'वर्तमान अंतर्दशा')}
                    </Badge>
                    <h4 className="text-lg font-semibold text-blue-800">
                      {language === 'hi' ? getPlanetNameHi(currentAntardasha.planet) : currentAntardasha.planet}
                      {getTranslation(' Antardasha', ' अंतर्दशा')}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-md font-bold text-blue-700">
                      {formatTimeLeft(currentAntardasha.endDate)} left
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-blue-600">{getTranslation('Period', 'काल')}</div>
                    <div className="font-semibold text-xs">
                      {new Date(currentAntardasha.startDate).toLocaleDateString()} - {new Date(currentAntardasha.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-600">{getTranslation('Progress', 'प्रगति')}</div>
                    <div className="font-semibold">{calculateProgress(currentAntardasha.startDate, currentAntardasha.endDate)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-600">{getTranslation('Total Duration', 'कुल अवधि')}</div>
                    <div className="font-semibold">{currentAntardasha.years || currentAntardasha.totalYears || "-"} {getTranslation('years', 'वर्ष')}</div>
                  </div>
                </div>
                <Progress
                  value={calculateProgress(currentAntardasha.startDate, currentAntardasha.endDate)}
                  className="h-2"
                />
              </div>
            )}

            {/* Pratyantardasha */}
            {currentPratyantardasha && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="border-green-300 text-green-700 mb-2">
                      {getTranslation('Current Pratyantardasha', 'वर्तमान प्रत्यंतर्दशा')}
                    </Badge>
                    <h4 className="text-lg font-semibold text-green-800">
                      {language === 'hi' ? getPlanetNameHi(currentPratyantardasha.planet) : currentPratyantardasha.planet}
                      {getTranslation(' Pratyantardasha', ' प्रत्यंतर्दशा')}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-md font-bold text-green-700">
                      {formatTimeLeft(currentPratyantardasha.endDate)} left
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-green-600">{getTranslation('Period', 'काल')}</div>
                    <div className="font-semibold text-xs">
                      {new Date(currentPratyantardasha.startDate).toLocaleDateString()} - {new Date(currentPratyantardasha.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-green-600">{getTranslation('Progress', 'प्रगति')}</div>
                    <div className="font-semibold">{calculateProgress(currentPratyantardasha.startDate, currentPratyantardasha.endDate)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-600">{getTranslation('Total Duration', 'कुल अवधि')}</div>
                    <div className="font-semibold">{currentPratyantardasha.years || currentPratyantardasha.totalYears || "-"} {getTranslation('years', 'वर्ष')}</div>
                  </div>
                </div>
                <Progress
                  value={calculateProgress(currentPratyantardasha.startDate, currentPratyantardasha.endDate)}
                  className="h-2"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                {getTranslation('Upcoming Planetary Periods', 'आगामी ग्रहीय अवधि')}
              </h3>
              {upcomingAntardashas.length === 0 && (
                <div className="text-gray-500 text-center p-4">
                  {getTranslation("No upcoming periods found.", "कोई आगामी अवधि नहीं मिली।")}
                </div>
              )}
              {upcomingAntardashas.map((period: any, index: number) => (
                <div key={index} className="p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge className="bg-indigo-600 text-white mb-2">
                        {getTranslation('Antardasha', 'अंतर्दशा')}
                      </Badge>
                      <h4 className="text-lg font-semibold text-indigo-800">
                        {language === 'hi' ? getPlanetNameHi(period.planet) : period.planet} Antardasha
                      </h4>
                      <div className="text-sm text-indigo-600">
                        {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-xs text-indigo-700">
                      {getTranslation('Start', 'प्रारंभ')}: {new Date(period.startDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-indigo-700">
                      {getTranslation('Ends', 'समाप्त')}: {new Date(period.endDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-indigo-700">
                      {getTranslation('Left', 'बाकी')}: {formatTimeLeft(period.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <div className="space-y-6">
              {/* Current Period Analysis */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-800">
                    {getTranslation('Current Period Analysis', 'वर्तमान काल विश्लेषण')}
                  </h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  {/* You can enrich this to provide more real contextual analysis */}
                  {currentMahadasha ? (
                    getTranslation(
                      `You are currently under the ${currentMahadasha.planet} Mahadasha${currentAntardasha ? ` and ${currentAntardasha.planet} Antardasha` : ''}.`,
                      `आप वर्तमान में ${getPlanetNameHi(currentMahadasha.planet)} महादशा${currentAntardasha ? ` और ${getPlanetNameHi(currentAntardasha.planet)} अंतर्दशा` : ''} के अंतर्गत हैं।`
                    )
                  ) : (
                    getTranslation('Unable to analyze the current period.', 'वर्तमान काल का विश्लेषण करने में असमर्थ।')
                  )}
                </p>
                {/* For brevity, not expanding additional insights here */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedDashaTiming;
