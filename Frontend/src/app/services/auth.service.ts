import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
    sub: string;
    name: string;
    email?: string;
    picture?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/auth';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        console.log('AuthService: Constructor called, loading session...');
        this.loadSession();
    }

    private loadSession() {
        console.log('AuthService: Calling /auth/me...');
        this.http.get<User | null>(`${this.apiUrl}/me`).subscribe({
            next: (user) => {
                console.log('AuthService: Session loaded, user:', user);
                this.currentUserSubject.next(user);
            },
            error: (err) => {
                console.error('AuthService: Session load failed:', err);
                this.currentUserSubject.next(null);
            }
        });
    }

    loginWithGoogle() {
        window.location.href = `${this.apiUrl}/login/google`;
    }

    loginWithGithub() {
        window.location.href = `${this.apiUrl}/login/github`;
    }

    checkSession(): Observable<User | null> {
        return this.http.get<User | null>(`${this.apiUrl}/me`);
    }

    isAdmin(): Observable<{ is_admin: boolean }> {
        return this.http.get<{ is_admin: boolean }>(`${this.apiUrl}/is_admin`);
    }

    logout() {
        this.http.get(`${this.apiUrl}/logout`).subscribe(() => {
            this.currentUserSubject.next(null);
        });
    }
}
