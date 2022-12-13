import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withRouterConfig } from "@angular/router";
import { LocalInterceptorFn } from "@app/interceptor";
import routes from "@app/router";
import { DestroyService } from "@app/services/destroy-service";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";
import "./polyfills";

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: "reload",
      })
    ),
    provideHttpClient(withInterceptors([LocalInterceptorFn])),
    DestroyService,
  ],
});
