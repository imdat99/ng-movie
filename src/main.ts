import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { LocalInterceptorFn } from '@app/interceptor';
import routes from '@app/router';
import '@app/styles/main.scss';
import { AppComponent } from './app/app.component';
import './polyfills';

if (import.meta.env.PROD) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([LocalInterceptorFn])),
  ],
});
