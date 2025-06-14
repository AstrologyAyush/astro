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
import { useLanguage } from '@/contexts/LanguageContext';

const NumerologyCalculator: React.FC = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const { t } = useLanguage();

  const handleCalculate = () => {
    if (!name || !birthDate) return;
    const date = new Date(birthDate);
    const numerologyProfile = calculateNumerologyProfile(name, date);
    setProfile(numerologyProfile);
  };

  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-500" />
            {t('advanced_numerology_calculator')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">
                {t('full_name')}
              </Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder={t('enter_full_name')} />
            </div>
            <div>
              <Label htmlFor="birthDate">
                {t('birth_date')}
              </Label>
              <Input id="birthDate" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full">
            {t('generate_detailed_analysis')}
          </Button>
        </CardContent>
      </Card>

      {profile && <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="insights">{t('insights')}</TabsTrigger>
            <TabsTrigger value="core">{t('core')}</TabsTrigger>
            <TabsTrigger value="personality">{t('personality')}</TabsTrigger>
            <TabsTrigger value="karmic">{t('karmic')}</TabsTrigger>
            <TabsTrigger value="remedies">{t('remedies')}</TabsTrigger>
            <TabsTrigger value="compatibility">{t('compatibility')}</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2 text-base font-bold text-center px-[2px] py-[6px]">
                  <Lightbulb className="h-5 w-5" />
                  {t('personal_guidance_insights')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumerologyInsights profile={profile} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="core" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  {t('core_numbers')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{profile.lifePath}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('life_path')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('your_life_purpose')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{profile.expression}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('expression')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('natural_talents')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-3xl font-bold text-pink-600">{profile.soulUrge}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('soul_urge')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('inner_motivation')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{profile.personality}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('personality')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('outer_image')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{profile.birthday}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('birthday')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('special_gift')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{profile.maturity}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('maturity')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('later_life_focus')}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      {t('pinnacle_numbers')}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {profile.pinnacles.map((pinnacle, index) => <Badge key={index} variant="outline" className="bg-blue-50">
                          {t('phase')} {index + 1}: {pinnacle}
                        </Badge>)}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      {t('challenge_numbers')}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {profile.challenges.map((challenge, index) => <Badge key={index} variant="secondary">
                          {t('challenge')} {index + 1}: {challenge}
                        </Badge>)}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      {t('personal_year_2025')}
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
                  {t('personality_archetype')}
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
                    {t('life_theme')}: {profile.personalityArchetype.lifeTheme}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {t('strengths')}
                    </h4>
                    <ul className="space-y-1">
                      {profile.personalityArchetype.strengths.map((strength, index) => <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>)}
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      {t('shadow_aspects')}
                    </h4>
                    <ul className="space-y-1">
                      {profile.personalityArchetype.shadows.map((shadow, index) => <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {shadow}
                        </li>)}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      {t('ideal_careers')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.personalityArchetype.idealCareers.map((career, index) => <Badge key={index} variant="outline" className="bg-purple-100 text-purple-700">
                          {career}
                        </Badge>)}
                    </div>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-2">
                      {t('relationship_style')}
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
                  {t('karmic_analysis')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.karmicDebt.hasKarmicDebt ? <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {t('karmic_debt_present')}
                    </h4>
                    <div className="space-y-2">
                      {profile.karmicDebt.debtNumbers.map((debt, index) => <div key={index} className="bg-white p-3 rounded border border-red-100">
                          <div className="font-medium text-red-700">
                            {t('debt_number')}: {debt}
                          </div>
                          <div className="text-sm text-red-600 mt-1">
                            {profile.karmicDebt.descriptions[index]}
                          </div>
                        </div>)}
                    </div>
                  </div> : <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">
                      {t('no_major_karmic_debt')}
                    </h4>
                    <p className="text-green-700 text-sm mt-1">
                      {t('clear_karmic_slate')}
                    </p>
                  </div>}

                {profile.missingNumbers.length > 0 && <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      {t('missing_numbers')}
                    </h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      {t('missing_numbers_description')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.missingNumbers.map((num, index) => <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800">
                          {num}
                        </Badge>)}
                    </div>
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remedies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  {t('personalized_remedies')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.remedies.length > 0 ? <div className="space-y-4">
                    {profile.remedies.map((remedy, index) => <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {remedy.number}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-800 mb-1">
                              {t('number')} {remedy.number} {t('deficiency')}
                            </h4>
                            <p className="text-sm text-green-700 mb-3">{remedy.deficiency}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-green-800 mb-1">
                                  {t('remedies')}:
                                </h5>
                                <ul className="text-sm text-green-700">
                                  {remedy.remedies.map((r, i) => <li key={i} className="flex items-start gap-1">
                                      <span className="text-green-500 mt-1">•</span>
                                      {r}
                                    </li>)}
                                </ul>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-800">
                                    {t('mantra')}:
                                  </span>
                                  <code className="text-xs bg-green-100 px-2 py-1 rounded">
                                    {remedy.mantra}
                                  </code>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Gem className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-800">
                                    {t('gemstone')}:
                                  </span>
                                  <Badge variant="outline" className="bg-green-100">
                                    {remedy.gemstone}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded border" style={{
                            backgroundColor: remedy.color.toLowerCase()
                          }}></div>
                                  <span className="text-sm font-medium text-green-800">
                                    {t('color')}:
                                  </span>
                                  <span className="text-sm text-green-700">{remedy.color}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>)}
                  </div> : <div className="text-center py-8">
                    <div className="text-gray-500">
                      {t('no_specific_remedies')}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {t('well_balanced_structure')}
                    </p>
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-4">
            <CompatibilityChecker currentProfile={profile} currentName={name} />
          </TabsContent>
        </Tabs>}
    </div>;
};
export default NumerologyCalculator;
