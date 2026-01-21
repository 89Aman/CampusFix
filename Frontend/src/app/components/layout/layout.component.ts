import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, CommonModule],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent {
    isDarkMode = true;
    user$;

    constructor(private authService: AuthService) {
        this.user$ = this.authService.currentUser$;
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
    }

    logout() {
        this.authService.logout();
    }
}
