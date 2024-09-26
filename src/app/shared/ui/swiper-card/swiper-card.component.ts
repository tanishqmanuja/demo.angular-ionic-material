import {
  booleanAttribute,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  numberAttribute,
  Output,
  Renderer2,
  viewChild,
} from "@angular/core";
import { GestureController } from "@ionic/angular/standalone";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

import { sleep } from "~/shared/utils/promise";

const DEFAULT_ACTIVATION_THRESHOLD = 0.22;
const BOUNCE_BACK_ANIM_DURATION_MS = 200;

export type SwiperCardConfig = {
  activationThreshold?: number;
  exitOnLeftSwipe?: boolean;
  exitOnRightSwipe?: boolean;
};

export type SwiperCardAction = {
  direction: "left" | "right";
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "swiper-card",
  standalone: true,
  template: ` <div class="actions" #actions>
      <div class="action-left">
        <ng-content select="[slot=icon-left]"></ng-content>
      </div>
      <div class="action-right">
        <ng-content select="[slot=icon-right]"></ng-content>
      </div>
    </div>
    <div class="card" #card><ng-content /></div>`,
  styleUrls: ["swiper-card.component.scss"],
})
export class SwiperCardComponent {
  private renderer = inject(Renderer2);
  private gestureCtrl = inject(GestureController);

  private card = viewChild.required("card", { read: ElementRef });
  private actions = viewChild.required("actions", { read: ElementRef });

  exitOnLeftSwipe = input(false, { transform: booleanAttribute });
  exitOnRightSwipe = input(false, { transform: booleanAttribute });
  activationThreshold = input(DEFAULT_ACTIVATION_THRESHOLD, {
    transform: numberAttribute,
  });

  @Output()
  action = new EventEmitter<SwiperCardAction>();

  constructor() {
    effect(onCleanup => {
      const config: Required<SwiperCardConfig> = {
        activationThreshold: this.activationThreshold(),
        exitOnLeftSwipe: this.exitOnLeftSwipe(),
        exitOnRightSwipe: this.exitOnRightSwipe(),
      };

      const cardEl: HTMLElement = this.card().nativeElement;
      const actionsEl: HTMLElement = this.actions().nativeElement;

      const gesture = this.gestureCtrl.create(
        {
          el: cardEl,
          gestureName: "BIDIRECTIONAL_SWIPE",
          direction: "x",
          threshold: 10,
          disableScroll: true,
          onStart: ev => {
            const cardWidth = cardEl.offsetWidth;
            const swipeThreshold = cardWidth * config.activationThreshold;
            ev.data = { swipeThreshold };

            this.renderer.removeStyle(cardEl, "transition");
          },
          onMove: ev => {
            this.renderer.setStyle(cardEl, "translate", `${ev.deltaX}px 0`);

            if (ev.deltaX === 0) {
              this.renderer.removeAttribute(actionsEl, "data-state");
              return;
            }

            this.renderer.setAttribute(
              actionsEl,
              "data-state",
              ev.deltaX > 0 ? "left" : "right",
            );

            if (ev.deltaX > ev.data.swipeThreshold) {
              if (actionsEl.hasAttribute("data-threshold")) {
                return;
              }

              this.renderer.setAttribute(actionsEl, "data-threshold", "left");
              Haptics.impact({ style: ImpactStyle.Light });
              return;
            }

            if (ev.deltaX < -ev.data.swipeThreshold) {
              if (actionsEl.hasAttribute("data-threshold")) {
                return;
              }

              this.renderer.setAttribute(actionsEl, "data-threshold", "right");
              Haptics.impact({ style: ImpactStyle.Light });
              return;
            }

            this.renderer.removeAttribute(actionsEl, "data-threshold");
          },
          onEnd: ev => {
            const onAnimationEnd = (
              direction?: SwiperCardAction["direction"],
            ) => {
              this.renderer.removeAttribute(actionsEl, "data-threshold");
              this.renderer.removeAttribute(actionsEl, "data-state");
              if (direction) {
                this.action.emit({ direction });
              }
            };

            if (ev.deltaX < -ev.data.swipeThreshold) {
              if (config.exitOnLeftSwipe) {
                const animation = cardEl.animate(
                  [
                    {
                      translate: `-${window.innerWidth}px 0`,
                    },
                  ],
                  {
                    duration: 200,
                    easing: "ease-in-out",
                    fill: "forwards",
                  },
                );

                animation.onfinish = () => {
                  this.renderer.setStyle(actionsEl, "opacity", 0);
                  onAnimationEnd("left");
                };

                return;
              }

              this.renderer.setStyle(
                cardEl,
                "transition",
                `translate ${BOUNCE_BACK_ANIM_DURATION_MS}ms var(--_easing-card-bounce)`,
              );
              this.renderer.removeStyle(cardEl, "translate");
              sleep(BOUNCE_BACK_ANIM_DURATION_MS).then(() => {
                onAnimationEnd("left");
              });
              return;
            }

            if (ev.deltaX > ev.data.swipeThreshold) {
              if (config.exitOnRightSwipe) {
                const animation = cardEl.animate(
                  [
                    {
                      translate: `${window.innerWidth}px 0`,
                    },
                  ],
                  {
                    duration: 200,
                    easing: "ease-in-out",
                    fill: "forwards",
                  },
                );

                animation.onfinish = () => {
                  this.renderer.setStyle(actionsEl, "opacity", 0);
                  onAnimationEnd("right");
                };

                return;
              }

              this.renderer.setStyle(
                cardEl,
                "transition",
                `translate ${BOUNCE_BACK_ANIM_DURATION_MS}ms var(--_easing-card-bounce)`,
              );
              this.renderer.removeStyle(cardEl, "translate");
              sleep(BOUNCE_BACK_ANIM_DURATION_MS).then(() => {
                onAnimationEnd("right");
              });
              return;
            }

            this.renderer.setStyle(
              cardEl,
              "transition",
              "translate 100ms ease-out",
            );
            this.renderer.removeStyle(cardEl, "translate");
            onAnimationEnd();
          },
        },
        true,
      );

      gesture.enable();

      onCleanup(() => {
        gesture.destroy();
      });
    });
  }
}
