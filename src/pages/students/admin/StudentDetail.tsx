import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Coins,
  Users,
  Gift,
  ShieldCheck,
  Pencil,
  PowerOff,
  Power,
  Plus,
  Minus,
  Lock,
  BookOpen,
  Trash2,
  UserPlus,
  MessageSquare,
  AlertTriangle,
  Archive,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/ustils";
import { StudentFormModal, SendMessageModal } from "@/features/students/components";
import {
  useStudentById,
  useDeactivateStudent,
  useChangeStudentPassword,
  useManualCoinTransaction,
  useRemoveStudentFromGroup,
} from "@/features/students/hooks";

// ─── ConfirmModal ───────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  isPending?: boolean;
}

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Tasdiqlash",
  variant = "danger",
  isPending = false,
}: ConfirmModalProps) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="sm:max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <DialogHeader>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1 ${variant === "danger" ? "bg-red-100 dark:bg-red-950/50" : "bg-amber-100 dark:bg-amber-950/50"}`}>
          <AlertTriangle size={22} className={variant === "danger" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"} />
        </div>
        <DialogTitle className="text-zinc-900 dark:text-zinc-50">{title}</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 -mt-2">{description}</p>
      <DialogFooter className="gap-2 mt-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isPending}
          className="border-zinc-300 dark:border-zinc-700"
        >
          Bekor qilish
        </Button>
        <Button
          disabled={isPending}
          onClick={onConfirm}
          className={variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"}
        >
          {isPending ? "..." : confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ─── Skeleton ───────────────────────────────────────────────────────────────────
const StudentDetailSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
    <div className="h-36 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
      ))}
    </div>
    <div className="h-80 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
  </div>
);

// ─── StatCard ───────────────────────────────────────────────────────────────────
const StatCard = ({
  icon,
  label,
  value,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
}) => (
  <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
    <CardContent className="flex items-center gap-4 p-5">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{value}</p>
      </div>
    </CardContent>
  </Card>
);

// ─── CoinActionForm ──────────────────────────────────────────────────────────────
const CoinActionForm = ({ type }: { type: "add" | "subtract" }) => {
  const isAdd = type === "add";
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${isAdd ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30" : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30"}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isAdd ? "bg-green-100 dark:bg-green-900 text-green-600" : "bg-red-100 dark:bg-red-900 text-red-600"}`}>
        {isAdd ? <Plus size={16} /> : <Minus size={16} />}
      </div>
      <input
        type="number"
        min={1}
        placeholder="Miqdor..."
        className="flex-1 bg-transparent border-0 outline-none text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400"
      />
      <input
        type="text"
        placeholder="Sabab (ixtiyoriy)"
        className="flex-1 bg-transparent border-0 outline-none text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 border-l border-zinc-200 dark:border-zinc-700 pl-3"
      />
      <Button
        size="sm"
        className={isAdd ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
        onClick={() => {}}
      >
        {isAdd ? "Qo'shish" : "Ayirish"}
      </Button>
    </div>
  );
};

// ─── Coin action form state ───────────────────────────────────────────────────
interface CoinFormState { amount: string; note: string }

// ─── Main Page ──────────────────────────────────────────────────────────────────
const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: student, isLoading, isError } = useStudentById(id ?? "");
  const deactivate = useDeactivateStudent(id ?? "");
  const changePassword = useChangeStudentPassword(id ?? "");
  const manualCoin = useManualCoinTransaction(id ?? "");
  const removeFromGroup = useRemoveStudentFromGroup(id ?? "");

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);

  // Confirm modal state
  type ConfirmAction = "archive" | "delete" | "restore" | null;
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  // Coin form state
  const [coinForm, setCoinForm] = useState<CoinFormState>({ amount: "", note: "" });

  // Change password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const handleConfirm = () => {
    if (!id) return;
    if (confirmAction === "archive") deactivate.mutate({ isActive: false }, { onSuccess: () => setConfirmAction(null) });
    else if (confirmAction === "restore") deactivate.mutate({ isActive: true }, { onSuccess: () => setConfirmAction(null) });
    else if (confirmAction === "delete") deactivate.mutate({ isDeleted: true }, { onSuccess: () => setConfirmAction(null) });
  };

  const handleCoinAction = (direction: "earn" | "deduct") => {
    const amount = Number(coinForm.amount);
    if (!amount || amount < 1 || !id) return;
    manualCoin.mutate(
      { studentId: id, amount, direction, sourceType: "manual", note: coinForm.note || undefined },
      { onSuccess: () => setCoinForm({ amount: "", note: "" }) },
    );
  };

  if (isLoading) return <StudentDetailSkeleton />;
  if (isError || !student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-zinc-500 dark:text-zinc-400">Talaba ma'lumotlari topilmadi</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Orqaga</Button>
      </div>
    );
  }

  const isActive = student.isActive;
  const isDeleted = student.isDeleted;
  const avatarLetter = student.fullName.charAt(0).toUpperCase();

  const statusBadge = isDeleted
    ? { label: "O'chirilgan", cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" }
    : isActive
      ? { label: "Faol", cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" }
      : { label: "Arxivlangan", cls: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" };

  // Confirm modal content per action
  const confirmContent: Record<NonNullable<ConfirmAction>, { title: string; description: string; label: string; variant: "danger" | "warning" }> = {
    archive: {
      title: "Talabani arxivlash",
      description: `"${student.fullName}" ni arxivlaysizmi? Bu talabaning faoliyati to'xtatiladi, lekin ma'lumotlari saqlanib qoladi. Keyinchalik qayta faollashtirishingiz mumkin.`,
      label: "Ha, arxivlash",
      variant: "warning",
    },
    restore: {
      title: "Talabani faollashtirish",
      description: `"${student.fullName}" ni qayta faollashtirasizmi? Talaba tizimga kirish huquqini qaytarib oladi.`,
      label: "Ha, faollashtirish",
      variant: "warning",
    },
    delete: {
      title: "Talabani o'chirish",
      description: `"${student.fullName}" ni o'chirmoqchimisiz? Bu amal talabani tizimdan butunlay olib tashlaydi (soft delete). Qayta tiklash faqat administrator tomonidan amalga oshirilishi mumkin.`,
      label: "Ha, o'chirish",
      variant: "danger",
    },
  };

  return (
    <div className="space-y-6">
      {/* ── Back ── */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 -ml-2"
      >
        <ArrowLeft className="w-4 h-4" />
        O'quvchilar
      </Button>

      {/* ── Header card ── */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-2xl border bg-white dark:bg-zinc-900 ${isDeleted ? "border-red-200 dark:border-red-900/60" : "border-zinc-200 dark:border-zinc-800"}`}>
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-md">
          {avatarLetter}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 truncate">{student.fullName}</h1>
            <Badge className={`border-0 ${statusBadge.cls}`}>{statusBadge.label}</Badge>
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border-0 capitalize">
              {student.role.displayName}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5"><Phone size={13} />{student.phone}</span>
            {student.email && <span className="flex items-center gap-1.5"><Mail size={13} />{student.email}</span>}
            {student.parentPhone && (
              <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400">
                <PhoneCall size={13} />Ota-ona: {student.parentPhone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDate(student.createdAt, "dd.MM.yyyy")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isDeleted && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
              onClick={() => setIsMsgOpen(true)}
            >
              <MessageSquare size={14} />
              Xabar
            </Button>
          )}
          {!isDeleted && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-zinc-300 dark:border-zinc-700"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil size={14} />
              Tahrirlash
            </Button>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Coins size={20} className="text-amber-600" />} label="Coin balansi" value={student.wallet?.balance ?? 0} iconBg="bg-amber-100 dark:bg-amber-900/40" />
        <StatCard icon={<Users size={20} className="text-blue-600" />} label="Guruhlar soni" value={student.groups?.length ?? 0} iconBg="bg-blue-100 dark:bg-blue-900/40" />
        <StatCard icon={<Gift size={20} className="text-pink-600" />} label="Sotib olingan" value={student.stats?.totalPurchases ?? 0} iconBg="bg-pink-100 dark:bg-pink-900/40" />
        <StatCard icon={<BookOpen size={20} className="text-green-600" />} label="Davomat" value={`${student.stats?.presentCount ?? 0}/${student.stats?.totalSessions ?? 0}`} iconBg="bg-green-100 dark:bg-green-900/40" />
      </div>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl h-auto flex-wrap gap-1">
          {[
            { value: "info", label: "Ma'lumotlar" },
            { value: "groups", label: "Guruhlar" },
            { value: "coins", label: "Tangalar" },
            { value: "gifts", label: "Sovg'alar" },
            { value: "security", label: "Xavfsizlik" },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="rounded-lg px-4 py-2 text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Ma'lumotlar ── */}
        <TabsContent value="info" className="mt-4">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Shaxsiy ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField label="To'liq ismi" value={student.fullName} />
                <InfoField label="Telefon raqam" value={student.phone} />
                <InfoField label="Email" value={student.email ?? "—"} />
                <InfoField label="Rol" value={student.role.displayName} />
                {student.parentPhone && <InfoField label="Ota-ona telefoni" value={student.parentPhone} />}
                <InfoField label="Ro'yxatdan o'tgan" value={formatDate(student.createdAt, "dd.MM.yyyy, HH:mm")} />
                <InfoField label="Oxirgi yangilanish" value={formatDate(student.updatedAt, "dd.MM.yyyy, HH:mm")} />
                {student.avatarUrl && <InfoField label="Avatar URL" value={student.avatarUrl} />}
              </div>
              {!isDeleted && (
                <div className="pt-2 flex justify-end">
                  <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setIsEditOpen(true)}>
                    <Pencil size={14} />Ma'lumotlarni tahrirlash
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Guruhlar ── */}
        <TabsContent value="groups" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              Guruhlar ro'yxati ({student.groups?.length ?? 0})
            </h3>
            {!isDeleted && (
              <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                <UserPlus size={14} />Guruhga qo'shish
              </Button>
            )}
          </div>
          {!student.groups?.length ? (
            <EmptyState text="Hech qanday guruhga a'zo emas" />
          ) : (
            <div className="space-y-2">
              {student.groups.map((g) => (
                <div key={g.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Users size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{g.name}</p>
                      <p className="text-xs text-zinc-400">{g.course} · {g.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">{formatDate(g.joinedAt, "dd.MM.yyyy")} dan</span>
                    {!isDeleted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        disabled={removeFromGroup.isPending}
                        onClick={() => removeFromGroup.mutate({ groupId: g.id })}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Tangalar ── */}
        <TabsContent value="coins" className="mt-4 space-y-4">
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center">
              <Coins size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">Joriy balans</p>
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                {student.wallet?.balance ?? 0} <span className="text-base font-normal">coin</span>
              </p>
            </div>
          </div>
          {!isDeleted && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["earn", "deduct"] as const).map((dir) => {
                const isEarn = dir === "earn";
                return (
                  <div key={dir} className="space-y-2">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                      {isEarn ? "Coin qo'shish" : "Coindan ayirish"}
                    </p>
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${isEarn ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30" : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30"}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isEarn ? "bg-green-100 dark:bg-green-900 text-green-600" : "bg-red-100 dark:bg-red-900 text-red-600"}`}>
                        {isEarn ? <Plus size={16} /> : <Minus size={16} />}
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={coinForm.amount}
                        onChange={(e) => setCoinForm((p) => ({ ...p, amount: e.target.value }))}
                        placeholder="Miqdor..."
                        className="flex-1 bg-transparent border-0 outline-none text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 w-0"
                      />
                      <input
                        type="text"
                        value={coinForm.note}
                        onChange={(e) => setCoinForm((p) => ({ ...p, note: e.target.value }))}
                        placeholder="Sabab"
                        className="flex-1 bg-transparent border-0 outline-none text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 border-l border-zinc-200 dark:border-zinc-700 pl-3 w-0"
                      />
                      <Button
                        size="sm"
                        disabled={!coinForm.amount || manualCoin.isPending}
                        className={isEarn ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
                        onClick={() => handleCoinAction(dir)}
                      >
                        {isEarn ? "Qo'shish" : "Ayirish"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tranzaksiya tarixi (so'nggi 20)</p>
            {!student.coinTransactions?.length ? (
              <EmptyState text="Tranzaksiyalar mavjud emas" />
            ) : (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {student.coinTransactions.map((tx, idx) => (
                  <div key={tx.id} className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 ${idx !== student.coinTransactions.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${tx.direction === "earn" ? "bg-green-100 dark:bg-green-900/40 text-green-600" : "bg-red-100 dark:bg-red-900/40 text-red-600"}`}>
                        {tx.direction === "earn" ? <Plus size={12} /> : <Minus size={12} />}
                      </div>
                      <div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{tx.note ?? tx.sourceType}</p>
                        <p className="text-xs text-zinc-400">{formatDate(tx.createdAt, "dd.MM.yyyy")}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${tx.direction === "earn" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {tx.direction === "earn" ? "+" : "-"}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Sovg'alar ── */}
        <TabsContent value="gifts" className="mt-4">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              Sotib olingan sovg'alar ({student.purchases?.length ?? 0})
            </h3>
            {!student.purchases?.length ? (
              <EmptyState text="Hali hech qanday sovg'a sotib olinmagan" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {student.purchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0">
                      <Gift size={18} className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{purchase.itemName}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span className="flex items-center gap-1"><Coins size={11} />{purchase.price} coin</span>
                        <span>·</span>
                        <span>{formatDate(purchase.purchasedAt, "dd.MM.yyyy")}</span>
                      </div>
                      <Badge className={`mt-1 text-[10px] border-0 ${purchase.status === "approved" ? "bg-green-100 text-green-700" : purchase.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {purchase.status === "approved" ? "Tasdiqlangan" : purchase.status === "rejected" ? "Rad etilgan" : "Kutilmoqda"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Xavfsizlik ── */}
        <TabsContent value="security" className="mt-4 space-y-4">
          {/* Change password */}
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lock size={16} className="text-zinc-500" />
                Parolni o'zgartirish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Yangi parol</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yangi parol kiriting"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Parolni tasdiqlang</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Parolni qaytadan kiriting"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>
              {newPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500">Parollar mos emas</p>
              )}
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  disabled={!newPassword || newPassword !== confirmPassword || changePassword.isPending}
                  className="gap-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  onClick={() => {
                    changePassword.mutate(
                      { newPassword },
                      { onSuccess: () => { setNewPassword(""); setConfirmPassword(""); } },
                    );
                  }}
                >
                  <ShieldCheck size={14} />
                  {changePassword.isPending ? "Saqlanmoqda..." : "Parolni o'zgartirish"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Arxivlash (isActive: false) */}
          <Card className="border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-zinc-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Archive size={16} />
                Arxivlash (isActive)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20">
                <div className="space-y-1">
                  {isActive ? (
                    <>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Talabani arxivlash</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        To'lov qilmagan yoki vaqtinchalik to'xtatgan talabalar uchun. Ma'lumotlar saqlanadi, keyinchalik qayta faollashtiriladi.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Talabani faollashtirish</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Talaba arxivda. Faollashtirish orqali tizimga kirishini tiklashingiz mumkin.
                      </p>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`shrink-0 gap-2 ${isActive ? "border-amber-400 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400" : "border-green-400 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400"}`}
                  onClick={() => setConfirmAction(isActive ? "archive" : "restore")}
                  disabled={isDeleted}
                >
                  {isActive ? <><Archive size={14} />Arxivlash</> : <><Power size={14} />Faollashtirish</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Soft delete (isDeleted: true) */}
          <Card className="border border-red-200 dark:border-red-900/60 bg-white dark:bg-zinc-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                <Trash2 size={16} />
                O'chirish (isDeleted)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Talabani o'chirish</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    O'qishni to'liq tugatgan yoki noto'g'ri qo'shilgan talabalar uchun. Soft delete — ma'lumotlar bazada saqlanadi, lekin tizimda ko'rinmaydi. Qayta tiklash faqat administrator orqali.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleted}
                  className="shrink-0 gap-2 border-red-400 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 disabled:opacity-40"
                  onClick={() => setConfirmAction("delete")}
                >
                  <PowerOff size={14} />
                  {isDeleted ? "O'chirilgan" : "O'chirish"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Modals ── */}
      <StudentFormModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        mode="edit"
        student={student}
      />

      <SendMessageModal
        open={isMsgOpen}
        onClose={() => setIsMsgOpen(false)}
        student={student}
      />

      {confirmAction && (
        <ConfirmModal
          open={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={confirmContent[confirmAction].title}
          description={confirmContent[confirmAction].description}
          confirmLabel={confirmContent[confirmAction].label}
          variant={confirmContent[confirmAction].variant}
          isPending={deactivate.isPending}
        />
      )}
    </div>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────────
const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wide">{label}</p>
    <p className="text-sm text-zinc-800 dark:text-zinc-200">{value}</p>
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-600">
    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
      <BookOpen size={20} />
    </div>
    <p className="text-sm">{text}</p>
  </div>
);

export default StudentDetail;
