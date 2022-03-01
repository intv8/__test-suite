import { TUnionIntersection } from "../types.ts";

const isObject = (obj: unknown) => {
  if (typeof obj === "object" && obj !== null) {
    if (typeof Object.getPrototypeOf === "function") {
      const prototype = Object.getPrototypeOf(obj);
      return prototype === Object.prototype || prototype === null;
    }

    return Object.prototype.toString.call(obj) === "[object Object]";
  }

  return false;
};

export const merge = <T extends { [key: string]: unknown }[]>(
  ...objects: T
): TUnionIntersection<T[number]> => {
  return objects.reduce((result, current) => {
    Object.keys(current).forEach((key) => {
      if (Array.isArray(result[key]) && Array.isArray(current[key])) {
        result[key] = Array.from(
          new Set((result[key] as unknown[]).concat(current[key])),
        );
      } else if (isObject(result[key]) && isObject(current[key])) {
        result[key] = merge(
          result[key] as { [key: string]: unknown },
          current[key] as { [key: string]: unknown },
        );
      } else {
        result[key] = current[key];
      }
    });

    return result;
  }, {}) as TUnionIntersection<T[number]>;
};
