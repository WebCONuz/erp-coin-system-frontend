import { NoData } from "@/components/partials/no-data";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  btnText: string;
  btnFn: () => void;
}

export const NoDataBox = ({ title, btnText, btnFn }: Props) => {
  return (
    <NoData text={title}>
      <Button onClick={btnFn} className="py-2 px-4 bg-primary text-white">
        {btnText}
      </Button>
    </NoData>
  );
};
