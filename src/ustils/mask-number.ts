export const numberMask = (value: string) => {
  return value.replace(/\D/g, "");
};

export const numberDecimalMask = (value: string): string => {
  let masked = value.replace(/[^\d.,]/g, "");
  masked = masked.replace(/,/g, ".");
  const parts = masked.split(".");
  if (parts.length > 2) {
    masked = parts[0] + "." + parts.slice(1).join("");
  }
  return masked.replace(".", ",");
};
