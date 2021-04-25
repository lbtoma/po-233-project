import { Progress } from "@chakra-ui/progress";
import React, { useContext, useState } from "react";

interface LoadingCounter {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export interface LoadingSuccessfulResult<V> {
  error: null;
  value: V;
}

export interface LoadingErrorResult<E extends Error = Error> {
  error: E;
  value: null;
}

export type LoadingResult<V = void, E extends Error = Error> =
  | LoadingSuccessfulResult<V>
  | LoadingErrorResult<E>;

export type WithLoadingStatus<V = void> = () => Promise<V>;

const LoadingStatusContext = React.createContext<LoadingCounter>({
  count: 0,
  increment: () => {},
  decrement: () => {},
});

export const LoadingStatusProvider: React.FC = ({ children }) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((lastCount) => lastCount + 1);
  const decrement = () => setCount((lastCount) => lastCount - 1);
  const isLoading = !!count;

  return (
    <LoadingStatusContext.Provider
      value={{
        count,
        increment,
        decrement,
      }}
    >
      {isLoading && (
        <Progress
          position="fixed"
          top="0"
          width="100vw"
          size="xs"
          isIndeterminate
        />
      )}
      {children}
    </LoadingStatusContext.Provider>
  );
};

export function useWithLoading<V = void, E extends Error = Error>(
  withLoadingStatus: WithLoadingStatus<V>
): () => Promise<LoadingResult<V, E>> {
  const { increment, decrement } = useContext(LoadingStatusContext);

  return async () => {
    increment();
    let result: LoadingResult<V, E> | undefined;

    try {
      result = { error: null, value: await withLoadingStatus() };
    } catch (err) {
      result = { error: err as E, value: null };
    }

    decrement();
    return result;
  };
}
