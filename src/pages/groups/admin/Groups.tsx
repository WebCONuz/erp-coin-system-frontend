import { GroupFormModal } from "@/features/groups/component/modals";
import {
  GroupCategory,
  GroupGrid,
  HeaderFilter,
} from "@/features/groups/component/section";
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
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1">
          <GroupCategory />
        </div>
        <div className="col-span-4 space-y-6">
          <HeaderFilter handleCreate={handleCreate} />
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
