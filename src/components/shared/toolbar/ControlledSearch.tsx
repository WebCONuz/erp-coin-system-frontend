import type { Control, FieldValues, Path } from "react-hook-form";
import { Search } from "lucide-react";
import { ControlledInput } from "@/components/controls";
import { TEXT_LIMITS } from "@/ustils/api-limits";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
}

/** Ikonkali qidiruv maydoni (react-hook-form). */
export const ControlledSearch = <T extends FieldValues>({
  control,
  name,
  placeholder,
}: Props<T>) => (
  <div role="search" className="relative w-full sm:w-72">
    <Search
      className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden
    />
    <ControlledInput
      control={control}
      placeholder={placeholder}
      name={name}
      maxLength={TEXT_LIMITS.SEARCH}
      inputClassName="h-9 pl-9"
    />
  </div>
);
