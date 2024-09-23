import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withPreloading,
  withViewTransitions,
} from "@angular/router";
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from "@ionic/angular/standalone";
import { Capacitor } from "@capacitor/core";

import { SystemColors } from "@tqman/capacitor-system-colors";

import { routes } from "./app.routes";
import { provideTheme } from "./shared/providers/theme.provider";

export const appConfig: ApplicationConfig = {
  providers: [
    provideTheme({
      color:
        Capacitor.getPlatform() === "android" &&
        SystemColors.get({ id: "system_accent1_500" }).then(
          ({ color }) => color,
        ),
    }),
    provideIonicAngular(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(
      routes,
      withViewTransitions({ skipInitialTransition: true }),
      withPreloading(PreloadAllModules),
    ),
    provideAnimationsAsync(),
    provideExperimentalZonelessChangeDetection(),
  ],
};
