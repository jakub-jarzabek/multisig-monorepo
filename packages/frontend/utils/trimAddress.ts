export const trimAddress = (address: string, length = 16): string => {
  const first = address.slice(0, length);
  const last = address.slice(-length);

  return `${first}...${last}`;
};
