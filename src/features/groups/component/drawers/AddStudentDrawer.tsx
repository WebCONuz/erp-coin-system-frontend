// features/groups/components/AddStudentDrawer.tsx

import { useState, useMemo } from "react";
import { Search, X, Users, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { GroupDetail } from "../../types";
import { useAddStudent, useBulkAddStudents } from "../../hooks";
import { useStudents } from "@/features/students/hooks";

interface AddStudentDrawerProps {
  open: boolean;
  onClose: () => void;
  group: GroupDetail;
}

export const AddStudentDrawer = ({
  open,
  onClose,
  group,
}: AddStudentDrawerProps) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  const { data: studentsData, isLoading } = useStudents();
  const addStudent = useAddStudent(group.id);
  const bulkAddStudents = useBulkAddStudents(group.id);

  // Guruhda allaqachon bor studentlar ID lari
  const existingStudentIds = useMemo(
    () => new Set(group.students.map((s) => s.student.id)),
    [group.students],
  );

  // Guruhda yo'q studentlar filtrlangan
  const availableStudents = useMemo(() => {
    const all = studentsData?.data ?? [];
    return all.filter((s) => !existingStudentIds.has(s.id));
  }, [studentsData, existingStudentIds]);

  // Qidiruv filtri
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return availableStudents;
    const q = search.toLowerCase();
    return availableStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)),
    );
  }, [availableStudents, search]);

  const handleClose = () => {
    setSearch("");
    setSelectedIds([]);
    setActiveTab("single");
    onClose();
  };

  // --- Single add ---
  const handleSingleAdd = (studentId: string) => {
    addStudent.mutate({ studentId }, { onSuccess: handleClose });
  };

  // --- Bulk add ---
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleBulkAdd = () => {
    if (selectedIds.length === 0) return;
    bulkAddStudents.mutate(
      { studentIds: selectedIds },
      { onSuccess: handleClose },
    );
  };

  const isPending = addStudent.isPending || bulkAddStudents.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-110 p-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <SheetTitle className="text-zinc-900 dark:text-zinc-50">
            Student qo'shish
          </SheetTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {group.name} guruhiga o'quvchi qo'shish
          </p>
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as "single" | "bulk");
            setSelectedIds([]);
            setSearch("");
          }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="px-6 pt-4">
            <TabsList className="w-full bg-zinc-100 dark:bg-zinc-800">
              <TabsTrigger
                value="single"
                className="flex-1 gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 text-zinc-600 dark:text-zinc-400 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50"
              >
                <User className="w-4 h-4" />
                Bitta
              </TabsTrigger>
              <TabsTrigger
                value="bulk"
                className="flex-1 gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 text-zinc-600 dark:text-zinc-400 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50"
              >
                <Users className="w-4 h-4" />
                Ko'p
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Qidiruv */}
          <div className="px-6 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Ism, telefon yoki email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Single tab */}
          <TabsContent value="single" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-6">
              {isLoading ? (
                <StudentListSkeleton />
              ) : filteredStudents.length === 0 ? (
                <EmptyState search={search} />
              ) : (
                <div className="space-y-2 pb-6">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {student.fullName}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {student.phone}
                        </p>
                        {student.email && (
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                            {student.email}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSingleAdd(student.id)}
                        disabled={isPending}
                        className="ml-3 shrink-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs"
                      >
                        Qo'shish
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Bulk tab */}
          <TabsContent
            value="bulk"
            className="flex-1 overflow-hidden mt-0 flex flex-col"
          >
            <ScrollArea className="flex-1 px-6">
              {isLoading ? (
                <StudentListSkeleton />
              ) : filteredStudents.length === 0 ? (
                <EmptyState search={search} />
              ) : (
                <div className="space-y-2 pb-4">
                  {filteredStudents.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedIds.includes(student.id)}
                        onCheckedChange={() => toggleSelect(student.id)}
                        className="border-zinc-300 dark:border-zinc-600"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {student.fullName}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {student.phone}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Bulk footer */}
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Tanlangan:
                </span>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                >
                  {selectedIds.length} ta
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                  className="flex-1 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Bekor
                </Button>
                <Button
                  onClick={handleBulkAdd}
                  disabled={selectedIds.length === 0 || isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                >
                  {isPending
                    ? "Qo'shilmoqda..."
                    : `${selectedIds.length} ta qo'shish`}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

const StudentListSkeleton = () => (
  <div className="space-y-2 py-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse"
      />
    ))}
  </div>
);

const EmptyState = ({ search }: { search: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Users className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-3" />
    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
      {search ? "Hech narsa topilmadi" : "Qo'shish uchun student yo'q"}
    </p>
    {search && (
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
        "{search}" bo'yicha natija topilmadi
      </p>
    )}
  </div>
);
