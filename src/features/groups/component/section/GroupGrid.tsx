import { useTranslation } from "react-i18next";
import { GroupCard } from "../ui";
import { useGroups } from "../../hooks";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import type { GroupItem } from "../../types";

interface Props {
  handleEdit: (group: GroupItem) => void;
}

export const GroupGrid = ({ handleEdit }: Props) => {
  const { data: groups, isLoading } = useGroups();
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
              btnFn={() => console.log("create")}
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
