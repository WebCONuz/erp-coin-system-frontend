import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useSyncFiltersToUrl } from "@/hooks";

type FilterFormData = {
  search: string;
  direction: string;
};

export const useFilter = () => {
  const [searchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      direction: searchParams.get("direction") || "all",
    },
  });

  const [search, direction] = useWatch({
    control: form.control,
    name: ["search", "direction"],
  });

  useSyncFiltersToUrl({ search, direction });

  return {
    form,
  };
};
