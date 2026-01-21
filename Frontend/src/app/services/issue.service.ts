import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Issue {
    id: number;
    description: string;
    location: string;
    image_url: string | null;
    category: string;
    severity: string;
    summary: string | null;
    upvotes: number;
    priority_score: float;
    status: 'New' | 'Open' | 'In Progress' | 'Resolved';
    created_at: string;
}

// Alias for float in TS
type float = number;

@Injectable({
    providedIn: 'root'
})
export class IssueService {
    private apiUrl = 'http://localhost:8000'; // Adjust if backend port changes
    private issuesSubject = new BehaviorSubject<Issue[]>([]);
    public issues$ = this.issuesSubject.asObservable();

    constructor(private http: HttpClient) {
        // Initial fetch
        this.refreshIssues();
    }

    refreshIssues() {
        this.http.get<Issue[]>(`${this.apiUrl}/issues?sort_by=newest`).subscribe({
            next: (data) => this.issuesSubject.next(data),
            error: (err) => console.error('Failed to fetch issues', err)
        });
    }

    reportIssue(formData: FormData): Observable<Issue> {
        return this.http.post<Issue>(`${this.apiUrl}/issues`, formData).pipe(
            tap(() => this.refreshIssues())
        );
    }

    upvoteIssue(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/issues/${id}/upvote`, {}).pipe(
            tap(() => this.refreshIssues())
        );
    }
}
