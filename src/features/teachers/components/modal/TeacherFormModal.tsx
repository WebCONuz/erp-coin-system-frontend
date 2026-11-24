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
import type { TeacherEditable } from "../../types";
import { useCreateEditTeacher } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  teacher?: TeacherEditable;
}

export const TeacherFormModal = ({ open, onClose, mode, teacher }: Props) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const { isPending, onSubmitCreate, onSubmitEdit, createForm, editForm } =
    useCreateEditTeacher({ open, isEdit, onClose, teacher });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isEdit
              ? t("teachers.form.editTitle")
              : t("teachers.form.createTitle")}
          </DialogTitle>
        </DialogHeader>

        {isEdit ? (
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onSubmitEdit)}
              className="space-y-4"
            >
              <ControlledInput
                control={editForm.control}
                name="username"
                label={t("username.label")}
                placeholder={t("username.placeholder")}
                autoCapitalize="none"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={editForm.control}
                  name="fullName"
                  label={t("students.form.fullNameLabel")}
                  placeholder={t("teachers.form.fullNamePlaceholder")}
                />
                <ControlledInput
                  control={editForm.control}
                  name="phone"
                  label={t("students.form.phoneLabel")}
                  placeholder="+998901234567"
                />
              </div>

              <ControlledInput
                control={editForm.control}
                name="email"
                label={t("students.form.emailLabel")}
                placeholder="alisher@example.com"
                type="email"
              />

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
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
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
                placeholder={t("teachers.form.fullNamePlaceholder")}
              />
              <ControlledInput
                control={createForm.control}
                name="username"
                label={t("username.label")}
                placeholder={t("username.placeholder")}
                autoCapitalize="none"
                required
              />

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <ControlledInput
                control={createForm.control}
                name="email"
                label={t("students.form.emailLabel")}
                placeholder="alisher@example.com"
                type="email"
              />

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
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
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
