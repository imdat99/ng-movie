import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { LocalInterceptorFn } from '@app/interceptor';
import routes from '@app/router';
import { DestroyService } from '@app/services/destroy-service';
import '@app/styles/main.scss';
import { AppComponent } from './app/app.component';
import './polyfills';

if (import.meta.env.PROD) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    provideHttpClient(withInterceptors([LocalInterceptorFn])),
    DestroyService,
  ],
});
