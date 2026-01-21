import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { switchMap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
    isDarkMode = true;
    user$!: Observable<any>;
    isAdmin$!: Observable<boolean>;

    constructor(private authService: AuthService, private router: Router) {
        // Initialize observables in constructor after authService is injected
        this.user$ = this.authService.currentUser$;
        this.isAdmin$ = this.authService.currentUser$.pipe(
            switchMap(user => user ? this.authService.isAdmin() : of({ is_admin: false })),
            map(response => response.is_admin)
        );
    }

    ngOnInit() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
