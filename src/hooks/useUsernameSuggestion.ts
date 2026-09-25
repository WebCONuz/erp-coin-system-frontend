import { useEffect } from "react";
import type { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { suggestUsername } from "@/ustils/username";

// Formadagi `fullName` o'zgarganda `username` ni avtomatik taklif qiladi.
// Foydalanuvchi username'ni qo'lda o'zgartirsa (isDirty), taklif to'xtaydi.
export const useUsernameSuggestion = <
  T extends FieldValues & { fullName: string; username: string },
>(
  form: UseFormReturn<T>,
  enabled: boolean = true,
) => {
  const fullName = form.watch("fullName" as Path<T>);

  useEffect(() => {
    if (!enabled) return;
    if (form.getFieldState("username" as Path<T>).isDirty) return;

    form.setValue(
      "username" as Path<T>,
      suggestUsername(fullName ?? "") as PathValue<T, Path<T>>,
    );
  }, [fullName, enabled, form]);
};
