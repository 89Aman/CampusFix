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
