import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useSyncFiltersToUrl } from "@/hooks";
import { ALL_VALUE } from "../constants";

type FilterFormData = {
  groupId: string;
  teacherId: string;
  sessionType: string;
  date: string;
  isChecked: string;
};

export const useFilter = () => {
  const [searchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      groupId: searchParams.get("groupId") || ALL_VALUE,
      teacherId: searchParams.get("teacherId") || ALL_VALUE,
      sessionType: searchParams.get("sessionType") || ALL_VALUE,
      date: searchParams.get("date") || "",
      isChecked: searchParams.get("isChecked") || ALL_VALUE,
    },
  });

  const [groupId, teacherId, sessionType, date, isChecked] = useWatch({
    control: form.control,
    name: ["groupId", "teacherId", "sessionType", "date", "isChecked"],
  });

  // isChecked is only meaningful for "lesson" type sessions.
  const isLesson = sessionType === "lesson";
  useEffect(() => {
    if (!isLesson && form.getValues("isChecked") !== ALL_VALUE) {
      form.setValue("isChecked", ALL_VALUE);
    }
  }, [isLesson, form]);

  const toParam = (value: string) => (value === ALL_VALUE ? null : value);
  useSyncFiltersToUrl({
    groupId: toParam(groupId),
    teacherId: toParam(teacherId),
    date,
    sessionType: toParam(sessionType),
    isChecked: isLesson ? toParam(isChecked) : null,
  });

  return {
    form,
  };
};
