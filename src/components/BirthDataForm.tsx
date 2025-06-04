
import React, { useState, useCallback } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

interface BirthDataFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  language: 'hi' | 'en';
}

const BirthDataForm: React.FC<BirthDataFormProps> = ({ onSubmit, isLoading, language }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: new Date().toISOString().split('T')[0],
    timeOfBirth: '12:00',
    placeOfBirth: '',
    latitude: 0,
    longitude: 0,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(formData.placeOfBirth, 500);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const fetchSuggestions = useCallback(async (place: string) => {
    if (!place) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${place}&format=jsonv2&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching place suggestions:', error);
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation("Failed to fetch place suggestions", "स्थान सुझाव प्राप्त करने में विफल"),
        variant: "destructive"
      });
    }
  }, [toast, getTranslation]);

  React.useEffect(() => {
    fetchSuggestions(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchSuggestions]);

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const place = e.target.value;
    setFormData(prev => ({ ...prev, placeOfBirth: place }));
    setShowSuggestions(true);
  };

  const handlePlaceSelect = (place: any) => {
    setFormData(prev => ({
      ...prev,
      placeOfBirth: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation("Please fill in all required fields.", "कृपया सभी आवश्यक फ़ील्ड भरें।"),
        variant: "destructive"
      });
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation("Please select a valid place of birth from the suggestions.", "कृपया सुझावों से जन्म का एक मान्य स्थान चुनें।"),
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      name: formData.name,
      dateOfBirth: new Date(formData.dateOfBirth),
      timeOfBirth: formData.timeOfBirth,
      placeOfBirth: formData.placeOfBirth,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <Label htmlFor="name" className="text-gray-700 font-medium">
            {getTranslation('Full Name', 'पूरा नाम')} *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={getTranslation('Enter your full name', 'अपना पूरा नाम दर्ज करें')}
            className="mt-1 bg-white border-gray-300 text-gray-900"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="date" className="text-gray-700 font-medium">
            {getTranslation('Date of Birth', 'जन्म तिथि')} *
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            className="mt-1 bg-white border-gray-300 text-gray-900"
            min="1900-01-01"
            max="2024-12-31"
            required
          />
        </div>

        {/* Time of Birth */}
        <div>
          <Label htmlFor="time" className="text-gray-700 font-medium">
            {getTranslation('Time of Birth', 'जन्म समय')} *
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.timeOfBirth}
            onChange={(e) => setFormData(prev => ({ ...prev, timeOfBirth: e.target.value }))}
            className="mt-1 bg-white border-gray-300 text-gray-900"
            required
          />
        </div>

        {/* Place of Birth */}
        <div>
          <Label htmlFor="place" className="text-gray-700 font-medium">
            {getTranslation('Place of Birth', 'जन्म स्थान')} *
          </Label>
          <div className="relative">
            <Input
              id="place"
              value={formData.placeOfBirth}
              onChange={handlePlaceChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder={getTranslation('Enter city name', 'शहर का नाम दर्ज करें')}
              className="mt-1 bg-white border-gray-300 text-gray-900"
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {suggestions.map((place, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-900"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {getTranslation('Generating...', 'तैयार कर रहे हैं...')}
            </div>
          ) : (
            getTranslation('Generate Detailed Kundali', 'विस्तृत कुंडली बनाएं')
          )}
        </Button>
      </div>
    </form>
  );
};

export default BirthDataForm;
