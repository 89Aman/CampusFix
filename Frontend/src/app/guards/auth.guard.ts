import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.currentUser$.pipe(
        // We might need a way to distinguish "initial null" vs "not logged in null"
        // For now, let's assume if it is null, we try to check session or it failed.
        // simpler approach: The auth service tries to load immediately. 
        // We can just filter out the initial state if we had a loading flag, 
        // but here we will just tap.

        // Actually, creating a simpler flow:
        // If we rely on the backend cookie, we can make a request to check validity.
        // AuthGuard can explicitly call a check or just rely on the observable.

        // Let's assume the user is valid if the observable emits a user. 
        // If it emits null, we redirect. 
        // Use `skip(0)`? No.

        map(user => {
            if (user) {
                return true;
            } else {
                return router.parseUrl('/login');
            }
        })
    );
};
