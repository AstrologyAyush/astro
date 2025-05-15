
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "lucide-react";
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

const formSchema = z.object({
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
  onSubmit: (data: BirthData) => void;
}

const BirthDataForm: React.FC<BirthDataFormProps> = ({ onSubmit }) => {
  const [locationError, setLocationError] = useState<string>("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: new Date(),
      birthTime: "12:00",
      birthPlace: "",
      latitude: 0,
      longitude: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const birthData: BirthData = {
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
      setLocationError("Please enter a birth place first");
      return;
    }

    setLocationError("");
    try {
      // In a real application, you would use a geocoding service
      // For this demo, we're setting mock coordinates
      setTimeout(() => {
        form.setValue("latitude", 28.6139);
        form.setValue("longitude", 77.2090);
        form.setValue("timezone", "Asia/Kolkata");
        setLocationError("");
      }, 1000);
    } catch (error) {
      setLocationError("Could not find location. Please enter coordinates manually.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
        
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="birthPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Place</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Input placeholder="City, State, Country" {...field} className="rounded-r-none" />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="rounded-l-none"
                      onClick={getGeolocation}
                    >
                      Locate
                    </Button>
                  </div>
                </FormControl>
                {locationError && <p className="text-sm text-red-500">{locationError}</p>}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
