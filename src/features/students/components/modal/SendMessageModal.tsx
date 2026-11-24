import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, Mail, Phone, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TEXT_LIMITS, translateApiError } from "@/ustils";
import { useSendMessage } from "../../hooks";
import type {
  MessageChannel,
  StudentDetail,
  StudentDetailFull,
} from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  student: StudentDetail | StudentDetailFull;
}

export const SendMessageModal = ({ open, onClose, student }: Props) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [viaSms, setViaSms] = useState(true);
  const [viaEmail, setViaEmail] = useState(false);
  const [recipient, setRecipient] = useState<"student" | "parent">("student");
  const sendMessage = useSendMessage();

  const hasEmail = !!student.email;
  const hasParentPhone = !!student.parentPhone;
  const isEmailSelected = hasEmail && viaEmail;
  const canSend =
    message.trim().length > 0 &&
    message.length <= TEXT_LIMITS.MESSAGE &&
    subject.length <= TEXT_LIMITS.MESSAGE_SUBJECT &&
    (viaSms || isEmailSelected);

  const handleClose = () => {
    setMessage("");
    setSubject("");
    setViaSms(true);
    setViaEmail(false);
    setRecipient("student");
    onClose();
  };

  const handleSend = () => {
    const channels: MessageChannel[] = [];
    if (viaSms) channels.push("sms");
    if (isEmailSelected) channels.push("email");

    const phone =
      recipient === "parent" && student.parentPhone
        ? student.parentPhone
        : student.phone;

    sendMessage.mutate(
      {
        message,
        channels,
        // Ota-onaga yuborilganda ham o'quvchi ID'si — logda bog'lanadi.
        userId: student.id,
        subject:
          channels.includes("email") && subject.trim()
            ? subject.trim()
            : undefined,
        recipientPhone: channels.includes("sms") ? phone : undefined,
        recipientEmail:
          channels.includes("email") && student.email
            ? student.email
            : undefined,
      },
      {
        onSuccess: (res) => {
          const failed = res.results.filter((r) => !r.success);
          if (failed.length === 0) {
            toast.success(res.message);
            handleClose();
            return;
          }
          // Qisman / to'liq muvaffaqiyatsiz — qaysi kanal yuborilmaganini ko'rsatamiz.
          toast.warning(res.message, {
            description: failed
              .map((r) =>
                t("students.sendMessage.channelFailed", {
                  channel:
                    r.channel === "sms"
                      ? t("students.sendMessage.sms")
                      : t("common.email"),
                }),
              )
              .join(", "),
          });
          if (failed.length < res.results.length) handleClose();
        },
        onError: (error) => toast.error(translateApiError(error, t)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-info-soft flex items-center justify-center">
              <MessageSquare
                size={16}
                className="text-info"
              />
            </div>
            {t("students.sendMessage.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient info */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
            <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {student.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {student.fullName}
              </p>
              <p className="text-xs text-muted-foreground">{student.phone}</p>
            </div>
          </div>

          {/* Recipient select — only if parentPhone exists */}
          {hasParentPhone && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {t("students.sendMessage.recipientLabel")}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRecipient("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm transition-colors ${
                    recipient === "student"
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Phone size={14} />
                  {t("common.student")}
                  <span className="text-xs opacity-60">{student.phone}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecipient("parent")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm transition-colors ${
                    recipient === "parent"
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Phone size={14} />
                  {t("students.sendMessage.parent")}
                  <span className="text-xs opacity-60">
                    {student.parentPhone}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Channel checkboxes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("students.sendMessage.channelLabel")}
            </label>
            <div className="flex gap-3">
              <label
                className={`flex items-center gap-2.5 flex-1 p-3 rounded-lg border cursor-pointer transition-colors ${viaSms ? "border-info bg-info-soft" : "border-border hover:bg-muted"}`}
              >
                <input
                  type="checkbox"
                  checked={viaSms}
                  onChange={(e) => setViaSms(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <Phone
                    size={14}
                    className={viaSms ? "text-info" : "text-muted-foreground"}
                  />
                  <span
                    className={`text-sm font-medium ${viaSms ? "text-info" : "text-muted-foreground"}`}
                  >
                    {t("students.sendMessage.sms")}
                  </span>
                </div>
              </label>

              {hasEmail && (
                <label
                  className={`flex items-center gap-2.5 flex-1 p-3 rounded-lg border cursor-pointer transition-colors ${viaEmail ? "border-success bg-success-soft" : "border-border hover:bg-muted"}`}
                >
                  <input
                    type="checkbox"
                    checked={viaEmail}
                    onChange={(e) => setViaEmail(e.target.checked)}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5">
                    <Mail
                      size={14}
                      className={viaEmail ? "text-success" : "text-muted-foreground"}
                    />
                    <span
                      className={`text-sm font-medium ${viaEmail ? "text-success" : "text-muted-foreground"}`}
                    >
                      {t("common.email")}
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Email subject — faqat email kanali tanlanganda */}
          {isEmailSelected && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {t("students.sendMessage.subjectLabel")}
              </label>
              <Input
                value={subject}
                maxLength={TEXT_LIMITS.MESSAGE_SUBJECT}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("students.sendMessage.subjectPlaceholder")}
                className="bg-transparent border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          {/* Message textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("students.sendMessage.messageLabel")}
            </label>
            <textarea
              value={message}
              maxLength={TEXT_LIMITS.MESSAGE}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("students.sendMessage.messagePlaceholder")}
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
            />
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {t("students.sendMessage.plainTextHint")}
              </p>
              <p className="text-xs text-muted-foreground shrink-0">
                {message.length} / {TEXT_LIMITS.MESSAGE}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-border text-foreground"
          >
            {t("common.cancel")}
          </Button>
          <Button
            disabled={!canSend || sendMessage.isPending}
            onClick={handleSend}
            className="gap-2 bg-info hover:bg-info/90 text-white disabled:opacity-50"
          >
            <Send size={14} />
            {sendMessage.isPending
              ? t("common.sending")
              : t("students.sendMessage.send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
