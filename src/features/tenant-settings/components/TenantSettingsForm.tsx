import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Clock, Coins } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { translateApiError } from "@/ustils";
import { COIN_AMOUNT_MAX, DEFAULT_TIMEZONE } from "../constants";
import { useTenantSettings, useUpdateTenantSettings } from "../hooks";
import {
  createTenantSettingsSchema,
  type TenantSettingsFormValues,
} from "../schema";
import type { UpdateTenantSettingsDto } from "../types";

/** Brauzer qo'llab-quvvatlasa barcha IANA zonalari, aks holda asosiylari. */
const getTimezoneOptions = (current?: string) => {
  const supported =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : [DEFAULT_TIMEZONE, "Asia/Samarkand", "UTC", "Europe/Moscow"];
  const zones =
    current && !supported.includes(current) ? [current, ...supported] : supported;
  return zones.map((zone) => ({ value: zone, label: zone }));
};

export const TenantSettingsForm = () => {
  const { t } = useTranslation();
  const { data: settings, isLoading, isError } = useTenantSettings();
  const updateSettings = useUpdateTenantSettings();

  const schema = useMemo(() => createTenantSettingsSchema(t), [t]);
  const form = useForm<TenantSettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { teacherCoinLimit: "", timezone: DEFAULT_TIMEZONE },
  });

  useEffect(() => {
    if (!settings) return;
    form.reset({
      teacherCoinLimit:
        settings.teacherCoinLimit !== null
          ? String(settings.teacherCoinLimit)
          : "",
      timezone: settings.timezone || DEFAULT_TIMEZONE,
    });
  }, [settings, form]);

  const timezoneOptions = useMemo(
    () => getTimezoneOptions(settings?.timezone),
    [settings?.timezone],
  );

  const onSubmit = (values: TenantSettingsFormValues) => {
    if (!settings) return;
    const limit = values.teacherCoinLimit
      ? Number(values.teacherCoinLimit)
      : null;

    // Faqat o'zgargan maydonlar yuboriladi.
    const payload: UpdateTenantSettingsDto = {};
    if (limit !== settings.teacherCoinLimit) payload.teacherCoinLimit = limit;
    if (values.timezone !== settings.timezone)
      payload.timezone = values.timezone;

    if (!Object.keys(payload).length) {
      toast.info(t("tenantSettings.noChanges"));
      return;
    }

    updateSettings.mutate(payload, {
      onSuccess: (res) =>
        toast.success(res.message || t("tenantSettings.saved")),
      onError: (error) => toast.error(translateApiError(error, t)),
    });
  };

  if (isLoading) return <PageLoading />;
  if (isError || !settings) return <NoData text={t("common.noData")} />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl space-y-6"
      >
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-3 min-w-0">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Coins size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {t("tenantSettings.coinLimit.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("tenantSettings.coinLimit.description")}
              </p>
            </div>
          </div>
          <ControlledInput
            control={form.control}
            name="teacherCoinLimit"
            label={t("tenantSettings.coinLimit.label")}
            placeholder={t("tenantSettings.coinLimit.placeholder")}
            isNumber
            maxValue={COIN_AMOUNT_MAX}
          />
          <p className="text-xs text-muted-foreground">
            {t("tenantSettings.coinLimit.hint")}
          </p>
        </section>

        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-3 min-w-0">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {t("tenantSettings.timezone.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("tenantSettings.timezone.description")}
              </p>
            </div>
          </div>
          <ControlledSelect
            control={form.control}
            name="timezone"
            label={t("tenantSettings.timezone.label")}
            options={timezoneOptions}
            clearable={false}
          />
        </section>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
