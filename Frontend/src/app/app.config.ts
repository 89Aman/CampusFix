import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { AuthService } from './services/auth.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([credentialsInterceptor])),
        {
            provide: APP_INITIALIZER,
            useFactory: (authService: AuthService) => () => authService.initialize(),
            deps: [AuthService],
            multi: true
        }
    ]
};
