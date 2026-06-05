import type { ReactNode } from "react";

interface NoDataProps {
  text: string;
  height?: string;
  children?: ReactNode;
}

export const NoData = ({
  text,
  height = "h-[60vh]",
  children,
}: NoDataProps) => {
  return (
    <div
      className={`${height} w-full flex flex-col gap-y-3 items-center justify-center bg-background rounded-xl`}
    >
      <span className="text-gray-600 dark:text-gray-200 text-lg">{text}</span>
      {children}
    </div>
  );
};
