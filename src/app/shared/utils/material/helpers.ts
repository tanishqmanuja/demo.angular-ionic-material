import { argbFromHex } from "@material/material-color-utilities";

import { Scheme } from "./scheme";

export function createSchemeFromColor(color: string, isDark: boolean) {
  return Scheme[isDark ? "dark" : "light"](argbFromHex(color));
}
