const numberFormat = new Intl.NumberFormat("ru-RU");

/** 4214 → "4 214" (minglar bo'sh joy bilan ajratiladi). */
export const formatCoin = (value: number) => numberFormat.format(value);
