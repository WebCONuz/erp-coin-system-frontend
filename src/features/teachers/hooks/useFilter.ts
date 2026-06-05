import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { updateSearchParams } from "@/ustils";

type FilterFormData = {
  search: string;
  status: string;
};

export const useFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "",
    },
  });

  // Watch individual form values and update URL when they change
  const searchValue = form.watch("search");
  const statusValue = form.watch("status");

  // Update URL for search field
  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("search", searchValue, searchParams, setSearchParams);
  }, [searchValue]);

  // Update URL for status field
  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("status", statusValue, searchParams, setSearchParams);
  }, [statusValue]);

  return {
    form,
  };
};
