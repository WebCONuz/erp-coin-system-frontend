import { BookOpenCheck, CheckCircle2, Flame } from "lucide-react";

const TIPS = [
  {
    icon: CheckCircle2,
    iconClass: "text-forest bg-forest/10",
    title: "Darsga qatnashing",
    desc: "Har bir dars uchun coin ishlab oling",
  },
  {
    icon: BookOpenCheck,
    iconClass: "text-gold bg-gold/15",
    title: "Uy vazifasini bajaring",
    desc: "Har bir topshiriq uchun qo'shimcha coin",
  },
  {
    icon: Flame,
    iconClass: "text-bloom bg-bloom/10",
    title: "Ketma-ket faol bo'ling",
    desc: "Streak uzun bo'lgani sayin bonuslar ko'proq",
  },
];

export const StudentEarnTips = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {TIPS.map((tip) => (
      <div
        key={tip.title}
        className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4"
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tip.iconClass}`}
        >
          <tip.icon size={17} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{tip.title}</p>
          <p className="text-xs text-ink-soft mt-0.5">{tip.desc}</p>
        </div>
      </div>
    ))}
  </div>
);
