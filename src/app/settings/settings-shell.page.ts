import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from "@angular/router";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  Platform,
} from "@ionic/angular/standalone";

import { tap } from "rxjs";

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
    IonRouterOutlet,
  ],
  template: `
    @let f = fragment();

    <ion-header md-behaviour [headlineRef]="headline" size="large">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            [routerLink]="router.createUrlTree(['..'], { relativeTo: f.route })"
            [defaultHref]="
              router.createUrlTree(['..'], { relativeTo: f.route })
            "
          ></ion-back-button>
          <ion-title>
            {{ f.title }}
          </ion-title>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-md-headline
        #headline
        [style.view-transition-name]="'settings-page-headline'"
      >
        {{ f.title }}
      </ion-md-headline>
      <router-outlet />
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar> </ion-toolbar>
    </ion-footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsShellPage implements AfterViewInit {
  private outlet = viewChild.required(RouterOutlet);

  protected router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private destroyRef = inject(DestroyRef);

  private activeComponent = signal<unknown | null>(null);

  fragment = computed(() => {
    const outlet = this.outlet();
    const component = this.activeComponent();

    return {
      title: SettingsFragment.isValid(component)
        ? component.title
        : DEFAULT_TITLE,
      route: outlet.isActivated ? outlet.activatedRoute : this.activatedRoute,
    };
  });

  constructor() {
    const platform = inject(Platform);

    effect(onCleanup => {
      const subscription = platform.backButton.subscribeWithPriority(0, () => {
        this.router.navigate([".."], {
          relativeTo: this.outlet().activatedRoute,
        });
      });

      onCleanup(() => {
        subscription.unsubscribe();
      });
    });
  }

  ngAfterViewInit() {
    this.outlet()
      .activateEvents.pipe(
        tap(c => {
          this.activeComponent.set(c);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
