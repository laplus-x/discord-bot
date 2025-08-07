import type { LastKey } from 'ts-toolbelt/out/List/LastKey';
import type { Omit } from 'ts-toolbelt/out/List/Omit';

export type Key<T = any> = keyof T;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export type NoArgsFunc<T = any> = () => T;
export type ArgsFunc<T = any> = (...args: any[]) => T;

export type Async<F extends ArgsFunc> = (
  ...args: Parameters<F>
) => Promise<ReturnType<F>>;
export type Promisify<F extends ArgsFunc> = (
  ...args: Omit<Parameters<F>, LastKey<Parameters<F>>>
) => Promise<ReturnType<F>>;

export function isPromise(value: any): value is Promise<any> {
  return value !== null && typeof value.then === 'function';
}

export type MapKey<T> = T extends Map<infer K, any> ? K : never;
export type MapValue<T> = T extends Map<any, infer V> ? V : never;

export type RecordKey<T> = T extends Record<infer K, any> ? K : never;
export type RecordValue<T> = T extends Record<any, infer V> ? V : never;

/**
 * @example
 * Constructor<Date>
 */
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * @example
 * Instance<typeof Date>
 */
export type Instance<T extends Constructor> = T extends abstract new (
  ...args: any
) => infer R
  ? R
  : never;

export type NestedKeyOf<T extends object> = {
  [K in Key<T> & (string | number)]: T[K] extends object
  ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
  : `${K}`;
}[Key<T> & (string | number)];

// 擴充
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// https://github.com/millsp/ts-toolbelt
// https://github.com/sindresorhus/type-fest

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object';
}

export function isFunction(value: any): value is Function {
  return value !== null && typeof value === 'function';
}

export function isConstructor(value: any): value is Constructor {
  return (
    isFunction(value) &&
    isFunction(value?.constructor) &&
    value?.prototype !== undefined &&
    value?.name !== undefined
  );
}

export function isInstance(value: any) {
  return !isFunction(value) && isConstructor(value?.constructor);
}
