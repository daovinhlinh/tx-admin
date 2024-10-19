export const debounce = (
  func: (...args: any[]) => void,
  delay: number
): ((...args: any[]) => void) => {
  let debounceTimer: NodeJS.Timeout;
  return function (...args: any[]) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};
