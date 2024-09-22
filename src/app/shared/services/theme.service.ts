import { Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

import { SafeAreaController } from "@aashu-dubey/capacitor-statusbar-safe-area";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from "rxjs";

import { userPrefersDark$ } from "../utils/color-scheme/prefers-color-scheme";
import {
  ColorScheme,
  userColorScheme$,
} from "../utils/color-scheme/user-color-scheme";
import { createSchemeFromColor } from "../utils/material/helpers";
import { applyIonicTokens } from "../utils/material/tokens/ionic";
import { applyMaterialTokens } from "../utils/material/tokens/material";
import { waitFor } from "../utils/rxjs/wait-for";

const ION_COLOR_PRIMARY = "#428cff";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly init$ = new BehaviorSubject(false);

  readonly prefsDark$ = userPrefersDark$();
  readonly colorScheme$ = userColorScheme$();

  readonly isDark$ = this.colorScheme$.pipe(
    distinctUntilChanged(),
    switchMap(scheme => {
      if (scheme === ColorScheme.AUTO) {
        return this.prefsDark$;
      } else {
        return of(scheme === ColorScheme.DARK);
      }
    }),
  );

  readonly sourceColor$ = new BehaviorSubject(ION_COLOR_PRIMARY);

  constructor() {
    initPlatformStyles();

    combineLatest([this.sourceColor$, this.isDark$], (color, isDark) => ({
      color,
      isDark,
      scheme: createSchemeFromColor(color, isDark),
    }))
      .pipe(
        waitFor(this.init$),
        tap(({ scheme, isDark }) => {
          applyMaterialTokens(scheme);
          applyIonicTokens(scheme);
          applyPlatformStyles(isDark);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  init() {
    if (this.init$.value) {
      console.warn("[THEME SERVICE] Multiple calls to init()");
      return;
    }

    this.init$.next(true);
  }
}

function initPlatformStyles() {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }

  SafeAreaController.injectCSSVariables();
  StatusBar.setOverlaysWebView({ overlay: true });
  NavigationBar.setTransparency({ isTransparent: true });
}
function applyPlatformStyles(isDark: boolean) {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }

  StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
  NavigationBar.getColor().then(({ color }) => {
    NavigationBar.setColor({ color, darkButtons: !isDark });
  });
}
