import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DEFAULT_CURRENCY_CODE,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";

import { MdFabComponent } from "@tqman/ngx-material/fab";
import { MdIconComponent } from "@tqman/ngx-material/icon";
import { MdIconButtonComponent } from "@tqman/ngx-material/iconbutton";
import { MdLinearProgressComponent } from "@tqman/ngx-material/progress";
import { nanoid } from "nanoid";

import { IonMdHeaderBehaviourDirective } from "~/shared/ui/ion-md-header/ion-md-header-behaviour.directive";
import { IonMdHeadlineComponent } from "~/shared/ui/ion-md-header/ion-md-headline.component";
import { CartItem, CartService } from "../data-access/cart.service";
import { getRandomProduct } from "../data-access/products";
import { CartItemComponent } from "../ui/cart-item/cart-item.component";

@Component({
  selector: "app-cart",
  standalone: true,
  templateUrl: "cart.page.html",
  styleUrls: ["cart.page.scss"],
  providers: [{ provide: DEFAULT_CURRENCY_CODE, useValue: "Φ " }],
  imports: [
    RouterLink,
    CurrencyPipe,
    IonHeader,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButtons,
    MdIconComponent,
    MdFabComponent,
    MdIconButtonComponent,
    MdLinearProgressComponent,
    IonMdHeadlineComponent,
    IonMdHeaderBehaviourDirective,
    CartItemComponent,
  ],
  animations: [
    /* ref: https://github.com/mhartington/view-transitions-talk */
    trigger("listAnimation", [
      transition(":increment", [
        group([
          query("app-cart-item:enter", [
            style({
              transform: "translate3d(0, calc(-100% + 1px), 0)",
              "z-index": -1,
            }),
            animate(
              "200ms ease-out",
              style({ transform: "translate3d(0, 0, 0)" }),
            ),
          ]),
        ]),
      ]),
      transition(":decrement", [
        group([
          query(
            "app-cart-item:leave",
            [animate("100ms ease-out", style({ opacity: 0 }))],
            { optional: true },
          ),
          query(
            "app-cart-item:leave ~ app-cart-item:not(:leave)",
            [
              animate(
                "200ms ease-out",
                style({ transform: "translate3d(0, calc(-100% + 1px), 0)" }),
              ),
            ],
            { optional: true },
          ),
        ]),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  cartService = inject(CartService);

  isLoading = signal(false);
  isEmpty = computed(() => {
    const items = this.cartService.items();
    return items.length === 0;
  });

  addRandomItem() {
    this.cartService.addItem(generateRandomItem());
  }
}

function generateRandomItem(): CartItem {
  return {
    id: nanoid(),
    pid: getRandomProduct().id,
    quantity: Math.floor(Math.random() * 10),
  };
}
