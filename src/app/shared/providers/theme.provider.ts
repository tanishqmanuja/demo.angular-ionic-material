import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
} from "@angular/core";

import { ThemeService } from "../services/theme.service";

export type ThemeProviderOptions = {
  /**
   * The source color of the theme.
   */
  color?: string | Promise<string> | false | null;
};

export function provideTheme(
  opts: ThemeProviderOptions = {},
): EnvironmentProviders {
  return provideAppInitializer(() => {
    const init = ((themeService: ThemeService) => {
      const color = opts.color;

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
    })(inject(ThemeService));

    return init();
  });
}
