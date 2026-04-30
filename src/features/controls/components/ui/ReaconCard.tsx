import { Pencil, Trash } from "lucide-react";
import type { CoinReason } from "../../models";

interface Props {
  data: CoinReason;
}

export const ReaconCard = ({ data }: Props) => {
  return (
    <div
      className={`${
        data.isPlus ? "bg-green-500/10" : "bg-red-500/10"
      } rounded-xl p-4 relative`}
    >
      <div className="absolute top-4 right-5 flex gap-x-2.5">
        <Pencil
          size="17"
          className="text-green-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
        />
        <Trash
          size="17"
          className="text-red-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
        />
      </div>

      <h4 className="font-medium leading-5 mb-2">{data.title}</h4>
      <div className="flex gap-x-1 items-center">
        <img src="/logo.png" alt="avatar" className="w-4 h-4" />
        <p
          className={`${
            data.isPlus ? "text-green-500" : "text-red-500"
          } leading-0 font-semibold`}
        >
          {data.isPlus ? `+${data.count}` : `-${data.count}`}
        </p>
      </div>
    </div>
  );
};
