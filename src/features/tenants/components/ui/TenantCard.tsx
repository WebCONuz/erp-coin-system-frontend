import { formatDate } from "@/ustils/format-date";
import type { TenentType } from "../../types";

export const TenantCard = ({ data }: { data: TenentType }) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm flex items-center justify-between cursor-pointer">
      <div>
        <h3 className="text-2xl font-semibold">{data?.name}</h3>
        <p className="text-sm text-muted-foreground">
          Yaratilgan vaqti: {formatDate(data?.createdAt)}
        </p>
        <div className="flex gap-x-4 mt-4 items-center">
          <div className="flex items-center gap-x-2">
            <span>O'quvchilar soni:</span>
            <div className="text-green-600 font-medium rounded-md">
              {data?._count?.users || 0} ta
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <span>Guruhlar soni:</span>
            <div className="text-primary font-medium rounded-md">
              {data?._count?.groups || 0} ta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
