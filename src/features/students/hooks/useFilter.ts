import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useSyncFiltersToUrl } from "@/hooks";

type FilterFormData = {
  search: string;
  status: string;
  groupId: string;
};

export type StudentSortField = "fullName" | "coin";
export type StudentSortOrder = "asc" | "desc";

export const useStudentFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "active",
      groupId: searchParams.get("groupId") || "",
    },
  });

  const [search, status, groupId] = useWatch({
    control: form.control,
    name: ["search", "status", "groupId"],
  });

  useSyncFiltersToUrl({ search, status, groupId });

  const sortBy = (searchParams.get("sortBy") as StudentSortField) || undefined;
  const sortOrder =
    (searchParams.get("sortOrder") as StudentSortOrder) || "desc";

  const toggleSort = (field: StudentSortField) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("page");
    if (sortBy !== field) {
      newParams.set("sortBy", field);
      newParams.set("sortOrder", "asc");
    } else {
      newParams.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    }
    setSearchParams(newParams, { replace: true });
  };

  const clearFilters = () => {
    form.reset({ search: "", status: "active", groupId: "" });
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return { form, clearFilters, sortBy, sortOrder, toggleSort };
};
