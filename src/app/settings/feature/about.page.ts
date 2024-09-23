import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { isPlatform } from "@ionic/angular/standalone";
import { App } from "@capacitor/app";

import { MdIconComponent } from "@tqman/ngx-material/icon";
import { MdListComponent, MdListItemComponent } from "@tqman/ngx-material/list";

import { environment } from "../../../environments/environment";
import { SettingsFragment } from "../settings.fragment";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [MdListComponent, MdListItemComponent, MdIconComponent],
  template: `
    <md-list>
      <md-list-item>
        <md-icon slot="start">family_history</md-icon>
        <div slot="headline">Version</div>
        <div slot="supporting-text">{{ VERSION() }}</div>
      </md-list-item>
    </md-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutPage implements SettingsFragment {
  public title = "About";

  protected VERSION = signal(
    `${environment.VERSION}.${environment.production ? "prod" : "dev"}`,
  );

  constructor() {
    if (isPlatform("capacitor")) {
      App.getInfo().then(({ version }) => {
        if (version.toLowerCase().includes("debug")) {
          this.VERSION.update(v => `${v} - DEBUG`);
        } else {
          this.VERSION.update(v => `${v} - RELEASE`);
        }
      });
    }
  }
}
