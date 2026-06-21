import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Business hours 8:00 AM – 5:00 PM Philippine time, 30-min increments.
function buildTimeSlots(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [];
  for (let h = 8; h <= 17; h++) {
    for (const m of [0, 30]) {
      if (h === 17 && m > 0) break;
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const hour12 = ((h + 11) % 12) + 1;
      const suffix = h >= 12 ? "PM" : "AM";
      const label = `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
      slots.push({ value, label });
    }
  }
  return slots;
}

const TIME_SLOTS = buildTimeSlots();

function toIsoDate(date: Date | undefined): string {
  if (!date) return "";
  // Build YYYY-MM-DD from local components — no UTC shift.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface SchedulePickerProps {
  date: Date | undefined;
  time: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  dateName?: string;
  timeName?: string;
  minDate?: Date;
  className?: string;
  layout?: "stacked" | "grid";
  required?: boolean;
}

export function SchedulePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateName,
  timeName,
  minDate,
  className,
  layout = "grid",
  required,
}: SchedulePickerProps) {
  const [open, setOpen] = React.useState(false);
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const earliest = minDate ?? today;

  const timeLabel = React.useMemo(() => {
    const slot = TIME_SLOTS.find((s) => s.value === time);
    return slot?.label;
  }, [time]);

  return (
    <div
      className={cn(
        layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-3",
        className,
      )}
    >
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Preferred Date{required && <span className="text-destructive"> *</span>}
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "mt-2 w-full justify-start rounded-xl bg-background/60 border-border px-4 py-6 text-sm font-normal h-auto",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                onDateChange(d);
                if (d) setOpen(false);
              }}
              disabled={(d) => d < earliest}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {dateName && (
          <input type="hidden" name={dateName} value={toIsoDate(date)} />
        )}
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Preferred Time{required && <span className="text-destructive"> *</span>}
        </label>
        <Select value={time || undefined} onValueChange={onTimeChange}>
          <SelectTrigger
            className={cn(
              "mt-2 w-full rounded-xl bg-background/60 border-border px-4 py-6 text-sm h-auto",
              !time && "text-muted-foreground",
            )}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <SelectValue placeholder="Pick a time">
                {timeLabel}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {TIME_SLOTS.map((slot) => (
              <SelectItem key={slot.value} value={slot.value}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {timeName && (
          <input type="hidden" name={timeName} value={time} />
        )}
      </div>
    </div>
  );
}
