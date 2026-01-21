import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueService, Issue } from '../../services/issue.service';

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './student-list.html',
    styleUrl: './student-list.css'
})
export class StudentList implements OnInit {
    issues: Issue[] = [];
    isLoading = true;

    constructor(private issueService: IssueService) { }

    ngOnInit() {
        this.loadIssues();
    }

    loadIssues() {
        console.log('Loading issues from backend...');
        this.isLoading = true;

        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (this.isLoading) {
                console.warn('API call timeout, showing empty state');
                this.isLoading = false;
                this.issues = [];
            }
        }, 5000); // 5 second timeout

        this.issueService.getIssues().subscribe({
            next: (data) => {
                clearTimeout(timeout); // Clear timeout on success
                console.log('Issues loaded successfully:', data.length, 'issues');
                this.issues = data;
                this.isLoading = false;
            },
            error: (err) => {
                clearTimeout(timeout); // Clear timeout on error
                console.error('Failed to load issues:', err);
                console.error('Error details:', err.message, err.status);
                this.isLoading = false;
                // Show empty state instead of infinite loading
                this.issues = [];
            }
        });
    }

    upvote(issueId: number) {
        this.issueService.upvoteIssue(issueId).subscribe({
            next: () => {
                const issue = this.issues.find(i => i.id === issueId);
                if (issue) {
                    issue.upvotes++;
                }
            },
            error: (err) => console.error('Upvote failed', err)
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
