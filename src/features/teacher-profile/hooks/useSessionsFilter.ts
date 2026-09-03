import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { updateSearchParams } from "@/ustils";
import { ALL_VALUE } from "@/features/sessions/constants";

type FilterFormData = {
  groupId: string;
  sessionType: string;
  date: string;
};

export const useTeacherSessionsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      groupId: searchParams.get("groupId") || ALL_VALUE,
      sessionType: searchParams.get("sessionType") || ALL_VALUE,
      date: searchParams.get("date") || "",
    },
  });

  const groupId = form.watch("groupId");
  const sessionType = form.watch("sessionType");
  const date = form.watch("date");

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams(
      "groupId",
      groupId === ALL_VALUE ? undefined : groupId,
      searchParams,
      setSearchParams,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams(
      "sessionType",
      sessionType === ALL_VALUE ? undefined : sessionType,
      searchParams,
      setSearchParams,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionType]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("date", date || undefined, searchParams, setSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return { form };
};
