import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { ControlledSearch, ListToolbar } from "@/components/shared/toolbar";
import { useFilter } from "../hooks";

interface Props {
  onAdd: () => void;
}

export const RoomDataFilter = ({ onAdd }: Props) => {
  const { t } = useTranslation();
  const { form } = useFilter();

  return (
    <Form {...form}>
      <ListToolbar
        title={t("rooms.title")}
        titleAs="h2"
        addLabel={t("rooms.addRoom")}
        onAdd={onAdd}
        tabs={[
          { value: "active", label: t("rooms.activeTab") },
          { value: "archive", label: t("rooms.inactiveTab") },
        ]}
        tab={form.watch("status") || "active"}
        onTabChange={(value) => form.setValue("status", value)}
      >
        <ControlledSearch
          control={form.control}
          name="search"
          placeholder={t("rooms.searchPlaceholder")}
        />
      </ListToolbar>
    </Form>
  );
};
