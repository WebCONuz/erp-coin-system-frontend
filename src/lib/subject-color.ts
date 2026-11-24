const SUBJECT_COLOR_COUNT = 8;

/**
 * Fan (yoki boshqa kalit) uchun barqaror rang: bir xil kalit doim bir xil
 * `--subject-N` tokeniga tushadi — sahifa, oy va foydalanuvchidan qat'i nazar.
 */
export const subjectColor = (key?: string | null) => {
  if (!key) return "var(--muted-foreground)";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return `var(--subject-${(Math.abs(hash) % SUBJECT_COLOR_COUNT) + 1})`;
};
