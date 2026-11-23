import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { ALL_VALUE } from "../constants";

type FilterFormData = {
  actionType: string;
  entityType: string;
  fromDate: string;
  toDate: string;
};

const FILTER_KEYS: (keyof FilterFormData)[] = [
  "actionType",
  "entityType",
  "fromDate",
  "toDate",
];

export const useFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      actionType: searchParams.get("actionType") || ALL_VALUE,
      entityType: searchParams.get("entityType") || ALL_VALUE,
      fromDate: searchParams.get("fromDate") || "",
      toDate: searchParams.get("toDate") || "",
    },
  });

  const [actionType, entityType, fromDate, toDate] = form.watch(FILTER_KEYS);

  // Hammasi bitta `setSearchParams` chaqiruvida — alohida effect'lar bir-birining
  // o'zgarishini ustidan yozib yuboradi (render snapshot'i bir xil).
  useEffect(() => {
    const values: FilterFormData = { actionType, entityType, fromDate, toDate };
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        let changed = false;
        FILTER_KEYS.forEach((key) => {
          const value =
            values[key] && values[key] !== ALL_VALUE ? values[key] : null;
          if ((next.get(key) ?? null) === value) return;
          changed = true;
          if (value) next.set(key, value);
          else next.delete(key);
        });
        if (changed) next.delete("page");
        return next;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionType, entityType, fromDate, toDate]);

  const hasActiveFilters =
    actionType !== ALL_VALUE ||
    entityType !== ALL_VALUE ||
    !!fromDate ||
    !!toDate;

  const reset = () =>
    form.reset({
      actionType: ALL_VALUE,
      entityType: ALL_VALUE,
      fromDate: "",
      toDate: "",
    });

  return { form, hasActiveFilters, reset };
};
