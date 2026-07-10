import { useTranslation } from "react-i18next";
import { GroupCard } from "../ui";
import { useGroups } from "../../hooks";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import type { GroupItem } from "../../types";
import { useSearchParams } from "react-router-dom";

interface Props {
  handleEdit: (group: GroupItem) => void;
  handleCreate: () => void;
}

export const GroupGrid = ({ handleEdit, handleCreate }: Props) => {
  const [searchParams] = useSearchParams();
  const { data: groups, isLoading } = useGroups({
    courseId:
      searchParams.get("course") == "all"
        ? undefined
        : searchParams.get("course") || undefined,
    search: searchParams.get("search") || undefined,
    isActive:
      searchParams.get("status") === "active"
        ? "true"
        : searchParams.get("status") === "archive"
          ? "false"
          : undefined,
  });
  const { t } = useTranslation();

  return (
    <>
      {isLoading ? (
        <PageLoading />
      ) : groups?.data ? (
        <>
          {groups.data.length === 0 ? (
            <NoDataBox
              title={t("groups.no_data")}
              btnText={t("groups.btn.create")}
              btnFn={() => handleCreate()}
            />
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {groups.data.map((item) => (
                <GroupCard key={item.id} data={item} handleEdit={handleEdit} />
              ))}
            </div>
          )}
        </>
      ) : (
        <NoData text={t("no_loading")} />
      )}
    </>
  );
};
