import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./home/home.page"),
  },
  {
    path: "settings",
    loadComponent: () => import("./settings/settings-shell.page"),
    loadChildren: () => import("./settings/settings.routes"),
  },
];
