import { Gift } from "lucide-react";
import { cn, getFileUrl } from "@/lib/utils";

interface Props {
  imageUrl: string | null;
  className?: string;
}

/** Sovg'a rasmi; rasm bo'lmasa — neytral sovg'a belgisi. */
export const RewardThumb = ({ imageUrl, className }: Props) => (
  <span
    className={cn(
      "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted",
      className,
    )}
  >
    {imageUrl ? (
      <img
        src={getFileUrl(imageUrl)}
        alt=""
        loading="lazy"
        className="size-full object-cover"
      />
    ) : (
      <Gift className="size-4 text-muted-foreground" aria-hidden />
    )}
  </span>
);
