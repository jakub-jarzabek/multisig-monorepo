export const shrortenAddress = (address: string) =>
  address.substring(0, 3) + '...' + address.substring(address.length - 3);
