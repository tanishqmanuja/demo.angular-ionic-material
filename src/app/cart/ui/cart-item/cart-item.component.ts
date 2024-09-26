import { CurrencyPipe, TitleCasePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { MdIconComponent } from "@tqman/ngx-material/icon";

import { CartItem } from "~/cart/data-access/cart.service";
import { getProduct, Product } from "~/cart/data-access/products";
import {
  SwiperCardAction,
  SwiperCardComponent,
} from "~/shared/ui/swiper-card/swiper-card.component";

@Component({
  selector: "app-cart-item",
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe, SwiperCardComponent, MdIconComponent],
  template: `
    <swiper-card (action)="onAction($event)" exitOnLeftSwipe exitOnRightSwipe>
      <md-icon slot="icon-left">delete_forever</md-icon>
      <md-icon slot="icon-right">delete_forever</md-icon>

      <div class="card">
        @let i = item();
        @let p = product();

        <div class="title">
          <span class="main">{{ p.name }}</span>
          <span class="variant" [attr.data-type]="p.type">{{
            getTypeIcon(p.type)
          }}</span>
        </div>
        <div class="subtitle">{{ p.type | titlecase }}</div>
        <div class="content">
          <div class="group left">
            <div class="price">
              <md-icon>shoppingmode</md-icon>
              <span>{{ p.price | currency: "" : "symbol" : "1.0-2" }}</span>
            </div>
            <div class="quantity">
              <md-icon>tag</md-icon>
              <span>{{ i.quantity }}</span>
            </div>
          </div>
          <div class="group right">
            <span class="total">{{
              p.price * i.quantity | currency: "" : "symbol" : "1.0-2"
            }}</span>
          </div>
        </div>
      </div>
    </swiper-card>
  `,
  styles: `
    swiper-card {
      --border-radius: 12px;
      --icon-zoom-scale: 1.4;

      --icon-color-left: #c92a2a;
      --icon-background-left: #ff6b6b;

      --icon-color-right: #c92a2a;
      --icon-background-right: #ff6b6b;
    }

    swiper-card:has(.actions[data-state="left"]),
    swiper-card:has(.actions[data-state="right"]) {
      --_variant-translate-y: 100%;
    }

    .card {
      --_padding-card: 12px;
      display: flex;
      flex-direction: column;
      padding: var(--_padding-card);
      background-color: var(--md-sys-color-surface-container-high);
      border-radius: var(--_padding-card);
      overflow: hidden;

      .content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 2px;

        .main {
          font: var(--md-sys-typescale-title-large);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .variant {
          --_extra-padding: 6px;

          margin-top: calc(var(--_padding-card) * -1);
          margin-right: calc(var(--_padding-card) * -1 - var(--_extra-padding));
          height: fit-content;
          font: var(--md-sys-typescale-label-medium);
          padding-block: 6px;
          padding-inline: 10px calc(10px + var(--_extra-padding));
          border-bottom-left-radius: var(--_padding-card);
          color: var(--md-sys-color--on-tertiary-container);
          background-color: var(--md-sys-color-tertiary-container);
          text-transform: uppercase;
          translate: var(--_variant-translate-y, 0) 0;
          transition: translate 200ms var(--_easing-card-bounce);

          &[data-type="sweet"] {
            color: var(--md-sys-color--on-secondary-container);
            background-color: var(--md-sys-color-secondary-container);
          }
        }
      }

      .subtitle {
        font: var(--md-sys-typescale-body-medium);
        color: var(--md-sys-color-on-surface-variant);
        padding-bottom: 2px;
      }

      .group {
        display: flex;
        flex-direction: column;
      }

      .group.left {
        display: flex;
        flex-direction: row;
        gap: 8px;

        font: var(--md-sys-typescale-label-large);

        md-icon {
          font-size: 1em;
          vertical-align: bottom;
          color: var(--md-sys-color-on-secondary-container);
        }

        .price md-icon {
          margin-right: 4px;
        }
      }

      .group.right {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        .total {
          color: var(--md-sys-color-primary);
          font: var(--md-sys-typescale-body-large);
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  item = input.required<CartItem>();
  product = computed(() => getProduct(this.item().pid));

  delete = output<string>();

  onAction(action: SwiperCardAction) {
    if (action.direction === "left") {
      this.delete.emit(this.item().id);
    } else if (action.direction === "right") {
      this.delete.emit(this.item().id);
    }
  }

  getTypeIcon(type: Product["type"]): string {
    switch (type) {
      case "fruit":
        return "🍐";
      case "vegetable":
        return "🍅";
      case "sweet":
        return "🍭";
      default:
        return "✌🏻";
    }
  }
}
