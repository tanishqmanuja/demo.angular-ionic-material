import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideIonicAngular } from "@ionic/angular/standalone";

import { routes } from "./app.routes";
import { provideTheme } from "./shared/providers/theme.provider";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideIonicAngular({}),
    provideTheme(),
  ],
};
