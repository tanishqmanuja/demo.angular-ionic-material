import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IonContent } from "@ionic/angular/standalone";

import { rxState } from "@rx-angular/state";
import { RxIf } from "@rx-angular/template/if";
import { RxPush } from "@rx-angular/template/push";
import { filter, map, switchMap, takeUntil, tap, withLatestFrom } from "rxjs";

import { getIntersectionRatioY } from "../../utils/intersection";
import { fromIntersectionObserver } from "../../utils/intersection/observer";

const FALLBACK_HEADER_HEIGHT = 64;

type Size = "small" | "medium" | "large";
type State = {
  opacity: number;
  size: Size;
  isCollapsed: boolean;
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "ion-md-headline",
  standalone: true,
  imports: [NgClass, RxPush, RxIf],
  template: `<ng-container *rxIf="isEnabled$; strategy: 'local'">
    <div
      class="wrapper"
      [ngClass]="[size$ | push: 'local']"
      [style.opacity]="opacity$ | push: 'local'"
    >
      <span class="title"><ng-content></ng-content></span>
    </div>
  </ng-container>`,
  styles: [
    `
      :host {
        transition: opacity 200ms ease-in-out;
        will-change: opacity;
      }
      .wrapper {
        min-height: 64px;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        margin-top: calc(0px - var(--padding-top, 0) - var(--offset-top, 0));

        padding-inline: calc(16px - var(--padding-start, 0));
        padding-bottom: 24px;

        font: var(--md-sys-typescale-headline-small);

        &.large {
          min-height: 88px;

          padding-bottom: 28px;

          font: var(--md-sys-typescale-headline-medium);
        }
      }

      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IonMdHeadlineComponent implements OnInit {
  private readonly elRef = inject(ElementRef);
  private readonly content = inject(IonContent, { host: true });
  private readonly contentElRef = inject(ElementRef, { skipSelf: true });
  private readonly destroyRef = inject(DestroyRef);

  readonly state$ = rxState<State>(({ set }) => {
    set({
      opacity: 1,
      isCollapsed: false,
    });
  });
  readonly size$ = this.state$.select("size");
  readonly opacity$ = this.state$.select("opacity");
  readonly isEnabled$ = this.state$
    .select("size")
    .pipe(map(s => s !== "small"));

  async ngOnInit() {
    const getHeaderHeight = () => {
      const h = this.contentElRef.nativeElement.offsetTop;
      return h > 0 ? h : FALLBACK_HEADER_HEIGHT;
    };

    this.content.ionScrollStart
      .pipe(
        withLatestFrom(this.isEnabled$),
        filter(([, enabled]) => enabled),
        switchMap(() =>
          fromIntersectionObserver(this.elRef.nativeElement, {
            threshold: [0, 0.2, 0.3, 0.5, 0.7, 0.9, 1],
            rootMargin: `-${getHeaderHeight()}px 0px 0px 0px`,
          }).pipe(
            tap(entry => {
              this.state$.set({ opacity: entry.intersectionRatio });
            }),
            takeUntil(
              this.content.ionScrollEnd.pipe(
                withLatestFrom(this.state$.select("isCollapsed")),
                switchMap(async ([, isCollapsed]) => {
                  const TIMING_FACTOR = 350;

                  const intersectionRatio = getIntersectionRatioY(
                    this.contentElRef.nativeElement,
                    this.elRef.nativeElement,
                  );
                  const intersectionRatioInverted = 1 - intersectionRatio;

                  if (intersectionRatio === 1 || intersectionRatio === 0) {
                    this.state$.set({
                      opacity: intersectionRatio,
                      isCollapsed: !intersectionRatio,
                    });
                  } else if (
                    (isCollapsed && intersectionRatio < 0.4) ||
                    (!isCollapsed && intersectionRatio < 0.7)
                  ) {
                    await this.collapse(
                      isCollapsed
                        ? intersectionRatio
                        : intersectionRatioInverted * TIMING_FACTOR,
                    );
                  } else {
                    await this.expand(
                      isCollapsed
                        ? intersectionRatioInverted * TIMING_FACTOR
                        : intersectionRatio,
                    );
                  }
                }),
              ),
            ),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private async collapse(scrollDuration?: number) {
    this.state$.set({ opacity: 0 });

    if (scrollDuration) {
      await this.content.scrollToPoint(
        0,
        this.elRef.nativeElement.offsetHeight,
        scrollDuration,
      );
    }

    this.state$.set({ isCollapsed: true });
  }

  private async expand(scrollDuration?: number) {
    this.state$.set({ opacity: 1 });

    if (scrollDuration) {
      await this.content.scrollToTop(scrollDuration);
    }

    this.state$.set({ isCollapsed: false });
  }
}
