import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SafetyReport {
    id: number;
    description: string;
    location: string;
    media_url?: string;
    is_nsfw: boolean;
    created_at: string;
    status: string;
    is_critical: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SafetyService {
    private apiUrl = 'http://localhost:8000/safety'; // Use environment variable in real app

    constructor(private http: HttpClient) { }

    reportIncident(description: string, location: string, mediaFile?: File): Observable<SafetyReport> {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('location', location);
        if (mediaFile) {
            formData.append('media', mediaFile);
        }

        return this.http.post<SafetyReport>(`${this.apiUrl}/reports`, formData);
    }

    getReports(): Observable<SafetyReport[]> {
        return this.http.get<SafetyReport[]>(`${this.apiUrl}/reports`);
    }
}
