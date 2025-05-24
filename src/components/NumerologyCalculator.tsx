
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateNumerologyProfile, checkCompatibility, getNumberMeaning, NumerologyProfile } from '@/lib/numerologyUtils';

interface NumerologyCalculatorProps {
  language: 'hi' | 'en';
}

const NumerologyCalculator: React.FC<NumerologyCalculatorProps> = ({ language }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState('');
  const [compatibility, setCompatibility] = useState<any>(null);

  const handleCalculate = () => {
    if (!name || !birthDate) return;
    
    const date = new Date(birthDate);
    const numerologyProfile = calculateNumerologyProfile(name, date);
    setProfile(numerologyProfile);
  };

  const handleCompatibilityCheck = () => {
    if (!profile || !partnerName || !partnerBirthDate) return;
    
    const partnerDate = new Date(partnerBirthDate);
    const partnerProfile = calculateNumerologyProfile(partnerName, partnerDate);
    const compatibilityResult = checkCompatibility(profile, partnerProfile);
    setCompatibility(compatibilityResult);
  };

  const getText = (hi: string, en: string) => language === 'hi' ? hi : en;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {getText("न्यूमेरोलॉजी कैलकुलेटर", "Numerology Calculator")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">
                {getText("पूरा नाम", "Full Name")}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={getText("अपना पूरा नाम दर्ज करें", "Enter your full name")}
              />
            </div>
            <div>
              <Label htmlFor="birthDate">
                {getText("जन्म तिथि", "Birth Date")}
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full">
            {getText("न्यूमेरोलॉजी गणना करें", "Calculate Numerology")}
          </Button>
        </CardContent>
      </Card>

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>
              {getText("आपकी न्यूमेरोलॉजी प्रोफाइल", "Your Numerology Profile")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{profile.lifePath}</div>
                <div className="text-sm font-medium">
                  {getText("जीवन पथ", "Life Path")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getNumberMeaning(profile.lifePath, 'lifePath')}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{profile.expression}</div>
                <div className="text-sm font-medium">
                  {getText("अभिव्यक्ति", "Expression")}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{profile.soulUrge}</div>
                <div className="text-sm font-medium">
                  {getText("आत्मा की इच्छा", "Soul Urge")}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{profile.personality}</div>
                <div className="text-sm font-medium">
                  {getText("व्यक्तित्व", "Personality")}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant="outline">{profile.birthday}</Badge>
                <div className="text-xs mt-1">
                  {getText("जन्मदिन संख्या", "Birthday")}
                </div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline">{profile.maturity}</Badge>
                <div className="text-xs mt-1">
                  {getText("परिपक्वता", "Maturity")}
                </div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline">{profile.balance}</Badge>
                <div className="text-xs mt-1">
                  {getText("संतुलन", "Balance")}
                </div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline">{profile.personalYear}</Badge>
                <div className="text-xs mt-1">
                  {getText("व्यक्तिगत वर्ष", "Personal Year")}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">
                {getText("शिखर संख्याएं", "Pinnacle Numbers")}
              </h4>
              <div className="flex gap-2">
                {profile.pinnacles.map((pinnacle, index) => (
                  <Badge key={index} variant="secondary">
                    {getText(`${index + 1}वां`, `${index + 1}st`)}: {pinnacle}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">
                {getText("चुनौती संख्याएं", "Challenge Numbers")}
              </h4>
              <div className="flex gap-2">
                {profile.challenges.map((challenge, index) => (
                  <Badge key={index} variant="outline">
                    {getText(`${index + 1}वां`, `${index + 1}st`)}: {challenge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>
              {getText("संगतता जांच", "Compatibility Check")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partnerName">
                  {getText("साथी का नाम", "Partner's Name")}
                </Label>
                <Input
                  id="partnerName"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder={getText("साथी का नाम दर्ज करें", "Enter partner's name")}
                />
              </div>
              <div>
                <Label htmlFor="partnerBirthDate">
                  {getText("साथी की जन्म तिथि", "Partner's Birth Date")}
                </Label>
                <Input
                  id="partnerBirthDate"
                  type="date"
                  value={partnerBirthDate}
                  onChange={(e) => setPartnerBirthDate(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleCompatibilityCheck} className="w-full">
              {getText("संगतता जांचें", "Check Compatibility")}
            </Button>

            {compatibility && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {compatibility.score}%
                  </div>
                  <div className="text-lg font-medium mb-4">
                    {compatibility.rating}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      {getText("जीवन पथ मैच", "Life Path Match")}: {compatibility.details.lifePathMatch}%
                    </div>
                    <div>
                      {getText("आत्मा मैच", "Soul Urge Match")}: {compatibility.details.soulUrgeMatch}%
                    </div>
                    <div>
                      {getText("अभिव्यक्ति मैच", "Expression Match")}: {compatibility.details.expressionMatch}%
                    </div>
                    <div>
                      {getText("व्यक्तिगत वर्ष", "Personal Year")}: {compatibility.details.personalYearAlignment}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NumerologyCalculator;
