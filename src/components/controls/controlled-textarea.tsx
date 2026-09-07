import { type Control, type FieldValues, type Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { latinAlphabetMask } from "@/ustils";

interface ContolledTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  className?: string;
  isLatinNumber?: boolean;
  required?: boolean;
}

export const ControlledTextarea = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  isLatinNumber,
  required,
  ...rest
}: ContolledTextareaProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-red">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...{ ...field, ...rest }}
              onChange={(e) => {
                let value = e.target.value;
                if (isLatinNumber) {
                  value = latinAlphabetMask(value);
                }
                field.onChange(value);
              }}
              className={cn(
                "relative",
                className,
                fieldState.error
                  ? "border-red-500 bg-red-500/10 focus-within:border-red-500"
                  : "border-grey-100 bg-white focus-within:border-purple-600",
              )}
            />
          </FormControl>
          {!fieldState.error && <FormMessage />}
        </FormItem>
      )}
    />
  );
};
