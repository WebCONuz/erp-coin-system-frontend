import { useState } from "react";
import { MessageSquare, Mail, Phone, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSendMessage } from "../hooks";
import type { StudentDetail, StudentDetailFull } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  student: StudentDetail | StudentDetailFull;
}

export const SendMessageModal = ({ open, onClose, student }: Props) => {
  const [message, setMessage] = useState("");
  const [viaSms, setViaSms] = useState(true);
  const [viaEmail, setViaEmail] = useState(false);
  const [recipient, setRecipient] = useState<"student" | "parent">("student");
  const sendMessage = useSendMessage();

  const hasEmail = !!student.email;
  const hasParentPhone = !!student.parentPhone;
  const canSend = message.trim().length > 0 && (viaSms || (hasEmail && viaEmail));

  const handleClose = () => {
    setMessage("");
    setViaSms(true);
    setViaEmail(false);
    setRecipient("student");
    onClose();
  };

  const handleSend = () => {
    const channels: ("sms" | "email")[] = [];
    if (viaSms) channels.push("sms");
    if (viaEmail && hasEmail) channels.push("email");

    const phone = recipient === "parent" && student.parentPhone ? student.parentPhone : student.phone;

    sendMessage.mutate(
      {
        message,
        channels,
        recipientPhone: channels.includes("sms") ? phone : undefined,
        recipientEmail: channels.includes("email") && student.email ? student.email : undefined,
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            Xabar yuborish
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient info */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400 shrink-0">
              {student.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{student.fullName}</p>
              <p className="text-xs text-zinc-400">{student.phone}</p>
            </div>
          </div>

          {/* Recipient select — only if parentPhone exists */}
          {hasParentPhone && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Kimga yuborish
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRecipient("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm transition-colors ${
                    recipient === "student"
                      ? "border-purple-400 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Phone size={14} />
                  O'quvchi
                  <span className="text-xs opacity-60">{student.phone}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecipient("parent")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm transition-colors ${
                    recipient === "parent"
                      ? "border-purple-400 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Phone size={14} />
                  Ota-ona
                  <span className="text-xs opacity-60">{student.parentPhone}</span>
                </button>
              </div>
            </div>
          )}

          {/* Channel checkboxes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Yuborish kanali
            </label>
            <div className="flex gap-3">
              <label className={`flex items-center gap-2.5 flex-1 p-3 rounded-lg border cursor-pointer transition-colors ${viaSms ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}>
                <input
                  type="checkbox"
                  checked={viaSms}
                  onChange={(e) => setViaSms(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className={viaSms ? "text-blue-600" : "text-zinc-400"} />
                  <span className={`text-sm font-medium ${viaSms ? "text-blue-700 dark:text-blue-300" : "text-zinc-600 dark:text-zinc-400"}`}>
                    SMS
                  </span>
                </div>
              </label>

              {hasEmail && (
                <label className={`flex items-center gap-2.5 flex-1 p-3 rounded-lg border cursor-pointer transition-colors ${viaEmail ? "border-green-400 bg-green-50 dark:bg-green-950/30" : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}>
                  <input
                    type="checkbox"
                    checked={viaEmail}
                    onChange={(e) => setViaEmail(e.target.checked)}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className={viaEmail ? "text-green-600" : "text-zinc-400"} />
                    <span className={`text-sm font-medium ${viaEmail ? "text-green-700 dark:text-green-300" : "text-zinc-600 dark:text-zinc-400"}`}>
                      Email
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Message textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Xabar matni
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xabaringizni kiriting..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-purple-400 transition-colors resize-none"
            />
            <p className="text-xs text-zinc-400 text-right">{message.length} / 500</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
          >
            Bekor qilish
          </Button>
          <Button
            disabled={!canSend || sendMessage.isPending}
            onClick={handleSend}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            <Send size={14} />
            {sendMessage.isPending ? "Yuborilmoqda..." : "Yuborish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
