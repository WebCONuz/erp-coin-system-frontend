import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { updateSearchParams } from "@/ustils";
import { ALL_VALUE } from "@/features/sessions/constants";

type FilterFormData = {
  groupId: string;
  sessionType: string;
  date: string;
  isChecked: string;
};

export const useTeacherSessionsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      groupId: searchParams.get("groupId") || ALL_VALUE,
      sessionType: searchParams.get("sessionType") || ALL_VALUE,
      date: searchParams.get("date") || "",
      isChecked: searchParams.get("isChecked") || ALL_VALUE,
    },
  });

  const groupId = form.watch("groupId");
  const sessionType = form.watch("sessionType");
  const date = form.watch("date");
  const isChecked = form.watch("isChecked");

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
    updateSearchParams("date", date || undefined, searchParams, setSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // sessionType + isChecked are updated together in one effect/one
  // setSearchParams call: react-router's setSearchParams captures the
  // searchParams snapshot from render, so two effects both depending on
  // `sessionType` and calling setSearchParams separately would race and the
  // second call would silently overwrite the first's change.
  // isChecked is only meaningful for "lesson" type sessions.
  useEffect(() => {
    if (sessionType !== "lesson" && isChecked !== ALL_VALUE) {
      form.setValue("isChecked", ALL_VALUE);
      return;
    }

    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("page");

        if (sessionType === ALL_VALUE) {
          newParams.delete("sessionType");
        } else {
          newParams.set("sessionType", sessionType);
        }

        if (sessionType !== "lesson" || isChecked === ALL_VALUE) {
          newParams.delete("isChecked");
        } else {
          newParams.set("isChecked", isChecked);
        }

        return newParams;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionType, isChecked]);

  return { form };
};
