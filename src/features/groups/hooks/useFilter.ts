import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useSyncFiltersToUrl } from "@/hooks";

type FilterFormData = {
  search: string;
  status: string;
};

export const useFilter = () => {
  const [searchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "",
    },
  });

  const [search, status] = useWatch({
    control: form.control,
    name: ["search", "status"],
  });

  useSyncFiltersToUrl({ search, status });

  return {
    form,
  };
};
