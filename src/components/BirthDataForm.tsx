
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, MapPin } from "lucide-react";
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

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  birthDate: z.date({
    required_error: "A birth date is required.",
  }),
  birthTime: z.string().min(5, {
    message: "Birth time must be in the format HH:MM.",
  }),
  birthPlace: z.string().min(2, {
    message: "Please enter a valid birth place.",
  }),
  latitude: z.number({
    required_error: "Latitude is required.",
    invalid_type_error: "Latitude must be a number.",
  }).min(-90).max(90),
  longitude: z.number({
    required_error: "Longitude is required.",
    invalid_type_error: "Longitude must be a number.",
  }).min(-180).max(180),
  timezone: z.string(),
});

interface BirthDataFormProps {
  onSubmit: (data: BirthData & { fullName: string }) => void;
}

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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    const place = form.getValues("birthPlace");
    if (!place) {
      toast({
        title: "Error",
        description: "Please enter a birth place first",
        variant: "destructive",
      });
      return;
    }

    setLocationStatus({ loading: true });
    
    try {
      // Simulate API call to geocoding service
      // In a real app, you'd use a service like Google Geocoding API, Nominatim, etc.
      setTimeout(() => {
        // Mock data based on some common cities
        const cityData: {[key: string]: {lat: number, lng: number, tz: string}} = {
          "new york": { lat: 40.7128, lng: -74.0060, tz: "America/New_York" },
          "london": { lat: 51.5074, lng: -0.1278, tz: "Europe/London" },
          "tokyo": { lat: 35.6762, lng: 139.6503, tz: "Asia/Tokyo" },
          "delhi": { lat: 28.6139, lng: 77.2090, tz: "Asia/Kolkata" },
          "mumbai": { lat: 19.0760, lng: 72.8777, tz: "Asia/Kolkata" },
          "kolkata": { lat: 22.5726, lng: 88.3639, tz: "Asia/Kolkata" },
          "bangalore": { lat: 12.9716, lng: 77.5946, tz: "Asia/Kolkata" },
          "chennai": { lat: 13.0827, lng: 80.2707, tz: "Asia/Kolkata" },
          "hyderabad": { lat: 17.3850, lng: 78.4867, tz: "Asia/Kolkata" },
          "sydney": { lat: -33.8688, lng: 151.2093, tz: "Australia/Sydney" },
          "paris": { lat: 48.8566, lng: 2.3522, tz: "Europe/Paris" },
        };
        
        const lowercasePlace = place.toLowerCase();
        const match = Object.keys(cityData).find(city => 
          lowercasePlace.includes(city) || city.includes(lowercasePlace)
        );
        
        if (match) {
          const { lat, lng, tz } = cityData[match];
          form.setValue("latitude", lat);
          form.setValue("longitude", lng);
          form.setValue("timezone", tz);
          
          toast({
            title: "Location Found",
            description: `Coordinates set for ${place}`,
          });
        } else {
          // Default to Delhi for demo
          form.setValue("latitude", 28.6139);
          form.setValue("longitude", 77.2090);
          form.setValue("timezone", "Asia/Kolkata");
          
          toast({
            title: "Location Approximated",
            description: "Using approximate coordinates. Please verify.",
          });
        }
        
        setLocationStatus({ loading: false });
      }, 1000);
    } catch (error) {
      setLocationStatus({ 
        loading: false, 
        error: "Could not find location. Please enter coordinates manually."
      });
      
      toast({
        title: "Error",
        description: "Could not find location. Please enter coordinates manually.",
        variant: "destructive",
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormDescription>
                Your name as it appears on official documents.
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
                <FormLabel>Birth Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
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
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your exact birth date is crucial for accurate calculations.
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
                <FormLabel>Birth Time (24-hour format)</FormLabel>
                <FormControl>
                  <Input type="time" placeholder="HH:MM" {...field} />
                </FormControl>
                <FormDescription>
                  Enter as accurately as possible for precise Kundali calculations.
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
              <FormLabel>Birth Place</FormLabel>
              <FormControl>
                <div className="flex">
                  <Input 
                    placeholder="City, State, Country" 
                    {...field} 
                    className="rounded-r-none" 
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="rounded-l-none flex items-center gap-1"
                    onClick={getGeolocation}
                    disabled={locationStatus.loading}
                  >
                    {locationStatus.loading ? "Finding..." : "Locate"}
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              {locationStatus.error && <p className="text-sm text-red-500">{locationStatus.error}</p>}
              <FormDescription>
                Enter your birth place, and we'll try to find its coordinates.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.0001" 
                    placeholder="e.g. 28.6139"
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
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.0001" 
                    placeholder="e.g. 77.2090"
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
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Asia/Kolkata" {...field} />
              </FormControl>
              <FormDescription>
                Your timezone is automatically detected but you can adjust if needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Generate Kundali</Button>
      </form>
    </Form>
  );
};

export default BirthDataForm;
