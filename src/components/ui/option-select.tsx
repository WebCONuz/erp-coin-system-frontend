import * as React from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  SearchableSelect,
  SELECT_SEARCH_THRESHOLD,
  type SelectOption,
} from "./searchable-select";

type OptionSelectProps = Omit<
  React.ComponentProps<"button">,
  "value" | "onChange"
> & {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  hasData?: boolean;
  clearData?: () => void;
  contentClassName?: string;
  valueClassName?: string;
};

/**
 * Options-driven select: renders a plain select for short lists and switches
 * to a searchable one when there are more than SELECT_SEARCH_THRESHOLD options.
 * Extra props (id, aria-*) go to the trigger, so it works inside <FormControl>.
 */
function OptionSelect({
  options,
  value,
  onValueChange,
  onOpenChange,
  placeholder,
  disabled,
  hasData,
  clearData,
  className,
  contentClassName,
  valueClassName,
  ...props
}: OptionSelectProps) {
  const { t } = useTranslation();

  if (options.length > SELECT_SEARCH_THRESHOLD) {
    return (
      <SearchableSelect
        options={options}
        value={value}
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
        placeholder={placeholder}
        disabled={disabled}
        hasData={hasData}
        clearData={clearData}
        className={className}
        contentClassName={contentClassName}
        valueClassName={valueClassName}
        {...props}
      />
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      <SelectTrigger
        hasData={hasData}
        clearData={clearData}
        className={className}
        {...props}
      >
        <div className={cn("line-clamp-1 w-auto text-left", valueClassName)}>
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>

      <SelectContent
        position="popper"
        side="bottom"
        className={contentClassName}
      >
        {options.length > 0 ? (
          options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))
        ) : (
          <div className="p-1 text-center text-sm text-muted-foreground">
            {t("common.nothingFound")}
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

export { OptionSelect };
