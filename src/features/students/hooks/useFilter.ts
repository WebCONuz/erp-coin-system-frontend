import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { updateSearchParams } from "@/ustils";

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

  const searchValue = form.watch("search");
  const statusValue = form.watch("status");
  const groupIdValue = form.watch("groupId");

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("search", searchValue, searchParams, setSearchParams);
  }, [searchValue]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("status", statusValue, searchParams, setSearchParams);
  }, [statusValue]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("groupId", groupIdValue, searchParams, setSearchParams);
  }, [groupIdValue]);

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
