import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { OptionSelect } from "../ui/option-select";
import { cn } from "@/lib/utils";

export interface IOption {
  value: string | number;
  label: string;
}
interface ControlSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: IOption[];
  label?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  asNumber?: boolean;
  clearable?: boolean;
  required?: boolean;
  className?: string;
  height?: string;
}
export function ControlledSelect<T extends FieldValues>({
  name,
  control,
  options,
  label,
  disabled = false,
  placeholder,
  onChange,
  asNumber,
  clearable = true,
  required,
  className,
  height,
}: ControlSelectProps<T>) {
  const selectOptions = options.map((item) => ({
    value: String(item.value),
    label: item.label,
  }));

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const clearData = () => {
          field.onChange(asNumber ? null : "");
          field.onBlur();
          onChange?.("");
        };
        const showClear = clearable && !!field.value;

        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-red-500">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <OptionSelect
                key={field.value}
                options={selectOptions}
                disabled={disabled}
                placeholder={placeholder}
                value={
                  field.value != null && field.value !== ""
                    ? String(field.value)
                    : undefined
                }
                onValueChange={(val) => {
                  field.onChange(asNumber ? Number(val) : val);
                  onChange?.(val);
                }}
                onOpenChange={(open) => {
                  if (!open) field.onBlur();
                }}
                hasData={showClear}
                clearData={showClear ? clearData : undefined}
                valueClassName={height}
                className={cn(
                  "w-full",
                  className,
                  fieldState.error
                    ? "border-red-500 bg-red-500/10 focus-within:border-red-500"
                    : "border-grey-100 bg-white focus-within:border-purple-600",
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
