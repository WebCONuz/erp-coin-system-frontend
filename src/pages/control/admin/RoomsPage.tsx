import { translateApiError } from "@/ustils";
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
import { useSearchParams } from "react-router-dom";
import { DoorOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardGrid } from "@/components/shared/card-grid";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";

const RoomsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { data: rooms, isLoading, isError, refetch, isFetching } = useRooms();
  const isFiltered =
    !!searchParams.get("search") || searchParams.get("status") === "archive";
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
      onError: (error: unknown) =>
        toast.error(translateApiError(error, t)),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <RoomDataFilter onAdd={handleCreate} />

      <CardGrid
        items={rooms?.data}
        getKey={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        isFiltered={isFiltered}
        skeletonClassName="h-28"
        emptyIcon={DoorOpen}
        emptyTitle={t("rooms.noData")}
        emptyHint={t("rooms.emptyHint")}
        emptyAction={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="size-4" aria-hidden />
            {t("rooms.addRoom")}
          </Button>
        }
        renderItem={(item) => (
          <RoomCard data={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      />

      {!!rooms?.meta.total && (
        <TablePagination
          totalItems={rooms.meta.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
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
