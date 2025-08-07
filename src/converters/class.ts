import { Constructor } from "@/types";
import { instanceToPlain, plainToInstance, Transform, TransformFnParams } from "class-transformer";

export function TransformDate() {
  const toPlain = Transform((params: TransformFnParams) => (params.value as Date).toISOString(), {
    toPlainOnly: true,
  });

  const toClass = Transform((params: TransformFnParams) => new Date(params.value), {
    toClassOnly: true,
  });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}


export class ClassConverter {
  public static serialize<T extends object>(data: T[]): Record<string, any>[];
  public static serialize<T extends object>(data: T): Record<string, any>;
  public static serialize<T extends object>(data: T | T[]) {
    return instanceToPlain(data, {
      exposeUnsetFields: false,
    });
  }

  public static deserialize<T extends object>(data: Record<string, any>[], out: Constructor<T>): T[];
  public static deserialize<T extends object>(data: Record<string, any>, out: Constructor<T>): T;
  public static deserialize<T extends object>(data: Record<string, any> | Record<string, any>[], out: Constructor<T>) {
    return plainToInstance(out, data, {
      enableImplicitConversion: true,
    });
  }
}