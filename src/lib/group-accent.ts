export interface GroupAccent {
  bar: string;
  chip: string;
  bg: string;
  text: string;
}

// Warm, earthy accent set that stays inside the "bilim bog'i" palette —
// used to give each group a consistent color across cards and calendars
// (student and teacher) without leaning on the app-wide (cooler) chip
// palette used elsewhere (e.g. the admin schedule builder).
const GROUP_ACCENTS: GroupAccent[] = [
  { bar: "bg-forest", chip: "text-forest bg-forest/10", bg: "bg-forest/10", text: "text-forest" },
  { bar: "bg-gold", chip: "text-gold bg-gold/15", bg: "bg-gold/15", text: "text-gold" },
  { bar: "bg-bloom", chip: "text-bloom bg-bloom/10", bg: "bg-bloom/10", text: "text-bloom" },
  { bar: "bg-emerald-500", chip: "text-emerald-700 bg-emerald-100", bg: "bg-emerald-100", text: "text-emerald-700" },
  { bar: "bg-amber-500", chip: "text-amber-700 bg-amber-100", bg: "bg-amber-100", text: "text-amber-700" },
  { bar: "bg-orange-500", chip: "text-orange-700 bg-orange-100", bg: "bg-orange-100", text: "text-orange-700" },
  { bar: "bg-lime-600", chip: "text-lime-700 bg-lime-100", bg: "bg-lime-100", text: "text-lime-700" },
  { bar: "bg-rose-500", chip: "text-rose-700 bg-rose-100", bg: "bg-rose-100", text: "text-rose-700" },
];

export function getGroupAccent(seed: string): GroupAccent {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GROUP_ACCENTS[sum % GROUP_ACCENTS.length];
}
