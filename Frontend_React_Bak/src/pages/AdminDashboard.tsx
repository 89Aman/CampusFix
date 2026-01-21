import React, { useState } from 'react';
import type { AdminTab, Issue } from '../types';
import { IssueCard } from '../components/IssueCard';
import { Filter } from 'lucide-react';

interface AdminDashboardProps {
    activeTab: AdminTab;
    issues: Issue[];
    onIssueClick: (issue: Issue) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab, issues, onIssueClick }) => {
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const filteredIssues = issues.filter(issue => {
        if (filterCategory && issue.category !== filterCategory) return false;
        if (filterStatus && issue.status !== filterStatus) return false;
        return true;
    });

    if (activeTab === 'map') {
        return (
            <div className="space-y-4 animate-in fade-in">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Campus Map</h2>
                <div className="bg-gray-200 dark:bg-gray-700 h-[500px] rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                    <div className="text-center">
                        <p className="text-lg font-medium">Map View Integration</p>
                        <p className="text-sm">Heatmap & Location Markers would appear here.</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4">
                    <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                    </select>
                </div>
            </div>
        );
    }

    if (activeTab === 'analytics') {
        return (
            <div className="space-y-6 animate-in fade-in">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Analytics Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Issues by Category</h3>
                        <div className="h-40 bg-gray-100 dark:bg-gray-700/50 rounded flex items-center justify-center text-xs text-gray-400">Bar Chart Placeholder</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Resolution Time</h3>
                        <div className="h-40 bg-gray-100 dark:bg-gray-700/50 rounded flex items-center justify-center text-xs text-gray-400">Line Chart Placeholder</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Active vs Resolved</h3>
                        <div className="h-40 bg-gray-100 dark:bg-gray-700/50 rounded flex items-center justify-center text-xs text-gray-400">Pie Chart Placeholder</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    Issue Management
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800/50 px-2 py-0.5 rounded-full">{issues.length} Total</span>
                </h2>

                <div className="flex gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Structural">Structural</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <select
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} onClick={() => onIssueClick(issue)} />
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed">
                        No issues found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
};
