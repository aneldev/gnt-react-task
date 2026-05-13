import type {TObject} from "../typescript";

export const getDeepValue = (obj: TObject, path: string): unknown => {
  const keys = path.split('.');

  let currentObj = obj;

  for (const key of keys) {
    if (currentObj && currentObj[key] !== undefined) {
      currentObj = currentObj[key] as TObject;
    }
    else {
      return undefined;
    }
  }

  return currentObj;
};
