import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/controls";
import type { StudentDetail, StudentDetailFull } from "../../types";
import { useCreateEditStudent } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  student?: StudentDetail | StudentDetailFull;
}

export const StudentFormModal = ({
  open,
  onClose,
  mode,
  student,
}: Props) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const { isPending, onSubmitCreate, onSubmitEdit, createForm, editForm } =
    useCreateEditStudent({
      open,
      isEdit,
      onClose,
      student,
    });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit
              ? t("students.form.editTitle")
              : t("students.form.createTitle")}
          </DialogTitle>
        </DialogHeader>

        {isEdit ? (
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onSubmitEdit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={editForm.control}
                  name="fullName"
                  label={t("students.form.fullNameLabel")}
                  placeholder={t("students.form.fullNamePlaceholder")}
                />
                <ControlledInput
                  control={editForm.control}
                  name="phone"
                  label={t("students.form.phoneLabel")}
                  placeholder="+998901234567"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={editForm.control}
                  name="email"
                  label={t("students.form.emailLabel")}
                  placeholder="sardor@example.com"
                  type="email"
                />
                <ControlledInput
                  control={editForm.control}
                  name="parentPhone"
                  label={t("students.form.parentPhoneLabel")}
                  placeholder="+998901234567"
                />
              </div>

              <ControlledInput
                control={editForm.control}
                name="avatarUrl"
                label={t("students.form.avatarUrlLabel")}
                placeholder="https://example.com/avatar.jpg"
              />

              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPending ? t("common.saving") : t("common.save")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onSubmitCreate)}
              className="space-y-4"
            >
              <ControlledInput
                control={createForm.control}
                name="fullName"
                label={t("students.form.fullNameLabel")}
                placeholder={t("students.form.fullNamePlaceholder")}
              />
              <ControlledInput
                control={createForm.control}
                name="phone"
                label={t("students.form.phoneLabel")}
                placeholder="+998901234567"
              />
              <ControlledInput
                control={createForm.control}
                name="password"
                label={t("students.form.passwordLabel")}
                placeholder={t("students.form.passwordPlaceholder")}
                type="password"
              />
              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={createForm.control}
                  name="email"
                  label={t("students.form.emailLabel")}
                  placeholder="ali@gmail.com"
                  type="email"
                />
                <ControlledInput
                  control={createForm.control}
                  name="parentPhone"
                  label={t("students.form.parentPhoneLabel")}
                  placeholder="+998901234568"
                />
              </div>

              <ControlledInput
                control={createForm.control}
                name="avatarUrl"
                label={t("students.form.avatarUrlLabel")}
                placeholder="https://example.com/avatar.jpg"
              />

              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPending ? t("common.adding") : t("common.add")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
