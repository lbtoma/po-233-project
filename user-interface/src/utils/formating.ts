
export const zeroPadding = (input: string | number, max: number): string => {
  const str = input.toString();
  return str.length < max ? zeroPadding(`0${str}`, max) : str;
};
