export const capitiliseFirstChar = (text: string) => {
  if (text.length <= 0) return text;
  return text.slice(0, 1).toUpperCase() + text.slice(1, text.length).toLowerCase();
};
