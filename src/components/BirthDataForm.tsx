
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
    isLocationSelected: false,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(formData.placeOfBirth, 500);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const fetchSuggestions = useCallback(async (place: string) => {
    if (!place || place.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=jsonv2&limit=8&addressdetails=1`
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
    if (debouncedSearchTerm && !formData.isLocationSelected) {
      fetchSuggestions(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchSuggestions, formData.isLocationSelected]);

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const place = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      placeOfBirth: place,
      isLocationSelected: false,
      latitude: 0,
      longitude: 0
    }));
    setShowSuggestions(true);
  };

  const handlePlaceSelect = (place: any) => {
    const displayName = place.display_name || place.name;
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    
    setFormData(prev => ({
      ...prev,
      placeOfBirth: displayName,
      latitude: lat,
      longitude: lon,
      isLocationSelected: true,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
    
    toast({
      title: getTranslation("Location Selected", "स्थान चुना गया"),
      description: getTranslation(
        `Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        `निर्देशांक: ${lat.toFixed(4)}, ${lon.toFixed(4)}`
      ),
    });
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(prompt(getTranslation("Enter Latitude:", "अक्षांश दर्ज करें:")) || "0");
    const lon = parseFloat(prompt(getTranslation("Enter Longitude:", "देशांतर दर्ज करें:")) || "0");
    
    if (lat !== 0 && lon !== 0) {
      setFormData(prev => ({
        ...prev,
        latitude: lat,
        longitude: lon,
        isLocationSelected: true,
      }));
      
      toast({
        title: getTranslation("Manual Coordinates Set", "मैन्युअल निर्देशांक सेट"),
        description: getTranslation(
          `Latitude: ${lat}, Longitude: ${lon}`,
          `अक्षांश: ${lat}, देशांतर: ${lon}`
        ),
      });
    }
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
        description: getTranslation("Please select a valid place or enter coordinates manually.", "कृपया एक मान्य स्थान चुनें या मैन्युअल रूप से निर्देशांक दर्ज करें।"),
        variant: "destructive"
      });
      return;
    }

    const birthDateTime = new Date(`${formData.dateOfBirth}T${formData.timeOfBirth}:00`);
    
    onSubmit({
      name: formData.name,
      dateOfBirth: birthDateTime,
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
              onFocus={() => !formData.isLocationSelected && setShowSuggestions(true)}
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
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-900 text-sm"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <div>
                      <div className="font-medium">{place.name}</div>
                      <div className="text-xs text-gray-500">{place.display_name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coordinates Display */}
        {formData.latitude !== 0 && formData.longitude !== 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-sm text-green-800">
              <div className="font-medium">{getTranslation('Coordinates Confirmed', 'निर्देशांक पुष्ट')}</div>
              <div className="mt-1">
                {getTranslation('Latitude', 'अक्षांश')}: {formData.latitude.toFixed(4)}°
              </div>
              <div>
                {getTranslation('Longitude', 'देशांतर')}: {formData.longitude.toFixed(4)}°
              </div>
            </div>
          </div>
        )}

        {/* Manual Coordinates Button */}
        {!formData.isLocationSelected && (
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleManualCoordinates}
              className="text-sm"
            >
              {getTranslation('Enter Coordinates Manually', 'निर्देशांक मैन्युअली दर्ज करें')}
            </Button>
          </div>
        )}

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
