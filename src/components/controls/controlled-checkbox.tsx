import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { type Control, type FieldValues, type Path } from "react-hook-form";

interface ContolledCheckboxProps<T extends FieldValues> {
  name: string;
  label?: string | null;
  className?: string;
  labelClass?: string;
  checkboxClassName?: string;
  control: Control<T>;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  notRequired?: boolean;
  withoutDescription?: boolean;
}

export default function ControlledCheckbox<T extends FieldValues>({
  name,
  label,
  control,
  description,
  className,
  labelClass,
  checkboxClassName,
  required,
  disabled,
  notRequired,
  withoutDescription,
}: ContolledCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={cn(className, "relative")}>
          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={checkboxClassName}
              />
            </FormControl>
            {label && (
              <FormLabel
                className={cn(labelClass, "cursor-pointer text-sm font-normal")}
              >
                {label} {required && <span className={cn("text-red")}>*</span>}
              </FormLabel>
            )}
          </div>
          {withoutDescription ? null : (
            <div className="absolute -bottom-4.5 right-0">
              {description && <FormDescription>{description}</FormDescription>}
              {!notRequired && <FormMessage />}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
