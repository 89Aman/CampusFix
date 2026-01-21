import React from 'react';
import { MapPin, ThumbsUp, Clock, AlertTriangle } from 'lucide-react';
import type { Issue } from '../types';
import { cn } from '../lib/utils';

interface IssueCardProps {
    issue: Issue;
    onClick: () => void;
    showStatus?: boolean; // For admin view
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick, showStatus = true }) => {
    const severeColor = {
        high: 'bg-red-500',
        medium: 'bg-yellow-500',
        low: 'bg-green-500'
    };

    const statusColor = {
        'Open': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'In Progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        'Resolved': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    };

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded">
                        {issue.category}
                    </span>
                    <span
                        className={cn("w-2.5 h-2.5 rounded-full", severeColor[issue.severity])}
                        title={`Severity: ${issue.severity}`}
                    />
                </div>
                {showStatus && (
                    <span className={cn("px-2 py-0.5 text-xs font-medium rounded", statusColor[issue.status])}>
                        {issue.status}
                    </span>
                )}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {issue.summary}
            </h3>

            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <MapPin size={14} />
                <span>{issue.location}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {issue.createdAt}
                    </span>
                    {issue.priority > 80 && (
                        <span className="flex items-center gap-1 text-red-500">
                            <AlertTriangle size={12} /> High Priority
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <ThumbsUp size={14} />
                    <span>{issue.upvotes}</span>
                </div>
            </div>
        </div>
    );
};
