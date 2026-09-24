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
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { useRoles } from "@/features/roles/hooks";
import type { Employee } from "../../types";
import { useCreateEditEmployee } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  employee?: Employee;
}

export const EmployeeFormModal = ({ open, onClose, mode, employee }: Props) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const { isPending, onSubmitCreate, onSubmitEdit, createForm, editForm } =
    useCreateEditEmployee({ open, isEdit, onClose, employee });

  const { data: roles, isLoading: isRolesLoading } = useRoles();
  const roleOptions =
    roles?.data?.length && roles.data.length > 0
      ? roles.data
          .filter((item) => item.name !== "student")
          .map((role) => ({
            value: role.id,
            label: role.displayName,
          }))
      : [];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit
              ? t("employees.form.editTitle")
              : t("employees.form.createTitle")}
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
                  label={t("employees.form.fullNameLabel")}
                  placeholder={t("employees.form.fullNamePlaceholder")}
                />
                <ControlledInput
                  control={editForm.control}
                  name="phone"
                  label={t("common.phone")}
                  placeholder="+998901234567"
                />
              </div>

              <ControlledSelect
                control={editForm.control}
                name="roleId"
                label={t("employees.form.roleLabel")}
                options={roleOptions}
                isLoading={isRolesLoading}
                placeholder={t("employees.form.rolePlaceholder")}
              />

              <ControlledInput
                control={editForm.control}
                name="email"
                label={`${t("common.email")} ${t("common.optional")}`}
                placeholder="sardor@example.com"
                type="email"
              />

              <ControlledInput
                control={editForm.control}
                name="avatarUrl"
                label={`${t("employees.form.avatarUrlLabel")} ${t("common.optional")}`}
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
                label={t("employees.form.fullNameLabel")}
                placeholder={t("employees.form.fullNamePlaceholder")}
              />
              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={createForm.control}
                  name="phone"
                  label={t("common.phone")}
                  placeholder="+998901234567"
                />
                <ControlledInput
                  control={createForm.control}
                  name="password"
                  label={t("employees.form.passwordLabel")}
                  placeholder={t("employees.form.passwordPlaceholder")}
                  type="password"
                />
              </div>

              <ControlledSelect
                control={createForm.control}
                name="roleId"
                label={t("employees.form.roleLabel")}
                options={roleOptions}
                isLoading={isRolesLoading}
                placeholder={t("employees.form.rolePlaceholder")}
              />

              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={createForm.control}
                  name="email"
                  label={`${t("common.email")} ${t("common.optional")}`}
                  placeholder="ali@gmail.com"
                  type="email"
                />
                <ControlledInput
                  control={createForm.control}
                  name="parentPhone"
                  label={`${t("employees.form.parentPhoneLabel")} ${t("common.optional")}`}
                  placeholder="+998901234568"
                />
              </div>

              <ControlledInput
                control={createForm.control}
                name="avatarUrl"
                label={`${t("employees.form.avatarUrlLabel")} ${t("common.optional")}`}
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
