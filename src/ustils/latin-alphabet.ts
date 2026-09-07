export const latinAlphabetMask = (value: string) => {
  return value.replace(/[^a-zA-Z0-9 oʻOʻgʻGʻshchSHCH.,'‘’]/g, "");
};
