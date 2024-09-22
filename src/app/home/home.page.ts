import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";

import { IonMdHeaderBehaviourDirective } from "../shared/ui/ion-md-header/ion-md-header-behaviour.directive";
import { IonMdHeadlineComponent } from "../shared/ui/ion-md-header/ion-md-headline.component";

@Component({
  selector: "app-home",
  standalone: true,
  templateUrl: "home.page.html",
  styles: ``,
  imports: [
    IonHeader,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonMdHeadlineComponent,
    IonMdHeaderBehaviourDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {}
