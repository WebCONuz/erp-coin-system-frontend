import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useSyncFiltersToUrl } from "@/hooks";
import { ALL_VALUE } from "../constants";

type FilterFormData = {
  search: string;
  status: string;
  roleId: string;
};

export const useFilter = () => {
  const [searchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "active",
      roleId: searchParams.get("roleId") || ALL_VALUE,
    },
  });

  const [search, status, roleId] = useWatch({
    control: form.control,
    name: ["search", "status", "roleId"],
  });

  useSyncFiltersToUrl({
    search,
    status,
    roleId: roleId === ALL_VALUE ? null : roleId,
  });

  return {
    form,
  };
};
