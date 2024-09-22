import {
  APP_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  Provider,
} from "@angular/core";

import { ThemeService } from "../services/theme.service";

export type ThemeProviderOptions = {
  /**
   * The source color of the theme.
   */
  color?: string | Promise<string>;
};

export function provideTheme(
  opts: ThemeProviderOptions = {},
): EnvironmentProviders {
  const providers: Provider[] = [];

  providers.push({
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: () => {
      const color = opts.color;
      const themeService = inject(ThemeService);

      if (!color) {
        return () => themeService.init();
      }

      if (color instanceof Promise) {
        return () =>
          color
            .then(color => {
              themeService.sourceColor$.next(color);
              themeService.init();
            })
            .catch(() => themeService.init());
      }

      return () => {
        themeService.sourceColor$.next(color);
        themeService.init();
      };
    },
  });

  return makeEnvironmentProviders(providers);
}
