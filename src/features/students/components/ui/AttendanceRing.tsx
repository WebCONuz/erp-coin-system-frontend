import { RadialProgress } from "@/components/shared/charts";

export const AttendanceRing = ({ percent }: { percent: number }) => {
  return <RadialProgress percent={percent} size={44} strokeWidth={4} />;
};
