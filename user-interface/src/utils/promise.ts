export interface WrappedPromise<T> {
  read: () => T;
}

export type WrappedPromiseStatus = "pending" | "success" | "error";

export type PromiseGetter<T> = () => Promise<T>;

interface PromiseState<T> {
  status: WrappedPromiseStatus;
  result: unknown;
  promise: Promise<T>;
}

const promiseStateMap = new Map<string, PromiseState<any>>([]);

export const wrapPromise = <T>(
  key: string,
  getter: PromiseGetter<T>
): WrappedPromise<T> => {
  const { promise } =
    promiseStateMap.get(key) ??
    (promiseStateMap
      .set(key, {
        status: "pending",
        result: undefined,
        promise: getter(),
      })
      .get(key) as PromiseState<T>);

  let suspender = promise.then(
    (value) => {
      promiseStateMap.set(key, {
        status: "success",
        result: value,
        promise,
      });
    },
    (reason) => {
      promiseStateMap.set(key, {
        status: "error",
        result: reason,
        promise,
      });
    }
  );

  const { status, result } = promiseStateMap.get(key) as PromiseState<T>;

  return {
    read: () => {
      switch (status) {
        case "pending":
          throw suspender;
        case "error":
          throw result;
        case "success":
          return result as T;
        default:
          throw new Error("Illegal WrappedPromiseStatus");
      }
    },
  };
};
