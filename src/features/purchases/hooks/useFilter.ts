import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { updateSearchParams } from "@/ustils";

export const ALL_PURCHASES = "all";

type FilterFormData = {
  status: string;
};

export const useFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      status: searchParams.get("status") || ALL_PURCHASES,
    },
  });

  const statusValue = form.watch("status");

  // Dashboard banneridan ?status=... bilan kelinganda formani sinxronlaymiz.
  const statusFromUrl = searchParams.get("status") || ALL_PURCHASES;
  useEffect(() => {
    if (statusFromUrl !== form.getValues("status")) {
      form.setValue("status", statusFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFromUrl]);

  useEffect(() => {
    if (statusValue === statusFromUrl) return;
    searchParams.delete("page");
    updateSearchParams(
      "status",
      statusValue === ALL_PURCHASES ? undefined : statusValue,
      searchParams,
      setSearchParams,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusValue]);

  return {
    form,
  };
};
