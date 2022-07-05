import { isEqual, isNil, isNull, isUndefined, omitBy, trim } from 'lodash';

export const isEmptyValue = (v: any): v is null | undefined =>
  isNil(v) || trim(v) === '' || isEqual(v, {});
// NOTE: no type narrow?
export const isNotEmptyValue = (v: any) => !isEmptyValue(v);
export const omitByEmptyDeeply = (obj: any) => {
  const object1 = obj || {};
  Object.keys(object1).forEach((key) => {
    if (typeof object1[key] === 'object') {
      object1[key] = omitByEmptyDeeply(object1[key]);
    }
  });
  return omitBy(object1, isEmptyValue);
};

export const isEqualIgnoreEmpty = (obj1: any, obj2: any) => {
  if (isEqual(obj1, obj2)) {
    return true;
  }
  return isEqual(omitByEmptyDeeply(obj1), omitByEmptyDeeply(obj2));
};

/**
 * a string contains only spaces is regarded as blank
 */
const isBlank = (s: string) => s.trim() === '';

export function isBlankOrEmpty(s: string | undefined | null) {
  if (isUndefined(s)) return true;
  if (isNull(s)) return true;
  return isBlank(s);
}

export const isPromise = (value: any): value is Promise<any> =>
  value && Object.prototype.toString.call(value) === '[object Promise]';

export const descriptionOrCode = (d: {
  description?: string | null;
  code: string;
}): string => {
  if (isBlankOrEmpty(d.description)) return d.code;
  return d.description as string;
};
