
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Clock, User, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BirthData {
  name: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
}

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading?: boolean;
  language: 'en' | 'hi';
}

const BirthDataForm: React.FC<BirthDataFormProps> = ({ onSubmit, isLoading = false, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: undefined as Date | undefined,
    timeOfBirth: '',
    placeOfBirth: '',
  });
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const handleLocationSearch = async (place: string) => {
    try {
      // Mock coordinates for common Indian cities
      const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
        'delhi': { lat: 28.6139, lon: 77.2090 },
        'mumbai': { lat: 19.0760, lon: 72.8777 },
        'bangalore': { lat: 12.9716, lon: 77.5946 },
        'chennai': { lat: 13.0827, lon: 80.2707 },
        'kolkata': { lat: 22.5726, lon: 88.3639 },
        'hyderabad': { lat: 17.3850, lon: 78.4867 },
        'pune': { lat: 18.5204, lon: 73.8567 },
        'ahmedabad': { lat: 23.0225, lon: 72.5714 },
        'jaipur': { lat: 26.9124, lon: 75.7873 },
        'lucknow': { lat: 26.8467, lon: 80.9462 }
      };

      const city = place.toLowerCase();
      if (cityCoordinates[city]) {
        setCoordinates({
          latitude: cityCoordinates[city].lat,
          longitude: cityCoordinates[city].lon
        });
      } else {
        // Default to Delhi if city not found
        setCoordinates({ latitude: 28.6139, longitude: 77.2090 });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setCoordinates({ latitude: 28.6139, longitude: 77.2090 });
    }
  };

  useEffect(() => {
    if (formData.placeOfBirth) {
      handleLocationSearch(formData.placeOfBirth);
    }
  }, [formData.placeOfBirth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
      return;
    }

    onSubmit({
      name: formData.name || 'Unknown',
      dateOfBirth: formData.dateOfBirth,
      timeOfBirth: formData.timeOfBirth,
      placeOfBirth: formData.placeOfBirth,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-orange-400 to-red-600 rounded-full">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white">
          {getTranslation('Enter Birth Details', 'जन्म विवरण दर्ज करें')}
        </h2>
        <p className="text-gray-400 text-sm">
          {getTranslation('Provide accurate information for precise calculations', 'सटीक गणना के लिए सही जानकारी दें')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 space-y-3">
            <Label htmlFor="name" className="text-white flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              {getTranslation('Full Name', 'पूरा नाम')}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={getTranslation('Enter your full name', 'अपना पूरा नाम दर्ज करें')}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </CardContent>
        </Card>

        {/* Date of Birth */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 space-y-3">
            <Label className="text-white flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              {getTranslation('Date of Birth', 'जन्म तिथि')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                    !formData.dateOfBirth && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                  {formData.dateOfBirth ? (
                    format(formData.dateOfBirth, "PPP")
                  ) : (
                    <span>{getTranslation('Pick a date', 'तारीख चुनें')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateOfBirth}
                  onSelect={(date) => setFormData({...formData, dateOfBirth: date})}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className="bg-gray-800 text-white"
                  classNames={{
                    months: "text-white",
                    month: "text-white",
                    caption: "text-white",
                    caption_label: "text-white font-medium",
                    nav: "text-white",
                    nav_button: "text-white hover:bg-gray-700 hover:text-white border-0",
                    nav_button_previous: "text-white hover:bg-gray-700",
                    nav_button_next: "text-white hover:bg-gray-700",
                    table: "text-white",
                    head_row: "text-gray-400",
                    head_cell: "text-gray-400 font-medium",
                    row: "text-white",
                    cell: "text-white",
                    day: "text-white hover:bg-gray-700 hover:text-white aria-selected:bg-orange-500 aria-selected:text-white",
                    day_today: "bg-gray-700 text-white",
                    day_selected: "bg-orange-500 text-white hover:bg-orange-600",
                    day_disabled: "text-gray-600",
                    day_outside: "text-gray-600",
                  }}
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Time of Birth */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 space-y-3">
            <Label htmlFor="time" className="text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              {getTranslation('Time of Birth', 'जन्म समय')}
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.timeOfBirth}
              onChange={(e) => setFormData({...formData, timeOfBirth: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white [&::-webkit-calendar-picker-indicator]:invert"
              required
            />
            <p className="text-xs text-gray-500">
              {getTranslation('Use 24-hour format (e.g., 14:30)', '24-घंटे प्रारूप का उपयोग करें (जैसे 14:30)')}
            </p>
          </CardContent>
        </Card>

        {/* Place of Birth */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 space-y-3">
            <Label htmlFor="place" className="text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              {getTranslation('Place of Birth', 'जन्म स्थान')}
            </Label>
            <Input
              id="place"
              type="text"
              placeholder={getTranslation('Enter city name', 'शहर का नाम दर्ज करें')}
              value={formData.placeOfBirth}
              onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
            {coordinates.latitude && coordinates.longitude && (
              <p className="text-xs text-gray-500">
                {getTranslation('Coordinates:', 'निर्देशांक:')} {coordinates.latitude.toFixed(2)}, {coordinates.longitude.toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
          disabled={isLoading || !formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {getTranslation('Generating...', 'तैयार कर रहे...')}
            </div>
          ) : (
            getTranslation('Generate Kundali', 'कुंडली बनाएं')
          )}
        </Button>
      </form>
    </div>
  );
};

export default BirthDataForm;
