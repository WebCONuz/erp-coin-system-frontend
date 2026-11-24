import { NoData } from "@/components/partials/no-data";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  btnText: string;
  btnFn?: () => void;
  hasAction?: boolean;
}

export const NoDataBox = ({
  title,
  btnText,
  btnFn,
  hasAction = true,
}: Props) => {
  return (
    <NoData text={title}>
      {hasAction && <Button onClick={btnFn}>{btnText}</Button>}
    </NoData>
  );
};
