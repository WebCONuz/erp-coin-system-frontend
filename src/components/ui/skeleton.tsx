import { cn } from "@/lib/utils";

/** Yuklanish joy egasi. Ekran o'quvchilardan yashirilgan — yuklanish holati
 *  ota konteynerda `aria-busy` orqali bildiriladi. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
