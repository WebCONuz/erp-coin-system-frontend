import { useTranslation } from "react-i18next";
import { OptionSelect } from "@/components/ui/option-select";

type Props = {
  value?: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
};

export const ClassSelect = ({ value, onChange, options }: Props) => {
  const { t } = useTranslation();

  return (
    <OptionSelect
      value={value}
      onValueChange={onChange}
      options={options}
      placeholder={t("dashboard.classSelectPlaceholder")}
      className="w-50"
    />
  );
};
