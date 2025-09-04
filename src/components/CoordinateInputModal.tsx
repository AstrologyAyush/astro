import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from 'lucide-react';

interface CoordinateInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (latitude: number, longitude: number) => void;
  language: 'hi' | 'en';
}

const CoordinateInputModal: React.FC<CoordinateInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language
}) => {
  const [coordinates, setCoordinates] = useState({
    latitude: '',
    longitude: ''
  });
  const [errors, setErrors] = useState({
    latitude: '',
    longitude: ''
  });

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const validateCoordinate = (value: string, type: 'latitude' | 'longitude') => {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return getTranslation('Please enter a valid number', 'कृपया एक मान्य संख्या दर्ज करें');
    }
    
    if (type === 'latitude') {
      if (num < -90 || num > 90) {
        return getTranslation('Latitude must be between -90 and 90', 'अक्षांश -90 और 90 के बीच होना चाहिए');
      }
    } else {
      if (num < -180 || num > 180) {
        return getTranslation('Longitude must be between -180 and 180', 'देशांतर -180 और 180 के बीच होना चाहिए');
      }
    }
    
    return '';
  };

  const handleInputChange = (field: 'latitude' | 'longitude', value: string) => {
    setCoordinates(prev => ({ ...prev, [field]: value }));
    
    // Clear existing error
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    // Validate if value is not empty
    if (value.trim()) {
      const error = validateCoordinate(value, field);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const latError = validateCoordinate(coordinates.latitude, 'latitude');
    const lonError = validateCoordinate(coordinates.longitude, 'longitude');
    
    setErrors({
      latitude: latError,
      longitude: lonError
    });
    
    if (!latError && !lonError && coordinates.latitude && coordinates.longitude) {
      onSubmit(parseFloat(coordinates.latitude), parseFloat(coordinates.longitude));
      setCoordinates({ latitude: '', longitude: '' });
      setErrors({ latitude: '', longitude: '' });
      onClose();
    }
  };

  const handleClose = () => {
    setCoordinates({ latitude: '', longitude: '' });
    setErrors({ latitude: '', longitude: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            {getTranslation('Enter Coordinates Manually', 'निर्देशांक मैन्युअली दर्ज करें')}
          </DialogTitle>
          <DialogDescription>
            {getTranslation(
              'Enter the latitude and longitude for your birth place.',
              'अपने जन्म स्थान के लिए अक्षांश और देशांतर दर्ज करें।'
            )}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">
              {getTranslation('Latitude', 'अक्षांश')} (-90 to 90)
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={coordinates.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              placeholder={getTranslation('e.g., 28.6139', 'उदा., 28.6139')}
              className={errors.latitude ? 'border-red-500' : ''}
              required
            />
            {errors.latitude && (
              <p className="text-sm text-red-500">{errors.latitude}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="longitude">
              {getTranslation('Longitude', 'देशांतर')} (-180 to 180)
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={coordinates.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              placeholder={getTranslation('e.g., 77.2090', 'उदा., 77.2090')}
              className={errors.longitude ? 'border-red-500' : ''}
              required
            />
            {errors.longitude && (
              <p className="text-sm text-red-500">{errors.longitude}</p>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              {getTranslation('Cancel', 'रद्द करें')}
            </Button>
            <Button type="submit" className="flex-1">
              {getTranslation('Confirm', 'पुष्टि करें')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CoordinateInputModal;