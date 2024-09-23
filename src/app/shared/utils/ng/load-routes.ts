import { Routes } from "@angular/router";

export function loadRoutes(base: string, routes: Routes): Routes {
  for (const route of routes) {
    if (route.path == "") {
      route.path = base;

      if (route.redirectTo) {
        route.redirectTo = base + "/" + route.redirectTo;
      }

      continue;
    }

    route.path = base + "/" + route.path;
  }

  return routes;
}
