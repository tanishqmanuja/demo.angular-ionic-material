import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";

import { IonMdHeaderBehaviourDirective } from "../shared/ui/ion-md-header/ion-md-header-behaviour.directive";
import { IonMdHeadlineComponent } from "../shared/ui/ion-md-header/ion-md-headline.component";
import { SettingsFragment } from "./settings.fragment";

const DEFAULT_TITLE = "Settings";

@Component({
  selector: "app-settings-shell",
  standalone: true,
  imports: [
    RouterLink,
    IonHeader,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    RouterOutlet,
    IonMdHeadlineComponent,
    IonMdHeaderBehaviourDirective,
  ],
  template: `
    <ion-header md-behaviour [headlineRef]="headline" size="large">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            [routerLink]="backLink()"
            [defaultHref]="backLink()"
          ></ion-back-button>
          <ion-title>
            {{ title() }}
          </ion-title>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-md-headline
        #headline
        [style.view-transition-name]="'settings-page-headline'"
      >
        {{ title() }}
      </ion-md-headline>
      <router-outlet (activate)="onActivate($event)" />
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar> </ion-toolbar>
    </ion-footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsShellPage {
  title = signal(DEFAULT_TITLE);
  backLink = computed(() =>
    this.title() === DEFAULT_TITLE ? "/" : "/settings",
  );

  onActivate(component: unknown) {
    if (SettingsFragment.isValid(component)) {
      this.title.set(component.title);
    } else {
      this.title.set(DEFAULT_TITLE);
    }
  }
}
