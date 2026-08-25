import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

export interface IOption {
  value: string | number;
  label: string;
}
type BaseSelectProps = React.ComponentPropsWithoutRef<typeof Select>;
interface ControlSelectProps<T extends FieldValues> extends Omit<
  BaseSelectProps,
  "value" | "onValueChange"
> {
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
  isLoading = false,
  disabled = false,
  placeholder,
  onChange,
  asNumber,
  clearable = true,
  required,
  className,
  height,
  ...props
}: ControlSelectProps<T>) {
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
            <Select
              {...props}
              key={field.value}
              disabled={disabled}
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
                if (disabled && open) return false;
                if (!open) field.onBlur();
              }}
            >
              <FormControl>
                <SelectTrigger
                  hasData={showClear}
                  clearData={showClear ? clearData : undefined}
                  className={cn(
                    "w-full",
                    className,
                    fieldState.error
                      ? "border-red-500 bg-red-500/10 focus-within:border-red-500"
                      : "border-grey-100 bg-white focus-within:border-purple-600",
                  )}
                >
                  <div
                    className={`line-clamp-1 w-auto text-left ${height || ""}`}
                  >
                    <SelectValue placeholder={placeholder} />
                  </div>
                </SelectTrigger>
              </FormControl>

              <SelectContent position="popper" side="bottom">
                {options.length > 0 ? (
                  options.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>
                      {item.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-1 text-center text-sm text-muted-foreground">
                    Nothing found
                  </div>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
