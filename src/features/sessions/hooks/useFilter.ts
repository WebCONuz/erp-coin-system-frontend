import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { updateSearchParams } from "@/ustils";
import { ALL_VALUE } from "../constants";

type FilterFormData = {
  groupId: string;
  teacherId: string;
  sessionType: string;
  date: string;
};

export const useFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      groupId: searchParams.get("groupId") || ALL_VALUE,
      teacherId: searchParams.get("teacherId") || ALL_VALUE,
      sessionType: searchParams.get("sessionType") || ALL_VALUE,
      date: searchParams.get("date") || "",
    },
  });

  const groupId = form.watch("groupId");
  const teacherId = form.watch("teacherId");
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
  }, [groupId]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams(
      "teacherId",
      teacherId === ALL_VALUE ? undefined : teacherId,
      searchParams,
      setSearchParams,
    );
  }, [teacherId]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams(
      "sessionType",
      sessionType === ALL_VALUE ? undefined : sessionType,
      searchParams,
      setSearchParams,
    );
  }, [sessionType]);

  useEffect(() => {
    searchParams.delete("page");
    updateSearchParams("date", date || undefined, searchParams, setSearchParams);
  }, [date]);

  return {
    form,
  };
};
