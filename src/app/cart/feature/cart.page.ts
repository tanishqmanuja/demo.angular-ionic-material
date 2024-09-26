import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";

import { MdIconComponent } from "@tqman/ngx-material/icon";
import { MdIconButtonComponent } from "@tqman/ngx-material/iconbutton";

import { IonMdHeaderBehaviourDirective } from "~/shared/ui/ion-md-header/ion-md-header-behaviour.directive";
import { IonMdHeadlineComponent } from "~/shared/ui/ion-md-header/ion-md-headline.component";

@Component({
  selector: "app-cart",
  standalone: true,
  templateUrl: "cart.page.html",
  styles: `
    ion-header {
      md-icon-button {
        margin-right: 2px;
      }
    }
  `,
  imports: [
    RouterLink,
    IonHeader,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButtons,
    MdIconComponent,
    MdIconButtonComponent,
    IonMdHeadlineComponent,
    IonMdHeaderBehaviourDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {}
