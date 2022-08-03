const setItem = (key: string, item: string) => {
  window.localStorage.setItem(key, item);
};
const getItem = (key: string) => {
  return window.localStorage.getItem(key);
};
export const Storage = { setItem, getItem };
