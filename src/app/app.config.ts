import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideIonicAngular } from "@ionic/angular/standalone";
import { Capacitor } from "@capacitor/core";

import { SystemColors } from "@tqman/capacitor-system-colors";

import { routes } from "./app.routes";
import { provideTheme } from "./shared/providers/theme.provider";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideIonicAngular({}),
    provideTheme({
      color:
        Capacitor.getPlatform() === "android" &&
        SystemColors.get({ id: "system_accent1_500" }).then(
          ({ color }) => color,
        ),
    }),
  ],
};
