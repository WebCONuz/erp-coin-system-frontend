export interface GroupAccent {
  bar: string;
  chip: string;
  bg: string;
  text: string;
}

// Har bir guruhga barqaror rang — fanlar bilan bir xil `--subject-N`
// tokenlaridan (yorug' va qorong'i rejim uchun alohida qiymatlar index.css'da).
// Klasslar to'liq yozilgan, aks holda Tailwind ularni topa olmaydi.
const GROUP_ACCENTS: GroupAccent[] = [
  { bar: "bg-(--subject-1)", chip: "text-(--subject-1) bg-(--subject-1)/12", bg: "bg-(--subject-1)/12", text: "text-(--subject-1)" },
  { bar: "bg-(--subject-2)", chip: "text-(--subject-2) bg-(--subject-2)/12", bg: "bg-(--subject-2)/12", text: "text-(--subject-2)" },
  { bar: "bg-(--subject-3)", chip: "text-(--subject-3) bg-(--subject-3)/12", bg: "bg-(--subject-3)/12", text: "text-(--subject-3)" },
  { bar: "bg-(--subject-4)", chip: "text-(--subject-4) bg-(--subject-4)/12", bg: "bg-(--subject-4)/12", text: "text-(--subject-4)" },
  { bar: "bg-(--subject-5)", chip: "text-(--subject-5) bg-(--subject-5)/12", bg: "bg-(--subject-5)/12", text: "text-(--subject-5)" },
  { bar: "bg-(--subject-6)", chip: "text-(--subject-6) bg-(--subject-6)/12", bg: "bg-(--subject-6)/12", text: "text-(--subject-6)" },
  { bar: "bg-(--subject-7)", chip: "text-(--subject-7) bg-(--subject-7)/12", bg: "bg-(--subject-7)/12", text: "text-(--subject-7)" },
  { bar: "bg-(--subject-8)", chip: "text-(--subject-8) bg-(--subject-8)/12", bg: "bg-(--subject-8)/12", text: "text-(--subject-8)" },
];

export function getGroupAccent(seed: string): GroupAccent {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GROUP_ACCENTS[sum % GROUP_ACCENTS.length];
}
