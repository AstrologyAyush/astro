
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { BirthData } from "@/lib/kundaliUtils";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "नाम कम से कम 2 अक्षर का होना चाहिए।",
  }),
  birthDate: z.date({
    required_error: "जन्म तिथि आवश्यक है।",
  }),
  birthTime: z.string().min(5, {
    message: "जन्म समय HH:MM प्रारूप में होना चाहिए।",
  }),
  birthPlace: z.string().min(2, {
    message: "कृपया एक वैध जन्म स्थान दर्ज करें।",
  }),
  latitude: z.number({
    required_error: "अक्षांश आवश्यक है।",
    invalid_type_error: "अक्षांश एक संख्या होनी चाहिए।",
  }).min(-90).max(90),
  longitude: z.number({
    required_error: "देशांतर आवश्यक है।",
    invalid_type_error: "देशांतर एक संख्या होनी चाहिए।",
  }).min(-180).max(180),
  timezone: z.string(),
});

interface BirthDataFormProps {
  onSubmit: (data: BirthData & { fullName: string }) => void;
}

const CITIES_DATA: {[key: string]: {lat: number, lng: number, tz: string}} = {
  "delhi": { lat: 28.6139, lng: 77.2090, tz: "Asia/Kolkata" },
  "mumbai": { lat: 19.0760, lng: 72.8777, tz: "Asia/Kolkata" },
  "kolkata": { lat: 22.5726, lng: 88.3639, tz: "Asia/Kolkata" },
  "chennai": { lat: 13.0827, lng: 80.2707, tz: "Asia/Kolkata" },
  "bengaluru": { lat: 12.9716, lng: 77.5946, tz: "Asia/Kolkata" },
  "hyderabad": { lat: 17.3850, lng: 78.4867, tz: "Asia/Kolkata" },
  "ahmedabad": { lat: 23.0225, lng: 72.5714, tz: "Asia/Kolkata" },
  "pune": { lat: 18.5204, lng: 73.8567, tz: "Asia/Kolkata" },
  "jaipur": { lat: 26.9124, lng: 75.7873, tz: "Asia/Kolkata" },
  "lucknow": { lat: 26.8467, lng: 80.9462, tz: "Asia/Kolkata" },
  "kanpur": { lat: 26.4499, lng: 80.3319, tz: "Asia/Kolkata" },
  "nagpur": { lat: 21.1458, lng: 79.0882, tz: "Asia/Kolkata" },
  "indore": { lat: 22.7196, lng: 75.8577, tz: "Asia/Kolkata" },
  "bhopal": { lat: 23.2599, lng: 77.4126, tz: "Asia/Kolkata" },
  "patna": { lat: 25.5941, lng: 85.1376, tz: "Asia/Kolkata" },
};

const BirthDataForm: React.FC<BirthDataFormProps> = ({ onSubmit }) => {
  const [locationStatus, setLocationStatus] = useState<{
    loading: boolean;
    error?: string;
  }>({ loading: false });
  
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      birthDate: new Date(),
      birthTime: "12:00",
      birthPlace: "",
      latitude: 0,
      longitude: 0,
      timezone: "Asia/Kolkata",
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const birthData: BirthData & { fullName: string } = {
      fullName: values.fullName,
      date: values.birthDate,
      time: values.birthTime,
      place: values.birthPlace,
      latitude: values.latitude,
      longitude: values.longitude,
      timezone: values.timezone,
    };
    onSubmit(birthData);
  }

  // Get geolocation for birth place
  const getGeolocation = async () => {
    const place = form.getValues("birthPlace").trim().toLowerCase();
    if (!place) {
      toast({
        title: "त्रुटि",
        description: "कृपया पहले जन्म स्थान दर्ज करें",
        variant: "destructive",
      });
      return;
    }

    setLocationStatus({ loading: true });
    
    try {
      // Check in our predefined cities first
      const cityMatch = Object.keys(CITIES_DATA).find(city => 
        place.includes(city) || city.includes(place)
      );
      
      if (cityMatch) {
        const { lat, lng, tz } = CITIES_DATA[cityMatch];
        form.setValue("latitude", lat);
        form.setValue("longitude", lng);
        form.setValue("timezone", tz);
        
        toast({
          title: "स्थान मिल गया",
          description: `${place} के लिए निर्देशांक सेट किए गए`,
        });
      } else {
        // Simulate API call with a small delay
        setTimeout(() => {
          // If not found in our database, estimate based on country/region
          if (place.includes("india") || place.includes("bharat") || place.includes("भारत")) {
            form.setValue("latitude", 20.5937);
            form.setValue("longitude", 78.9629);
            form.setValue("timezone", "Asia/Kolkata");
          } else {
            // Default to Delhi
            form.setValue("latitude", 28.6139);
            form.setValue("longitude", 77.2090);
            form.setValue("timezone", "Asia/Kolkata");
          }
          
          toast({
            title: "अनुमानित स्थान",
            description: "अनुमानित निर्देशांक का उपयोग कर रहे हैं। कृपया सत्यापित करें।",
          });
        }, 800);
      }
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "स्थान नहीं मिला। कृपया निर्देशांक मैन्युअली दर्ज करें।",
        variant: "destructive",
      });
    } finally {
      setLocationStatus({ loading: false });
    }
  };

  // Quick city selection
  const handleQuickCitySelect = (cityName: string) => {
    const city = CITIES_DATA[cityName.toLowerCase()];
    if (city) {
      form.setValue("birthPlace", cityName);
      form.setValue("latitude", city.lat);
      form.setValue("longitude", city.lng);
      form.setValue("timezone", city.tz);
      
      toast({
        title: "स्थान चुना गया",
        description: `${cityName} के लिए निर्देशांक सेट किए गए`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>पूरा नाम</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="अपना पूरा नाम दर्ज करें" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                आपका नाम जैसा आधिकारिक दस्तावेजों में दिखाई देता है।
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>जन्म तिथि</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal flex items-center",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4 opacity-70" />
                        {field.value ? (
                          format(field.value, "dd MMMM yyyy")
                        ) : (
                          <span>तिथि चुनें</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      showOutsideDays
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={2025}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  सटीक गणना के लिए आपकी जन्म तिथि महत्वपूर्ण है।
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>जन्म समय (24-घंटे प्रारूप)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="time" placeholder="HH:MM" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  सटीक कुंडली गणना के लिए यथासंभव सटीक समय दर्ज करें।
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="birthPlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>जन्म स्थान</FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="शहर, राज्य, देश" 
                      {...field} 
                      className="rounded-r-none pl-8" 
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="rounded-l-none flex items-center gap-1"
                    onClick={getGeolocation}
                    disabled={locationStatus.loading}
                  >
                    {locationStatus.loading ? "खोज रहा है..." : "पता करें"}
                    <MapPin className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </FormControl>
              {locationStatus.error && <p className="text-sm text-red-500">{locationStatus.error}</p>}
              <FormDescription>
                अपना जन्म स्थान दर्ज करें, और हम इसके निर्देशांक ढूंढने का प्रयास करेंगे।
              </FormDescription>
              <FormMessage />
              
              <div className="mt-2">
                <p className="text-sm mb-2">भारत के प्रमुख शहर:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(CITIES_DATA).slice(0, 6).map((city) => (
                    <Button 
                      key={city} 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickCitySelect(city.charAt(0).toUpperCase() + city.slice(1))}
                      className="text-xs"
                    >
                      {city.charAt(0).toUpperCase() + city.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>अक्षांश</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.0001" 
                    placeholder="उदा. 28.6139"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>देशांतर</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.0001" 
                    placeholder="उदा. 77.2090"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>समय क्षेत्र</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="समय क्षेत्र चुनें" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">भारतीय मानक समय (IST)</SelectItem>
                  <SelectItem value="America/New_York">अमेरिकी पूर्वी समय</SelectItem>
                  <SelectItem value="Europe/London">ग्रीनविच मानक समय (GMT/UTC)</SelectItem>
                  <SelectItem value="Asia/Dubai">खाड़ी मानक समय (GST)</SelectItem>
                  <SelectItem value="Asia/Tokyo">जापान मानक समय (JST)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                आपका समय क्षेत्र स्वचालित रूप से पता चला है लेकिन आवश्यकतानुसार समायोजित कर सकते हैं।
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">कुंडली बनाएँ</Button>
      </form>
    </Form>
  );
};

export default BirthDataForm;
