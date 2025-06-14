import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateNumerologyProfile, checkCompatibility, NumerologyProfile } from '@/lib/numerologyUtils';
import CompatibilityChecker from './CompatibilityChecker';
import NumerologyInsights from './NumerologyInsights';
import { AlertCircle, Star, Heart, Shield, Gem, BookOpen, Lightbulb } from 'lucide-react';

interface NumerologyCalculatorProps {
  language: 'hi' | 'en';
}

const NumerologyCalculator: React.FC<NumerologyCalculatorProps> = ({ language }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);

  const handleCalculate = () => {
    if (!name || !birthDate) return;
    
    const date = new Date(birthDate);
    const numerologyProfile = calculateNumerologyProfile(name, date);
    setProfile(numerologyProfile);
  };

  const getText = (hi: string, en: string) => language === 'hi' ? hi : en;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-500" />
            {getText("उन्नत न्यूमेरोलॉजी कैलकुलेटर", "Advanced Numerology Calculator")}
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
            {getText("विस्तृत न्यूमेरोलॉजी विश्लेषण करें", "Generate Detailed Numerology Analysis")}
          </Button>
        </CardContent>
      </Card>

      {profile && (
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="insights">{getText("अंतर्दृष्टि", "Insights")}</TabsTrigger>
            <TabsTrigger value="core">{getText("मुख्य", "Core")}</TabsTrigger>
            <TabsTrigger value="personality">{getText("व्यक्तित्व", "Personality")}</TabsTrigger>
            <TabsTrigger value="karmic">{getText("कर्मिक", "Karmic")}</TabsTrigger>
            <TabsTrigger value="remedies">{getText("उपाय", "Remedies")}</TabsTrigger>
            <TabsTrigger value="compatibility">{getText("संगतता", "Compatibility")}</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  {getText("व्यक्तिगत मार्गदर्शन और अंतर्दृष्टि", "Personal Guidance & Insights")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumerologyInsights profile={profile} language={language} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="core" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  {getText("मुख्य संख्याएं", "Core Numbers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{profile.lifePath}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {getText("जीवन पथ", "Life Path")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {getText("आपका जीवन उद्देश्य", "Your life purpose")}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{profile.expression}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {getText("अभिव्यक्ति", "Expression")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {getText("प्राकृतिक प्रतिभा", "Natural talents")}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-3xl font-bold text-pink-600">{profile.soulUrge}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {getText("आत्मा की इच्छा", "Soul Urge")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {getText("अंतर प्रेरणा", "Inner motivation")}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{profile.personality}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {getText("व्यक्तित्व", "Personality")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {getText("बाहरी छवि", "Outer image")}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{profile.birthday}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {getText("जन्मदिन", "Birthday")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {getText("विशेष उपहार", "Special gift")}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{profile.maturity}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {getText("परिपक्वता", "Maturity")}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {getText("जीवन का दूसरा भाग", "Later life focus")}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      {getText("शिखर संख्याएं (जीवन चरण)", "Pinnacle Numbers (Life Phases)")}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {profile.pinnacles.map((pinnacle, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {getText(`चरण ${index + 1}`, `Phase ${index + 1}`)}: {pinnacle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      {getText("चुनौती संख्याएं", "Challenge Numbers")}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {profile.challenges.map((challenge, index) => (
                        <Badge key={index} variant="secondary">
                          {getText(`चुनौती ${index + 1}`, `Challenge ${index + 1}`)}: {challenge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      {getText("व्यक्तिगत वर्ष 2025", "Personal Year 2025")}
                    </h4>
                    <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
                      {profile.personalYear}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {getText("व्यक्तित्व प्रकार", "Personality Archetype")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    {profile.personalityArchetype.name}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {profile.personalityArchetype.description}
                  </p>
                  <p className="text-sm text-blue-700 font-medium">
                    {getText("जीवन विषय", "Life Theme")}: {profile.personalityArchetype.lifeTheme}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {getText("शक्तियां", "Strengths")}
                    </h4>
                    <ul className="space-y-1">
                      {profile.personalityArchetype.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      {getText("छाया पक्ष", "Shadow Aspects")}
                    </h4>
                    <ul className="space-y-1">
                      {profile.personalityArchetype.shadows.map((shadow, index) => (
                        <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {shadow}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      {getText("आदर्श करियर", "Ideal Careers")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.personalityArchetype.idealCareers.map((career, index) => (
                        <Badge key={index} variant="outline" className="bg-purple-100 text-purple-700">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-2">
                      {getText("रिश्ते में स्टाइल", "Relationship Style")}
                    </h4>
                    <p className="text-sm text-pink-700">
                      {profile.personalityArchetype.relationshipStyle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="karmic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {getText("कर्मिक विश्लेषण", "Karmic Analysis")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.karmicDebt.hasKarmicDebt ? (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {getText("कर्मिक ऋण मौजूद", "Karmic Debt Present")}
                    </h4>
                    <div className="space-y-2">
                      {profile.karmicDebt.debtNumbers.map((debt, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-red-100">
                          <div className="font-medium text-red-700">
                            {getText("ऋण संख्या", "Debt Number")}: {debt}
                          </div>
                          <div className="text-sm text-red-600 mt-1">
                            {profile.karmicDebt.descriptions[index]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">
                      {getText("कोई मुख्य कर्मिक ऋण नहीं", "No Major Karmic Debt")}
                    </h4>
                    <p className="text-green-700 text-sm mt-1">
                      {getText("आपके पास साफ कर्मिक स्लेट है", "You have a clear karmic slate")}
                    </p>
                  </div>
                )}

                {profile.missingNumbers.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      {getText("गुम संख्याएं", "Missing Numbers")}
                    </h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      {getText("आपके नाम में ये संख्याएं गायब हैं, जो कमजोर क्षेत्रों को दर्शाती हैं", "These numbers are missing from your name, indicating areas of weakness")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.missingNumbers.map((num, index) => (
                        <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remedies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  {getText("व्यक्तिगत उपाय", "Personalized Remedies")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.remedies.length > 0 ? (
                  <div className="space-y-4">
                    {profile.remedies.map((remedy, index) => (
                      <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {remedy.number}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-800 mb-1">
                              {getText("संख्या", "Number")} {remedy.number} {getText("की कमी", "Deficiency")}
                            </h4>
                            <p className="text-sm text-green-700 mb-3">{remedy.deficiency}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-green-800 mb-1">
                                  {getText("उपाय", "Remedies")}:
                                </h5>
                                <ul className="text-sm text-green-700">
                                  {remedy.remedies.map((r, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                      <span className="text-green-500 mt-1">•</span>
                                      {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-800">
                                    {getText("मंत्र", "Mantra")}:
                                  </span>
                                  <code className="text-xs bg-green-100 px-2 py-1 rounded">
                                    {remedy.mantra}
                                  </code>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Gem className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-800">
                                    {getText("रत्न", "Gemstone")}:
                                  </span>
                                  <Badge variant="outline" className="bg-green-100">
                                    {remedy.gemstone}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: remedy.color.toLowerCase() }}
                                  ></div>
                                  <span className="text-sm font-medium text-green-800">
                                    {getText("रंग", "Color")}:
                                  </span>
                                  <span className="text-sm text-green-700">{remedy.color}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      {getText("कोई विशेष उपाय की आवश्यकता नहीं", "No specific remedies needed")}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {getText("आपकी संख्या संरचना संतुलित है", "Your number structure is well balanced")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-4">
            <CompatibilityChecker 
              language={language}
              currentProfile={profile}
              currentName={name}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default NumerologyCalculator;
