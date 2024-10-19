// generate function to get local item
export const getLocalItem = (key: string) => {
  return localStorage.getItem(key);
};

// generate function to set local item
export const setLocalItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

// generate function to remove local item
export const removeLocalItem = (key: string) => {
  localStorage.removeItem(key);
};
