import { Dispatch, SetStateAction, useState } from "react";

/**
 * Extends off the `useState` hook but attaches an additional method that can be called when setting the state value to include the effects of the `updater` function.
 * For example, the `updater` method syncs state with the storage provider, but couldn't be used in a normal `useEffect` because it was triggered when getting the value from storage.
 * Causing a loop of the state and storage updating eachother. So this hook offers the ability to update the state with or without the effects in the `updater` function.
 * If you want the effects update using the returned `updater` function, if not use the normal dispatch set state action method.
 */
export const useStateEffect = <T>(
  initialValue: T | (() => T),
  updater: (newValue: T) => void,
): [T, Dispatch<SetStateAction<T>>, (newValue: T) => void] => {
  const [value, setValue] = useState<T>(initialValue);

  return [
    value,
    setValue,
    (newValue: T) => {
      setValue(newValue);
      updater(newValue);
    },
  ];
};
