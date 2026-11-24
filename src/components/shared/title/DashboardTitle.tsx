import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  /** `h2` — boshqa sahifa ichidagi bo'lim (masalan, Sozlamalar ichidagi sahifalar). */
  as?: "h1" | "h2";
};

export const DashboardTitle = ({ title, description, as = "h1" }: Props) => {
  const Heading = as;
  return (
    <div className="min-w-0">
      <Heading
        className={cn(
          "font-heading font-semibold leading-tight tracking-tight",
          as === "h1" ? "text-2xl sm:text-[26px]" : "text-lg sm:text-xl",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground sm:text-[15px]">
          {description}
        </p>
      )}
    </div>
  );
};
