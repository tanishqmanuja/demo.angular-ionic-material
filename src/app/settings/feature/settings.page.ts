import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { MdIconComponent } from "@tqman/ngx-material/icon";
import { MdListComponent, MdListItemComponent } from "@tqman/ngx-material/list";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [RouterLink, MdIconComponent, MdListComponent, MdListItemComponent],
  template: `
    <md-list>
      <md-list-item routerLink="/settings/theme">
        <md-icon slot="start" filled>palette</md-icon>
        <div slot="headline">Theme</div>
        <div slot="supporting-text">Color and themes.</div>
      </md-list-item>

      <md-list-item routerLink="/settings/about">
        <md-icon slot="start" filled>info</md-icon>
        <div slot="headline">About</div>
        <div slot="supporting-text">Version, developer etc.</div>
      </md-list-item>
    </md-list>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsPage {}
