import {useState} from "react";

import {isMac} from "../utils";

export const useIsMac = (): boolean => {
  const [value] = useState(isMac);
  return value;
};
