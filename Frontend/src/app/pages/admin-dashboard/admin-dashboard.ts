import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService, Issue } from '../../services/issue.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
    issues: Issue[] = [];
    analytics: any = null;
    isLoading = true;

    constructor(private issueService: IssueService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        this.issueService.getIssues().subscribe({
            next: (data) => {
                this.issues = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load issues', err);
                this.isLoading = false;
            }
        });

        this.issueService.getAnalytics().subscribe({
            next: (data) => this.analytics = data,
            error: (err) => console.error('Failed to load analytics', err)
        });
    }

    updateStatus(issueId: number, status: string) {
        this.issueService.updateIssueStatus(issueId, status).subscribe({
            next: () => {
                const issue = this.issues.find(i => i.id === issueId);
                if (issue) {
                    issue.status = status;
                }
                alert('Status updated successfully');
                this.loadData();
            },
            error: (err) => {
                console.error('Status update failed', err);
                alert('Failed to update status');
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
            case 'resolved': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
        }
    }
}
