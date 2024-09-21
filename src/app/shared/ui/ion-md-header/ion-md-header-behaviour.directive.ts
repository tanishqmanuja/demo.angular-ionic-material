import {
  ContentChild,
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  RendererStyleFlags2,
} from "@angular/core";
import { IonContent } from "@ionic/angular";
import { IonTitle, ScrollDetail } from "@ionic/angular/standalone";

import { rxState } from "@rx-angular/state";
import { rxEffects } from "@rx-angular/state/effects";
import { distinctUntilChanged, fromEvent, map, of, switchMap } from "rxjs";

import { IonMdHeadlineComponent } from "./ion-md-headline.component";

type Size = "small" | "medium" | "large";
type State = {
  size: Size;
  isScrolled: boolean;
  opacity: number;
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "ion-header[md-behaviour]",
  standalone: true,
  host: {
    class: "ion-no-border",
  },
})
export class IonMdHeaderBehaviourDirective implements OnInit, OnDestroy {
  @ContentChild(IonTitle, { static: true, read: ElementRef })
  private readonly titleElRef!: ElementRef<HTMLElement>;

  @Input()
  headlineRef?: IonMdHeadlineComponent;

  @Input()
  set size(size: Size) {
    this.state$.set({ size });
  }

  private readonly state$ = rxState<State>(({ set }) => {
    set({ isScrolled: false, opacity: 1 });
  });
  private readonly effects = rxEffects();

  private renderer = inject(Renderer2);
  private elRef = inject(ElementRef);

  ngOnInit() {
    const content = this.getIonContentElement();

    this.effects.register(this.state$.select("opacity"), o =>
      this.setTitleOpacity(o),
    );

    this.effects.register(this.state$.select("isScrolled"), s =>
      this.setScrolledState(s),
    );

    if (!content) {
      console.warn("[ION-MD-HEADER-BEHAVIOUR] No ion-content found!");
      return;
    }

    content.scrollEvents = true;

    const isScrolled$ = fromEvent<CustomEvent<ScrollDetail>>(
      content,
      "ionScroll",
    ).pipe(
      map(ev => {
        const intersectionRatio =
          1 +
          (ev.detail.scrollTop - this.elRef.nativeElement.offsetHeight) /
            this.elRef.nativeElement.offsetHeight;
        return intersectionRatio > 0.5;
      }),
      distinctUntilChanged(),
    );

    this.state$.connect("isScrolled", isScrolled$);

    if (!this.headlineRef) {
      return;
    }

    this.setupTitleForOpacityChanges();

    this.headlineRef.state$.connect("size", this.state$.select("size"));

    this.state$.connect(
      "opacity",
      this.state$
        .select("size")
        .pipe(
          switchMap(s =>
            s === "small"
              ? of(1)
              : this.headlineRef!.opacity$.pipe(map(o => 1 - o)),
          ),
        ),
    );
  }

  ngOnDestroy(): void {
    const content = this.getIonContentElement();

    if (content) {
      content.scrollEvents = false;
    }
  }

  private getIonContentElement(): HTMLElement & IonContent {
    return this.elRef.nativeElement.parentElement.querySelector(
      ":scope > ion-content",
    );
  }

  private setScrolledState(isScrolled: boolean) {
    this.renderer.setAttribute(
      this.elRef.nativeElement,
      "data-scrolled",
      isScrolled ? "true" : "false",
    );
  }

  private setupTitleForOpacityChanges() {
    this.renderer.setStyle(
      this.titleElRef.nativeElement,
      "transition",
      "opacity 200ms ease-in-out",
      RendererStyleFlags2.DashCase,
    );

    this.renderer.setStyle(
      this.titleElRef.nativeElement,
      "will-change",
      "opacity",
      RendererStyleFlags2.DashCase,
    );
  }

  private setTitleOpacity(opacity: number) {
    this.renderer.setStyle(
      this.titleElRef.nativeElement,
      "opacity",
      opacity,
      RendererStyleFlags2.DashCase,
    );
  }
}
