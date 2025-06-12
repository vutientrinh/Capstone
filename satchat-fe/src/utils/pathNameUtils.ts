export const getPageTitle = (pathName: string): string => {
  const parts = pathName.replace(/^\/|\/$/g, "").split("/");
  return capitalize(parts[0] || "Home");
};

const capitalize = (text: string) =>
  text.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
