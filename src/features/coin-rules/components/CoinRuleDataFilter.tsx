import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { ControlledSearch, ListToolbar } from "@/components/shared/toolbar";
import { useFilter } from "../hooks";

interface Props {
  onAdd: () => void;
  /** Sozlamalar ichida — `h2`; teacher sahifasida o'z sahifasi — `h1`. */
  titleAs?: "h1" | "h2";
}

export const CoinRuleDataFilter = ({ onAdd, titleAs = "h2" }: Props) => {
  const { t } = useTranslation();
  const { form } = useFilter();

  return (
    <Form {...form}>
      <ListToolbar
        title={t("reasons.title")}
        titleAs={titleAs}
        addLabel={t("reasons.addReason")}
        onAdd={onAdd}
        tabs={[
          { value: "all", label: t("common.all") },
          { value: "earn", label: t("reasons.rewardsTab") },
          { value: "deduct", label: t("reasons.penaltiesTab") },
        ]}
        tab={form.watch("direction") || "all"}
        onTabChange={(value) => form.setValue("direction", value)}
      >
        <ControlledSearch
          control={form.control}
          name="search"
          placeholder={t("reasons.searchPlaceholder")}
        />
      </ListToolbar>
    </Form>
  );
};
