import { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
  DATE_FORMAT_ISO_8601,
  DATE_FORMAT_WITHOUT_DOTS,
} from "@/assets/constants";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "../ui/calendar";

interface ControlledDatePickerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string | null;
  labelClass?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  withoutDescription?: boolean;
  disabled?: boolean;
  buttonClassName?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function ControlledDatePicker<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  labelClass,
  placeholder,
  required,
  className,
  withoutDescription,
  disabled,
  buttonClassName,
  minDate,
  maxDate,
  ...props
}: ControlledDatePickerProps<TFieldValues>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const clearData = () => {
          field.onChange("");
        };

        const handleDateSelect = (date: Date | undefined) => {
          field.onChange(date ? format(date, DATE_FORMAT_ISO_8601) : "");
          setOpen(false);
        };

        // Parse date string correctly using the specific format
        const parseDateValue = (dateString: string) => {
          if (!dateString) return undefined;
          try {
            // Try to parse with the expected format first
            const parsedDate = parse(
              dateString,
              DATE_FORMAT_ISO_8601,
              new Date(),
            );

            // If parsing fails or returns invalid date, try alternative parsing
            if (!parsedDate || isNaN(parsedDate.getTime())) {
              // Try parsing as if it might be in different format
              const alternativeDate = new Date(dateString);

              return isNaN(alternativeDate.getTime())
                ? undefined
                : alternativeDate;
            }
            return parsedDate;
          } catch (error) {
            console.error("Date parsing error:", error);
            return undefined;
          }
        };

        return (
          <FormItem {...props} className={cn("relative min-w-60", className)}>
            {label && (
              <FormLabel className={labelClass}>
                {label}
                {required && <span className="text-red-500"> *</span>}
              </FormLabel>
            )}

            <div className="relative">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={disabled}
                    className={cn(
                      "flex h-10 w-full relative items-center justify-between rounded-lg border border-grey-100 dark:border-gray-700 bg-background px-3 py-1 text-sm outline-none hover:bg-background disabled:bg-gray-smoke/20 [&>span]:line-clamp-1  placeholder:text-muted-foreground pr-10",
                      fieldState.error
                        ? "border-red-500 bg-red-500/10 focus-within:border-red-500"
                        : "border-grey-100 dark:border-gray-700 bg-background focus-within:border-purple-600",
                      buttonClassName,
                    )}
                  >
                    <span className="truncate">
                      {field.value ? (
                        format(
                          parseDateValue(field.value)!,
                          DATE_FORMAT_WITHOUT_DOTS,
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          {placeholder}
                        </span>
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full rounded-lg p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDateValue(field.value)}
                    onSelect={handleDateSelect}
                    disabled={(date: Date) =>
                      minDate && maxDate
                        ? date < minDate || date > maxDate
                        : minDate && !maxDate
                          ? date < minDate
                          : maxDate && !minDate
                            ? date > maxDate
                            : false
                    }
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              {field.value && !disabled && (
                <button
                  type="button"
                  className="absolute right-10 top-1/2 z-10 flex size-5 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearData();
                  }}
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              )}
              <CalendarIcon
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none",
                  field.value ? "" : "opacity-50",
                )}
              />
            </div>

            {(!withoutDescription || fieldState.error) && (
              <FormMessage className="absolute top-[calc(100%-2px)] left-0 text-xs" />
            )}
          </FormItem>
        );
      }}
    />
  );
}
