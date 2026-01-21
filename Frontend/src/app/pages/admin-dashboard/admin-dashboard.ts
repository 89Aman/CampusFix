import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService, Issue } from '../../services/issue.service';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, GoogleChartsModule],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
    issues: Issue[] = [];
    analytics: any = null;
    isLoading = true;

    // Google Chart Configuration
    chartTitle = 'Status Distribution';
    chartType = ChartType.PieChart;
    chartData: any[] = [
        ['Pending', 1],
        ['In Progress', 1],
        ['Resolved', 1]
    ];
    chartOptions = {
        pieHole: 0.4,
        backgroundColor: 'transparent',
        legend: {
            position: 'right',
            textStyle: { color: this.isDarkMode() ? '#cbd5e1' : '#334155' }
        },
        slices: {
            0: { color: '#eab308' }, // Pending - Yellow
            1: { color: '#3b82f6' }, // In Progress - Blue
            2: { color: '#22c55e' }  // Resolved - Green
        },
        chartArea: { width: '90%', height: '90%' }
    };

    constructor(private issueService: IssueService) { }

    ngOnInit() {
        this.loadData();
    }

    isDarkMode(): boolean {
        return document.documentElement.classList.contains('dark');
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
        this.chartData = [
            ['Pending', analytics.pending || 0],
            ['In Progress', analytics.in_progress || 0],
            ['Resolved', analytics.resolved || 0]
        ];
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
