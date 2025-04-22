import React, { useCallback, useEffect, useState } from "react";
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

export function useTimeMask(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((time: string) => {
    const inputValue = time.replace(/[^\d:]/g, '');
    const parts = inputValue.split(':');

    let hours = parts[0] || '';
    let minutes = parts[1] || '';

    if (hours.length > 2) {
      minutes = hours.slice(2) + minutes;
      hours = hours.slice(0, 2);
    }

    if (hours.length === 2 && parseInt(hours) > 12) {
      hours = '12';
    }

    if (minutes.length > 2) {
      minutes = minutes.slice(0, 2);
    }

    if (minutes.length === 2 && parseInt(minutes) > 59) {
      minutes = '59';
    }

    let newValue = hours;
    if (minutes) {
      newValue += ':' + minutes;
    }

    setValue(newValue);
  }, []);

  const formatTime = useCallback((time: string) => {
    const parts = time.split(':');

    const hours = parts[0]?.padStart(2, '0') || '12';
    const minutes = parts[1]?.padStart(2, '0') || '00';

    return `${hours}:${minutes}`;
  }, []);

  return [value, onChange, formatTime] as const;
}

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DatePicker({ date, setDate }: DateTimePickerProps) {
  const [timeInput, setTimeInput, formatTime] = useTimeMask(date ? format(date, "hh:mm") : "12:00");
  const [period, setPeriod] = useState<"AM" | "PM">(date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM");
  const [isValidTime, setIsValidTime] = useState(true);

  useEffect(() => {
    if (date) {
      setTimeInput(format(date, "hh:mm"));
      setPeriod(date.getHours() >= 12 ? "PM" : "AM");
    }
  }, [date]);

  const handleTimeChange = (newTime: string) => {
    setTimeInput(newTime);
    updateDateWithTime(newTime, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === "AM" ? "PM" : "AM";
    setPeriod(newPeriod);
    updateDateWithTime(timeInput, newPeriod);
  };

  const updateDateWithTime = (time: string, period: "AM" | "PM") => {
    if (time.length === 5) {
      const [hours, minutes] = time.split(':').map(Number);

      if (
        hours >= 1 && hours <= 12 &&
        minutes >= 0 && minutes <= 59 &&
        !isNaN(hours) && !isNaN(minutes)
      ) {
        setIsValidTime(true);
        if (date) {
          const newDate = new Date(date);
          let adjustedHours = hours % 12;
          if (period === "PM") {
            adjustedHours += 12;
          }
          newDate.setHours(adjustedHours, minutes);
          setDate(newDate);
        }
      } else {
        setIsValidTime(false);
      }
    } else {
      setIsValidTime(false);
    }
  };

  const handleBlur = () => {
    const formattedTime = formatTime(timeInput);
    setTimeInput(formattedTime);
    updateDateWithTime(formattedTime, period);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left normal-case font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP hh:mm a") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              const updatedDate = new Date(newDate);
              if (date) {
                updatedDate.setHours(date.getHours(), date.getMinutes());
              }
              setDate(updatedDate);
              setTimeInput(format(updatedDate, "hh:mm"));
              setPeriod(updatedDate.getHours() >= 12 ? "PM" : "AM");
            } else {
              setDate(undefined);
              setTimeInput("12:00");
              setPeriod("AM");
            }
          }}
          initialFocus
        />
        <div className="p-3 border-t flex items-center">
          <Clock className="mr-2 h-4 w-4 opacity-50" />
          <Input
            type="text"
            value={timeInput}
            onChange={(e) => handleTimeChange(e.target.value)}
            onBlur={handleBlur}
            className={cn("w-24", !isValidTime && "border-red-500")}
            placeholder="hh:mm"
          />
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={togglePeriod}
          >
            {period}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
