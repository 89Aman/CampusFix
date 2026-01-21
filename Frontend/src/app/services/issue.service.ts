import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Issue {
    id: number;
    description: string;
    location: string;
    image_url?: string;
    status: string;
    upvotes: number;
    created_at: string;
    user_id?: string;
    reporter_name?: string;
    reporter_email?: string;
}

@Injectable({
    providedIn: 'root'
})
export class IssueService {
    private apiUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) { }

    reportIssue(formData: FormData): Observable<Issue> {
        return this.http.post<Issue>(`${this.apiUrl}/issues`, formData);
    }

    getIssues(): Observable<Issue[]> {
        return this.http.get<Issue[]>(`${this.apiUrl}/issues`);
    }

    upvoteIssue(issueId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/issues/${issueId}/upvote`, {});
    }

    updateIssueStatus(issueId: number, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/issues/${issueId}/status`, { status });
    }

    getAnalytics(): Observable<any> {
        return this.http.get(`${this.apiUrl}/analytics`);
    }
}
