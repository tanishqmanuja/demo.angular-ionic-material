import {
  DestroyRef,
  effect,
  inject,
  signal,
  type WritableSignal,
} from "@angular/core";

import { assertInjector } from "ngxtension/assert-injector";
import {
  injectLocalStorage,
  LocalStorageOptions,
  NGXTENSION_LOCAL_STORAGE,
} from "ngxtension/inject-local-storage";

function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

function goodTry<T>(tryFn: () => T): T | undefined {
  try {
    return tryFn();
  } catch {
    return undefined;
  }
}

function parseJSON(value: string): unknown {
  return value === "undefined" ? undefined : JSON.parse(value);
}

export type LocalStorageOptionsWithDefaultValue<T> = LocalStorageOptions<T> & {
  defaultValue: T | (() => T);
};
export const injectLocalStorageRequired = <T>(
  key: string,
  options: LocalStorageOptionsWithDefaultValue<T>,
): WritableSignal<T> => {
  const defaultValue = isFunction(options.defaultValue)
    ? options.defaultValue()
    : options.defaultValue;
  const stringify = isFunction(options.stringify)
    ? options.stringify
    : JSON.stringify;
  const parse = isFunction(options.parse) ? options.parse : parseJSON;
  const storageSync = options.storageSync ?? true;

  return assertInjector(injectLocalStorageRequired, options.injector, () => {
    const localStorage = inject(NGXTENSION_LOCAL_STORAGE);
    const destroyRef = inject(DestroyRef);

    const initialStoredValue = goodTry(() => localStorage.getItem(key));
    const initialValue = initialStoredValue
      ? goodTry(() => parse(initialStoredValue) as T)
      : defaultValue;
    const internalSignal = signal<T>(initialValue ?? defaultValue);

    effect(() => {
      const value = internalSignal();
      if (value === undefined) {
        goodTry(() => localStorage.removeItem(key));
      } else {
        goodTry(() => localStorage.setItem(key, stringify(value)));
      }
    });

    if (storageSync) {
      const onStorage = (event: StorageEvent) => {
        if (event.storageArea === localStorage && event.key === key) {
          const newValue =
            event.newValue !== null
              ? goodTry(() => parse(event.newValue!) as T)
              : isFunction(options.defaultValue)
                ? options.defaultValue()
                : options.defaultValue;
          internalSignal.set(
            newValue ??
              (isFunction(options.defaultValue)
                ? options.defaultValue()
                : options.defaultValue),
          );
        }
      };

      window.addEventListener("storage", onStorage);
      destroyRef.onDestroy(() => {
        window.removeEventListener("storage", onStorage);
      });
    }

    return internalSignal;
  });
};

export const sigstore = Object.assign(injectLocalStorage, {
  required: injectLocalStorageRequired,
});
