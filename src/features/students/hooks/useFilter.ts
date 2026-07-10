import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { updateSearchParams } from "@/ustils";

type FilterFormData = {
  search: string;
  status: string;
};

export const useStudentFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "active",
    },
  });

  const searchValue = form.watch("search");
  const statusValue = form.watch("status");

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("search", searchValue, searchParams, setSearchParams);
  }, [searchValue]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("status", statusValue, searchParams, setSearchParams);
  }, [statusValue]);

  const clearFilters = () => {
    form.reset({ search: "", status: "active" });
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return { form, clearFilters };
};
