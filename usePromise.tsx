import React from "react";
import { assign, isEqual, isFunction, castArray } from "lodash";
interface AsyncFunc {
  (opts?: object): Promise<any>;
}
export const usePromise = (promise: AsyncFunc, def?: any, deps?: any) => {
  const [val, $val] = React.useState(def);
  const ref: any = React.useRef({});
  assign(ref.current, {
    val,
    $val,
  });
  const setVal = (newVal: any) => {
    if (!isEqual(ref.current.val, newVal)) {
      ref.current.$val(newVal);
    }
  };
  React.useEffect(() => {
    (async () => {
      let func = promise;
      if (isFunction(func)) func = await func();
      setVal(func);
    })();
  }, [...castArray(deps || [])]);
  return [ref.current.val, ref.current.$val];
};

export default usePromise;
