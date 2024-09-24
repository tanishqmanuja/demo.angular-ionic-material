import { Component, effect, inject, viewChild } from "@angular/core";
import { IonApp, IonRouterOutlet, Platform } from "@ionic/angular/standalone";
import { App } from "@capacitor/app";

import { ViewLikeMobile } from "./shared/ui/view-like-mobile/view-like-mobile.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [IonApp, IonRouterOutlet, ViewLikeMobile],
  template: `
    <view-like-mobile>
      <ion-app>
        <ion-router-outlet [animated]="false" />
      </ion-app>
    </view-like-mobile>
  `,
  styles: ``,
})
export class AppComponent {
  private platform = inject(Platform);
  private router = viewChild.required(IonRouterOutlet);

  constructor() {
    effect(onCleanup => {
      const router = this.router();
      this.platform
        .ready()
        .then(() =>
          this.platform.backButton.subscribe(() => {
            if (router.canGoBack()) {
              router.pop();
            } else {
              App.exitApp();
            }
          }),
        )
        .then(s => onCleanup(() => s.unsubscribe()));
    });
  }
}
