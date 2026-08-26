import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { ALL_VALUE } from "../constants";

type FilterFormData = {
  search: string;
  status: string;
  roleId: string;
};

export const useFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "active",
      roleId: searchParams.get("roleId") || ALL_VALUE,
    },
  });

  const searchValue = form.watch("search");
  const statusValue = form.watch("status");
  const roleIdValue = form.watch("roleId");

  // Bitta effektda barcha maydonlarni birgalikda yozamiz — alohida
  // effektlar bir xil (eski) searchParams asosida ketma-ket setSearchParams
  // chaqirsa, keyingisi avvalgisining yozgan qiymatini ustidan bosib
  // o'chirib yuboradi (masalan, "status" active bo'lib qolmaydi).
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("page");

    if (searchValue) newParams.set("search", searchValue);
    else newParams.delete("search");

    if (statusValue) newParams.set("status", statusValue);
    else newParams.delete("status");

    if (roleIdValue && roleIdValue !== ALL_VALUE) {
      newParams.set("roleId", roleIdValue);
    } else {
      newParams.delete("roleId");
    }

    setSearchParams(newParams, { replace: true });
  }, [searchValue, statusValue, roleIdValue]);

  return {
    form,
  };
};
