import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { updateSearchParams } from "@/ustils";

type FilterFormData = {
  search: string;
  direction: string;
};

export const useFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      direction: searchParams.get("direction") || "all",
    },
  });

  const searchValue = form.watch("search");
  const directionValue = form.watch("direction");

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("search", searchValue, searchParams, setSearchParams);
  }, [searchValue]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams(
      "direction",
      directionValue,
      searchParams,
      setSearchParams,
    );
  }, [directionValue]);

  return {
    form,
  };
};
