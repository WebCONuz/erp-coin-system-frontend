import { useTranslation } from "react-i18next";
import { ControlledSelect, type IOption } from "@/components/controls";
import { Form } from "@/components/ui/form";
import { ControlledSearch, ListToolbar } from "@/components/shared/toolbar";
import { useRoles } from "@/features/roles/hooks";
import { ROLES } from "@/assets/constants";
import { useFilter } from "../hooks";
import { ALL_VALUE } from "../constants";

interface Props {
  onAdd: () => void;
}

export const EmployeeDataFilter = ({ onAdd }: Props) => {
  const { t } = useTranslation();
  const { form } = useFilter();
  const { data: roles } = useRoles();

  const roleOptions: IOption[] = [
    { value: ALL_VALUE, label: t("employees.filter.allRoles") },
    ...(roles?.data
      ?.filter((item) => item.name !== ROLES.STUDENT)
      ?.map((r) => ({ value: r.id, label: r.displayName })) ?? []),
  ];

  return (
    <Form {...form}>
      <ListToolbar
        title={t("employees.title")}
        titleAs="h2"
        addLabel={t("employees.addEmployee")}
        onAdd={onAdd}
        tabs={[
          { value: "active", label: t("employees.filter.active") },
          { value: "archive", label: t("employees.filter.archive") },
        ]}
        tab={form.watch("status") || "active"}
        onTabChange={(value) => form.setValue("status", value)}
      >
        <div className="w-full sm:w-44">
          <ControlledSelect
            control={form.control}
            name="roleId"
            options={roleOptions}
            placeholder={t("employees.filter.rolePlaceholder")}
            className="w-full py-4.5"
          />
        </div>
        <ControlledSearch
          control={form.control}
          name="search"
          placeholder={t("employees.filter.searchPlaceholder")}
        />
      </ListToolbar>
    </Form>
  );
};
