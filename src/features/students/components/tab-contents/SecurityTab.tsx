import { TabsContent } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Archive,
  Lock,
  Power,
  PowerOff,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { ConfirmAction } from "../../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useChangeStudentPassword } from "../../hooks";
import { useParams } from "react-router-dom";

export const SecurityTab = ({
  isActive,
  isDeleted,
  setConfirmAction,
}: {
  isActive: boolean;
  isDeleted: boolean;
  setConfirmAction: (action: ConfirmAction) => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePassword = useChangeStudentPassword(id ?? "");

  return (
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
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Yangi parol
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yangi parol kiriting"
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Parolni tasdiqlang
              </label>
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
              disabled={
                !newPassword ||
                newPassword !== confirmPassword ||
                changePassword.isPending
              }
              className="gap-2 bg-linear-to-br from-purple-500 to-purple-700 h-10 px-4 text-white disabled:opacity-50"
              onClick={() => {
                changePassword.mutate(
                  { newPassword },
                  {
                    onSuccess: () => {
                      setNewPassword("");
                      setConfirmPassword("");
                    },
                  },
                );
              }}
            >
              <ShieldCheck size={14} />
              {changePassword.isPending
                ? "Saqlanmoqda..."
                : "Parolni o'zgartirish"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone: archive + delete */}
      <Card className="border border-red-200 dark:border-red-900/60 bg-white dark:bg-zinc-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle size={16} />
            Xavfli hudud
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                <Archive
                  size={16}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {isActive ? "Talabani arxivlash" : "Talabani faollashtirish"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isActive
                    ? "To'lov qilmagan yoki vaqtinchalik to'xtatgan talabalar uchun. Ma'lumotlar saqlanadi, keyinchalik qayta faollashtiriladi."
                    : "Talaba arxivda. Faollashtirish orqali tizimga kirishini tiklashingiz mumkin."}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`shrink-0 gap-2 ${isActive ? "border-amber-400 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400" : "border-green-400 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400"}`}
              onClick={() => setConfirmAction(isActive ? "archive" : "restore")}
              disabled={isDeleted}
            >
              {isActive ? (
                "Arxivlash"
              ) : (
                <>
                  <Power size={14} />
                  Faollashtirish
                </>
              )}
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Talabani o'chirish
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  O'qishni to'liq tugatgan yoki noto'g'ri qo'shilgan talabalar
                  uchun. Soft delete — ma'lumotlar bazada saqlanadi, tizimda
                  ko'rinmaydi.
                </p>
              </div>
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
  );
};
