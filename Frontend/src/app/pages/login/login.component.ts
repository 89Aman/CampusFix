import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    constructor(private authService: AuthService, private router: Router) {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.router.navigate(['/student/submit']);
            }
        });
    }

    loginGoogle() {
        this.authService.loginWithGoogle();
    }

    loginGithub() {
        this.authService.loginWithGithub();
    }
}
