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
  const isEdit = mode === "edit";
  const { isPending, onSubmitCreate, onSubmitEdit, createForm, editForm } =
    useCreateEditEmployee({ open, isEdit, onClose, employee });

  const { data: roles, isLoading: isRolesLoading } = useRoles();
  const roleOptions =
    roles?.data.map((role) => ({
      value: role.id,
      label: role.displayName,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
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
                  label="F.I.Sh"
                  placeholder="Sardor Rahimov"
                />
                <ControlledInput
                  control={editForm.control}
                  name="phone"
                  label="Telefon raqam"
                  placeholder="+998901234567"
                />
              </div>

              <ControlledSelect
                control={editForm.control}
                name="roleId"
                label="Rol"
                options={roleOptions}
                isLoading={isRolesLoading}
                placeholder="Rolni tanlang"
              />

              <ControlledInput
                control={editForm.control}
                name="email"
                label="Email (ixtiyoriy)"
                placeholder="sardor@example.com"
                type="email"
              />

              <ControlledInput
                control={editForm.control}
                name="avatarUrl"
                label="Avatar URL (ixtiyoriy)"
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
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPending ? "Saqlanmoqda..." : "Saqlash"}
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
                label="F.I.Sh"
                placeholder="Sardor Rahimov"
              />
              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={createForm.control}
                  name="phone"
                  label="Telefon raqam"
                  placeholder="+998901234567"
                />
                <ControlledInput
                  control={createForm.control}
                  name="password"
                  label="Parol"
                  placeholder="Parol kiriting"
                  type="password"
                />
              </div>

              <ControlledSelect
                control={createForm.control}
                name="roleId"
                label="Rol"
                options={roleOptions}
                isLoading={isRolesLoading}
                placeholder="Rolni tanlang"
              />

              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={createForm.control}
                  name="email"
                  label="Email (ixtiyoriy)"
                  placeholder="ali@gmail.com"
                  type="email"
                />
                <ControlledInput
                  control={createForm.control}
                  name="parentPhone"
                  label="Yaqin kishi telefoni (ixtiyoriy)"
                  placeholder="+998901234568"
                />
              </div>

              <ControlledInput
                control={createForm.control}
                name="avatarUrl"
                label="Avatar URL (ixtiyoriy)"
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
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPending ? "Qo'shilmoqda..." : "Qo'shish"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
