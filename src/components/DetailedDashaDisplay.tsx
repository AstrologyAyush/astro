import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
}

interface DetailedDashaDisplayProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const DetailedDashaDisplay: React.FC<DetailedDashaDisplayProps> = ({ kundaliData, language }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const dashaPeriods: DashaPeriod[] = kundaliData?.dashaPeriods || [];

  return (
    <Card className="w-full border-purple-200 shadow-lg">
      <CardContent className="p-4">
        <div
          className="bg-gradient-to-r from-purple-100 to-indigo-100 
               rounded-xl border border-purple-200 
               shadow-md px-4 py-4 mb-5
               mt-3 sm:mt-4 mx-2 sm:mx-4
               flex flex-col sm:flex-row items-center gap-2 sm:gap-6
               "
        >
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-purple-800">
              {getTranslation('Detailed Dasha Periods', 'विस्तृत दशा काल')}
            </CardTitle>
            <p className="text-sm text-purple-600">
              {getTranslation('Planetary periods and their durations', 'ग्रहों की अवधि और उनकी अवधि')}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary">
              {getTranslation('Total Periods', 'कुल अवधि')}: {dashaPeriods.length}
            </Badge>
          </div>
        </div>
        <div className="w-full h-2"></div> {/* Spacer for extra separation on all screens */}
        <Table>
          <TableCaption>{getTranslation('Dasha periods in chronological order', 'कालानुक्रमिक क्रम में दशा काल')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{getTranslation('Planet', 'ग्रह')}</TableHead>
              <TableHead>{getTranslation('Start Date', 'प्रारंभ तिथि')}</TableHead>
              <TableHead>{getTranslation('End Date', 'अंतिम तिथि')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dashaPeriods.map((period, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{period.planet}</TableCell>
                <TableCell>{period.startDate}</TableCell>
                <TableCell>{period.endDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DetailedDashaDisplay;
