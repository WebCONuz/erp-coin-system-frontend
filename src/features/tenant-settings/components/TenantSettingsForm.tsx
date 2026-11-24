import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Clock, Coins } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTitle } from "@/components/shared/title";
import { ErrorState } from "@/components/shared/states";
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
  const { data: settings, isLoading, isError, refetch, isFetching } =
    useTenantSettings();
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

  const title = (
    <DashboardTitle
      title={t("tenantSettings.title")}
      description={t("tenantSettings.description")}
      as="h2"
    />
  );

  if (isLoading) {
    return (
      <div aria-busy="true" className="max-w-2xl space-y-4">
        {title}
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    );
  }
  if (isError || !settings) {
    return (
      <div className="max-w-2xl space-y-4">
        {title}
        <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="mb-4 sm:mb-5">{title}</div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-4"
      >
        <section className="min-w-0 space-y-3 rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-coin-soft text-coin-ink">
              <Coins className="size-[18px]" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="font-heading text-base font-semibold">
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

        <section className="min-w-0 space-y-3 rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Clock className="size-[18px]" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="font-heading text-base font-semibold">
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
          <Button
            type="submit"
            disabled={updateSettings.isPending}
            className="h-10 min-w-32"
          >
            {updateSettings.isPending ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
