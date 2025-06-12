export const truncateText = (text: string, maxLength: number = 60): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
