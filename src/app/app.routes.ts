import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./cart/feature/cart.page"),
  },
  {
    path: "settings",
    loadComponent: () => import("./settings/settings-shell.page"),
    loadChildren: () => import("./settings/settings.routes"),
  },
];
