import React, { useState } from 'react';
import { Camera, Send, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Issue, StudentView } from '../types';
import { IssueCard } from '../components/IssueCard';

interface StudentDashboardProps {
    issues: Issue[];
    onSubmitIssue: (data: Partial<Issue>) => Promise<void>;
    onIssueClick: (issue: Issue) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ issues, onSubmitIssue, onIssueClick }) => {
    const [view, setView] = useState<StudentView>('submit');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [summary, setSummary] = useState('');
    const [location, setLocation] = useState('Block A / Room 201');
    const [desc, setDesc] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        await onSubmitIssue({
            summary: summary || "New Issue Report",
            location,
            text: desc,
            category: "Other", // Default for now
            severity: "medium", // Default
            image: null
        });

        setLoading(false);
        setSuccess(true);
        setSummary('');
        setDesc('');

        // Hide success after 3s
        setTimeout(() => setSuccess(false), 3000);
    };

    if (view === 'list') {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => setView('submit')}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors w-fit mb-4"
                >
                    <ArrowLeft size={16} /> Back to Report Issue
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Current Issues</h2>
                <div className="grid gap-4">
                    {issues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} onClick={() => onIssueClick(issue)} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            {success && (
                <div className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center animate-in fade-in slide-in-from-top-2">
                    ✓ Issue reported successfully!
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Report a Maintenance Issue</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo Evidence</label>
                        {/* Photo Evidence */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo Evidence</label>
                            <div
                                onClick={() => document.getElementById('file-upload')?.click()}
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group relative"
                            >
                                {imageFile ? (
                                    <div className="text-sm text-green-600 font-medium">
                                        Selected: {imageFile.name}
                                    </div>
                                ) : (
                                    <>
                                        <Camera className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Click to add photo</span>
                                    </>
                                )}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Summary</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Broken Tap"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Describe the issue briefly..."
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                        {loading ? 'Submitting...' : 'Report Issue'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                    <button
                        onClick={() => setView('list')}
                        className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
                    >
                        View Reported Issues <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
