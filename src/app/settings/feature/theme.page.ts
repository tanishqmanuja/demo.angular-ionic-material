import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { MdSwitch } from "@material/web/switch/switch";
import { MdIconComponent } from "@tqman/ngx-material/icon";
import { MdListComponent, MdListItemComponent } from "@tqman/ngx-material/list";
import { MdSwitchComponent } from "@tqman/ngx-material/switch";

import { ThemeService } from "~/shared/services/theme.service";
import { ColorScheme } from "~/shared/utils/color-scheme/user-color-scheme";
import { SettingsFragment } from "../settings.fragment";

@Component({
  selector: "app-theme",
  standalone: true,
  imports: [
    MdListComponent,
    MdListItemComponent,
    MdIconComponent,
    MdSwitchComponent,
  ],
  template: `
    @let vm = viewmodel();

    <md-list>
      <md-list-item>
        <md-icon slot="start">color_lens</md-icon>
        <div slot="headline">Follow System Theme</div>
        <div slot="supporting-text">Detect and use system theme.</div>
        <md-switch
          slot="end"
          showOnlySelectedIcon
          [selected]="vm.isAuto"
          (change)="changeFollowSystem($event)"
        />
      </md-list-item>

      <md-list-item>
        <md-icon slot="start" filled>{{ vm.icon }}</md-icon>
        <div slot="headline">Use Dark Theme</div>
        <div slot="supporting-text">{{ vm.supportingText }}</div>
        <md-switch
          slot="end"
          [selected]="isDark()"
          (change)="toggleTheme()"
          [disabled]="vm.isAuto"
        />
      </md-list-item>
    </md-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ThemePage implements SettingsFragment {
  public title = "Theme";

  protected readonly themeService = inject(ThemeService);
  protected readonly colorScheme = toSignal(this.themeService.colorScheme$, {
    requireSync: true,
  });
  protected readonly isDark = toSignal(this.themeService.isDark$, {
    requireSync: true,
  });

  protected readonly viewmodel = computed(() => {
    const scheme = this.colorScheme();

    return {
      icon: this.getIcon(scheme),
      supportingText: this.getSupportingText(scheme),
      isAuto: scheme === ColorScheme.AUTO,
    };
  });

  private getIcon(colorScheme: ColorScheme): string {
    switch (colorScheme) {
      case ColorScheme.AUTO: {
        return "brightness_medium";
      }
      case ColorScheme.DARK: {
        return "dark_mode";
      }
      case ColorScheme.LIGHT: {
        return "light_mode";
      }
    }
  }

  private getSupportingText(colorScheme: ColorScheme): string {
    return colorScheme === ColorScheme.AUTO
      ? "Following system theme."
      : `Forcing ${colorScheme === ColorScheme.DARK ? "dark" : "light"} theme.`;
  }

  changeFollowSystem(ev: Event) {
    const value = (ev.target as MdSwitch).selected;
    const isDarkMode = this.isDark();
    this.themeService.colorScheme$.set(
      value
        ? ColorScheme.AUTO
        : isDarkMode
          ? ColorScheme.DARK
          : ColorScheme.LIGHT,
    );
  }

  toggleTheme() {
    const isDarkMode = this.isDark();
    this.themeService.colorScheme$.set(
      isDarkMode ? ColorScheme.LIGHT : ColorScheme.DARK,
    );
  }
}
