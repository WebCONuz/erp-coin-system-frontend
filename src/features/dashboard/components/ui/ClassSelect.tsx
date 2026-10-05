import { OptionSelect } from "@/components/ui/option-select";

type Props = {
  value?: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
};

export const ClassSelect = ({ value, onChange, options }: Props) => {
  return (
    <OptionSelect
      value={value}
      onValueChange={onChange}
      options={options}
      placeholder="Sinf tanlang"
      className="w-50"
    />
  );
};
