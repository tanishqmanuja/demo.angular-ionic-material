import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./feature/settings.page"),
  },
  {
    path: "theme",
    loadComponent: () => import("./feature/theme.page"),
  },
  {
    path: "about",
    loadComponent: () => import("./feature/about.page"),
  },
];

export default routes;
