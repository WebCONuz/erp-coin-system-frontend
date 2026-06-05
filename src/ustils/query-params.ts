import { format } from "date-fns";

export function updateSearchParams(
  key: string,
  value: string | undefined | null,
  searchParams: URLSearchParams,
  setSearchParams: (
    nextInit: URLSearchParams,
    options?: { replace?: boolean },
  ) => void,
) {
  const newParams = new URLSearchParams(searchParams);
  if (value) {
    newParams.set(key, value);
  } else {
    newParams.delete(key);
  }
  setSearchParams(newParams, { replace: true });
}

export function updateDateRangeParams(
  start: Date | null,
  end: Date | null,
  searchParams: URLSearchParams,
  setSearchParams: (
    nextInit: URLSearchParams,
    options?: { replace?: boolean },
  ) => void,
) {
  const newParams = new URLSearchParams(searchParams);

  if (start && end) {
    newParams.set("start_date", format(start, "yyyy-MM-dd"));
    newParams.set("end_date", format(end, "yyyy-MM-dd"));
  } else if (!start && !end) {
    newParams.delete("start_date");
    newParams.delete("end_date");
  }
  setSearchParams(newParams, { replace: true });
}
