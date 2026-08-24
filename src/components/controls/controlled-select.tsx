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
  placeholder?: string;
}
export function ControlledSelect<T extends FieldValues>({
  name,
  control,
  options,
  label,
  isLoading = false,
  placeholder,
}: ControlSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoading ? "Yuklanmoqda..." : (placeholder ?? "Tanlang")
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="translate-y-8.5 -translate-x-0.5">
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
      )}
    />
  );
}
