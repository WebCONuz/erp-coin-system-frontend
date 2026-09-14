import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  RoomDataFilter,
  RoomCard,
  RoomFormModal,
} from "@/features/rooms/components";
import { useRooms, useDeleteRoom } from "@/features/rooms/hooks";
import type { Room } from "@/features/rooms/types";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";

const RoomsPage = () => {
  const { t } = useTranslation();
  const { data: rooms, isLoading } = useRooms();
  const pagination = usePagination({ totalItems: rooms?.meta?.total || 0 });

  const deleteRoom = useDeleteRoom();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleCreate = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleDelete = (room: Room) => {
    if (!window.confirm(t("rooms.deleteConfirm", { name: room.name })))
      return;

    deleteRoom.mutate(room.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  return (
    <div className="space-y-4">
      <RoomDataFilter onAdd={handleCreate} />

      {isLoading ? (
        <PageLoading />
      ) : rooms?.data ? (
        <>
          {rooms.data.length === 0 ? (
            <NoDataBox
              title={t("rooms.noData")}
              btnText={t("rooms.addRoom")}
              btnFn={handleCreate}
              hasAction={false}
            />
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {rooms.data.map((item) => (
                <RoomCard
                  data={item}
                  key={item.id}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {rooms.meta.total > 0 && (
            <TablePagination
              totalItems={rooms.meta.total}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
            />
          )}
        </>
      ) : (
        <NoData text={t("common.noData")} />
      )}

      <RoomFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingRoom ? "edit" : "create"}
        room={editingRoom ?? undefined}
      />
    </div>
  );
};

export default RoomsPage;
