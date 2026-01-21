import React from 'react';
import { X, MapPin, Clock, ThumbsUp } from 'lucide-react';
import type { Issue } from '../types';

interface IssueDetailModalProps {
    issue: Issue | null;
    isOpen: boolean;
    onClose: () => void;
    onUpvote: (id: number) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, isOpen, onClose, onUpvote }) => {
    if (!isOpen || !issue) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Issue Details</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                    <div className="flex gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm font-medium">
                            {issue.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-sm font-medium ${issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                            issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} Severity
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-sm font-medium ml-auto">
                            {issue.status}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">
                        {issue.summary}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <MapPin size={16} />
                        {issue.location}
                    </div>

                    {issue.image && (
                        <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img src={issue.image} alt="Issue evidence" className="w-full h-48 object-cover" />
                        </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {issue.text}
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock size={14} /> Reported on {issue.createdAt}
                        </div>
                        <button
                            onClick={() => onUpvote(issue.id)}
                            className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ThumbsUp size={14} /> {issue.upvotes} Upvotes
                        </button>
                    </div>

                    <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Updates</h4>
                        {issue.timeline.map((event, idx) => (
                            <div key={idx} className="pl-3 border-l-2 border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 py-1">
                                {event}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
