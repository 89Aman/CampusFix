import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { switchMap, map, of } from 'rxjs';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, CommonModule],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
    isDarkMode = true;
    user$ = this.authService.currentUser$;
    isAdmin$ = this.authService.currentUser$.pipe(
        switchMap(user => user ? this.authService.isAdmin() : of({ is_admin: false })),
        map(response => response.is_admin)
    );

    constructor(private authService: AuthService, private router: Router) { }

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
