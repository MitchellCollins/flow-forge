export const getInitials = (email: string) => {
  if (email.length <= 1) return email;
  const dot = email.indexOf(".");
  return (
    email.slice(0, 1) + (dot !== -1 && email.length >= dot + 2 ? email.slice(dot + 1, dot + 2) : "")
  ).toUpperCase();
};
