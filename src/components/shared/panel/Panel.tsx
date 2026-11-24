import { cn } from "@/lib/utils";

interface Props extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Sarlavha o'ng tomonidagi amal (havola, tugma, filtr). */
  action?: React.ReactNode;
  /** Ichki padding'ni o'chirish (ro'yxat/jadval chetma-chet tursin desa). */
  flush?: boolean;
}

/**
 * Sahifa bo'limi: oq sirt, 1px chegara, soyasiz. Sarlavha `h2`.
 * Kartalar ichida karta qilmaslik uchun ichki bo'limlar chiziq bilan ajratiladi.
 */
export const Panel = ({
  title,
  description,
  action,
  flush,
  className,
  children,
  ...props
}: Props) => (
  <section
    className={cn(
      "min-w-0 rounded-2xl border border-border bg-card text-card-foreground",
      className,
    )}
    {...props}
  >
    {(title || action) && (
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="min-w-0">
          {title && (
            <h2 className="font-heading text-base font-semibold leading-snug">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
    )}
    <div
      className={cn(flush ? (title || action) && "pt-3" : "p-4 sm:p-5")}
    >
      {children}
    </div>
  </section>
);
