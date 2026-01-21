import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService, Issue } from '../../services/issue.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
    issues: Issue[] = [];
    analytics: any = null;
    isLoading = true;

    // Chart Configuration
    public doughnutChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#334155'
                }
            }
        }
    };
    public doughnutChartLabels: string[] = ['Pending', 'In Progress', 'Resolved'];
    public doughnutChartData: ChartData<'doughnut'> = {
        labels: this.doughnutChartLabels,
        datasets: [
            {
                data: [0, 0, 0],
                backgroundColor: ['#eab308', '#3b82f6', '#22c55e'],
                hoverBackgroundColor: ['#ca8a04', '#2563eb', '#16a34a'],
                hoverOffset: 4
            }
        ]
    };
    public doughnutChartType: ChartType = 'doughnut';

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
            next: (data) => {
                this.analytics = data;
                this.updateChartData(data);
            },
            error: (err) => console.error('Failed to load analytics', err)
        });
    }

    updateChartData(analytics: any) {
        this.doughnutChartData = {
            ...this.doughnutChartData,
            datasets: [{
                ...this.doughnutChartData.datasets[0],
                data: [
                    analytics.pending || 0,
                    analytics.in_progress || 0,
                    analytics.resolved || 0
                ]
            }]
        };
    }

    updateStatus(issueId: number, status: string) {
        this.issueService.updateIssueStatus(issueId, status).subscribe({
            next: () => {
                const issue = this.issues.find(i => i.id === issueId);
                if (issue) {
                    issue.status = status;
                }
                // Reload analytics to update chart
                this.issueService.getAnalytics().subscribe(data => {
                    this.analytics = data;
                    this.updateChartData(data);
                });
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
