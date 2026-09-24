import { Plus, SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import {
  ControlledInput,
  ControlledSelect,
  type IOption,
} from "@/components/controls";
import { Form } from "@/components/ui/form";
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
  const currentTab = form.watch("status");
  const { data: roles } = useRoles();

  const roleOptions: IOption[] = [
    { value: ALL_VALUE, label: t("employees.filter.allRoles") },
    ...(roles?.data
      ?.filter((item) => item.name !== ROLES.STUDENT)
      ?.map((r) => ({ value: r.id, label: r.displayName })) ?? []),
  ];

  return (
    <Form {...form}>
      <div className="w-full space-y-3 py-4">
        <div className="flex items-center justify-between">
          <DashboardTitle title={t("employees.title")} />
          <Button
            onClick={onAdd}
            className="bg-linear-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg px-4 h-9 gap-2 shadow-sm duration-200"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">{t("employees.addEmployee")}</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs
            value={currentTab}
            onValueChange={(value) => form.setValue("status", value)}
            defaultValue="active"
            className="bg-muted/50 p-1 rounded-lg border border-border"
          >
            <TabsList className="bg-transparent border-none gap-1 h-8">
              <TabsTrigger
                value="active"
                className="rounded-md px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
              >
                {t("employees.filter.active")}
              </TabsTrigger>
              <TabsTrigger
                value="archive"
                className="rounded-md px-4 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
              >
                {t("employees.filter.archive")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <div className="w-44">
              <ControlledSelect
                control={form.control}
                name="roleId"
                options={roleOptions}
                placeholder={t("employees.filter.rolePlaceholder")}
              />
            </div>

            <div className="relative">
              <SearchIcon className="absolute z-2 left-2.5 top-1/2 -translate-y-1/2 text-primary/40 dark:text-gray-600" />
              <ControlledInput
                control={form.control}
                placeholder={t("employees.filter.searchPlaceholder")}
                name="search"
                inputClassName="pl-7 rounded-lg h-10 border border-gray-300 min-w-75"
              />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
