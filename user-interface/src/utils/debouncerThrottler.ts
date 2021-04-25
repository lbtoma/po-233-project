import { useState, Dispatch, SetStateAction } from "react";

type Setter<T> = Dispatch<SetStateAction<T>>;

/**
 * This Hook is an implementation of the Debouncing and Throttling technique
 *
 * Ref:
 *  https://www.telerik.com/blogs/debouncing-and-throttling-in-javascript
 */
const useDebouncerThrottler = <T>(
  initialState: T | (() => T),
  throttlingTimeMs: number
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [innerState, setInnerState] = useState<T>(initialState);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const callback: Setter<T> = (arg) => {
    setInnerState(arg);
    setTimeoutId(null);
  };

  const debounce: Setter<T> = (arg) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(window.setTimeout(() => callback(arg), throttlingTimeMs));
    }
  };

  const setState: Setter<T> = (arg) => {
    if (timeoutId !== null) {
      debounce(arg);
    } else {
      setTimeoutId(window.setTimeout(() => callback(arg), throttlingTimeMs));
    }
  };

  return [innerState, setState];
};

export default useDebouncerThrottler;
