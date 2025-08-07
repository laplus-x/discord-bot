import type { Async, NoArgsFunc } from '@/types';
import { Err, Ok, OkImpl } from 'ts-results';

export class Functions {
  public static wrap<T, E>(func: NoArgsFunc<T>) {
    try {
      const r = func();
      return new Ok(r);
    } catch (err: unknown) {
      return new Err(err as E);
    }
  }

  public static async wrapAsync<T, E>(func: Async<NoArgsFunc<T>>) {
    try {
      const r = await func();
      return new Ok(r);
    } catch (err: unknown) {
      return new Err(err as E);
    }
  }

  public static wrapAll(funcs: NoArgsFunc<any>[]) {
    const results: OkImpl<any>[] = [];
    for (const func of funcs) {
      const { ok, val } = this.wrap(func);
      if (!ok) {
        return new Err(val);
      }
      results.push(val);
    }
    return new Ok(results);
  }
  
  public static async wrapAsyncAll(funcs: Async<NoArgsFunc<any>>[]) {
    const results: OkImpl<any>[] = [];
    for (const func of funcs) {
      const { ok, val } = await this.wrapAsync(func);
      if (!ok) {
        return new Err(val);
      }
      results.push(val);
    }
    return new Ok(results);
  }

  public static async all(funcs: Promise<any>[]) {
    return this.wrapAsync(() => Promise.all(funcs));
  }

  public static async allSettled(funcs: Promise<any>[]) {
    return this.wrapAsync(() => Promise.allSettled(funcs));
  }

  public static async any(funcs: Promise<any>[]) {
    return this.wrapAsync(() => Promise.any(funcs));
  }

  public static async race(funcs: Promise<any>[]) {
    return this.wrapAsync(() => Promise.race(funcs));
  }
}
