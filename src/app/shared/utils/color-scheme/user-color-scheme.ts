import { BehaviorSubject } from "rxjs";

const USER_COLOR_SCHEME_STORAGE_KEY = "user-color-scheme";

export const ColorScheme = {
  DARK: "dark",
  LIGHT: "light",
  AUTO: "auto",
} as const;

export type ColorScheme = (typeof ColorScheme)[keyof typeof ColorScheme];

function parseColorScheme(colorScheme: string | null | undefined): ColorScheme {
  if (colorScheme === ColorScheme.DARK || colorScheme === ColorScheme.LIGHT) {
    return colorScheme;
  }

  return ColorScheme.AUTO;
}

const _userColorScheme$ = new BehaviorSubject<ColorScheme>(
  parseColorScheme(localStorage.getItem(USER_COLOR_SCHEME_STORAGE_KEY)),
);

function setUserColorScheme(colorScheme: ColorScheme) {
  localStorage.setItem(USER_COLOR_SCHEME_STORAGE_KEY, colorScheme);
  _userColorScheme$.next(colorScheme);
}

export function userColorScheme$() {
  return Object.assign(_userColorScheme$.asObservable(), {
    get: () => _userColorScheme$.value,
    set: setUserColorScheme,
  });
}
