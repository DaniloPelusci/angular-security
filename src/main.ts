import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {JwtInterceptor} from './app/auth/interceptors/jwt.service';
import {routes} from './app/app.routes';
import {provideRouter} from '@angular/router'; // ajuste o caminho

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    provideRouter(routes)
  ]
});
