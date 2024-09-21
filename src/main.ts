import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

/* Schedule Application Bootstrap to reduce Total Blocking Time (TBT)*/
setTimeout(() =>
  bootstrapApplication(AppComponent, appConfig).catch(err =>
    console.error(err),
  ),
);
