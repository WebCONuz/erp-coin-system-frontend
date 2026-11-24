import { GroupFormModal } from "@/features/groups/components/modals";
import {
  GroupCategory,
  GroupGrid,
  HeaderFilter,
} from "@/features/groups/components/section";
import type { GroupItem } from "@/features/groups/types";
import { useState } from "react";

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);

  const handleCreate = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEdit = (group: GroupItem) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <HeaderFilter handleCreate={handleCreate} />

        {/* lg+: chapda kurslar paneli; kichik ekranlarda kurs chip'lari tepada */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-5">
          <div className="min-w-0 lg:sticky lg:top-0">
            <GroupCategory />
          </div>
          <GroupGrid handleEdit={handleEdit} handleCreate={handleCreate} />
        </div>
      </div>

      <GroupFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingGroup ? "edit" : "create"}
        group={editingGroup ?? undefined}
      />
    </>
  );
};

export default Groups;
