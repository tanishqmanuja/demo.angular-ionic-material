import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "view-like-mobile",
  standalone: true,
  template: `
    <div class="mobile">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    ::ng-deep {
      @media (min-width: 768px) {
        html.plt-desktop {
          body {
            position: relative;
            min-height: fit-content;
            display: grid;
            place-items: center;
            overflow-y: auto;
            padding: 12px;
            background-color: #fbfefb;

            @media (prefers-color-scheme: dark) {
              background-color: #1a1a1a;
            }
          }

          ion-content::part(scroll) {
            scrollbar-width: thin;
            scrollbar-color: color-mix(
                in lch,
                var(--md-sys-color-outline),
                transparent
              )
              transparent;
          }
        }
      }
    }

    @media (min-width: 768px) {
      :host-context(html.plt-desktop) {
        --_padding: 10px;
        --_border-radius: 18px;

        display: block;
        width: 100%;
        padding: var(--_padding);
        border-radius: var(--_border-radius);

        background-color: var(--md-sys-color-outline);

        .mobile {
          position: relative;
          overflow: hidden;
          border-radius: calc(var(--_border-radius) - var(--_padding));
          width: 375px;
          height: 812px;
          user-select: none;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ViewLikeMobile {}
