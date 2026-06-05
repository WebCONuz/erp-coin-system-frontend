import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input, type InputProps } from "../ui/input";
import { FlagUzb } from "@/assets/icons";
import { numberDecimalMask, numberMask } from "@/ustils/mask-number";

interface InputControlProps<
  T extends FieldValues = FieldValues,
> extends InputProps {
  control?: Control<T>;
  name: Path<T>;
  label?: string | null;
  labelClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  required?: boolean;
  isNumber?: boolean;
  isPhoneNumber?: boolean;
  maxLength?: number;
  maxValue?: number;
  withoutDescription?: boolean;
  SuffixChild?: React.ReactNode;
  PrefixChild?: React.ReactNode;
  isDecimal?: boolean;
}

export const ControlledInput = <T extends FieldValues = FieldValues>({
  control,
  label,
  name,
  className,
  labelClassName,
  inputClassName,
  type: inputType,
  required,
  isNumber,
  isPhoneNumber,
  isDecimal,
  maxLength,
  maxValue,
  withoutDescription,
  SuffixChild,
  PrefixChild,
  placeholder,
  ...rest
}: InputControlProps<T>) => {
  const [type, setType] = useState(inputType);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSetType = () => {
    if (type === "text") {
      setType("password");
    } else {
      setType("text");
    }
  };

  const onWrapperMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field }, fieldState }) => (
        <FormItem className={cn("relative", className)}>
          {label && (
            <FormLabel className={labelClassName}>
              {label}{" "}
              {required && <span className={cn("text-destructive")}>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div
              className={cn(
                "relative flex h-10 w-full items-center gap-1 rounded-lg border transition-colors",
                fieldState.error
                  ? "border-red-500 bg--red-500/10 focus-within:border-red-500"
                  : "border-grey-100 dark:border-gray-700 bg-background focus-within:border-primary/80 dark:focus-within:border-primary/80",
                rest.disabled && "bg-gray-smoke/20 opacity-50",
                rest.readOnly && "bg-transparent",
                inputClassName,
              )}
              onClick={onWrapperMouseDown}
            >
              {isPhoneNumber && (
                <div className="flex items-center gap-1 pl-3 pointer-events-none">
                  <span className="flex items-center justify-center w-6 h-4 overflow-hidden rounded-sm">
                    <FlagUzb />
                  </span>
                </div>
              )}
              {PrefixChild}
              <Input
                {...rest}
                {...field}
                ref={inputRef}
                required={false}
                value={value ?? ""}
                className={cn(
                  "w-full border-0 bg-transparent py-1 shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#0D112666]",
                  isPhoneNumber ? "pl-1 pr-3" : "px-3",
                )}
                type={type}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={(e) => {
                  if (isPhoneNumber) {
                    const maskedValue = numberMask(e.target.value).slice(0, 9);
                    onChange(maskedValue);
                  } else if (isDecimal) {
                    const masked = numberDecimalMask(e.target.value);
                    const numericValue =
                      parseFloat(masked.replace(",", ".")) || 0;
                    if (maxValue !== undefined && numericValue > maxValue) {
                      onChange(String(maxValue).replace(".", ","));
                      return;
                    }
                    onChange(masked);
                  } else if (isNumber) {
                    let maskedValue = numberMask(e.target.value);
                    if (maxLength && maskedValue.length > maxLength) {
                      return;
                    }
                    const numericValue = Number(maskedValue);
                    if (maxValue !== undefined && numericValue > maxValue) {
                      maskedValue = String(maxValue);
                    }
                    onChange(maskedValue);
                  } else {
                    onChange(e);
                  }
                }}
              />
              {inputType === "password" ? (
                <a
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={onSetType}
                >
                  {type === "text" ? (
                    <Eye size={18} color="#0D112666" />
                  ) : (
                    <EyeOff size={18} color="#0D112666" />
                  )}
                </a>
              ) : null}
              {SuffixChild}
            </div>
          </FormControl>
          {fieldState.error && <FormMessage />}
        </FormItem>
      )}
    />
  );
};
