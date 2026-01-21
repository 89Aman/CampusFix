import React from 'react';
import { LayoutList, Map as MapIcon, BarChart3 } from 'lucide-react';
import type { AdminTab } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
    const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
        { id: 'issues', label: 'Issues', icon: <LayoutList size={20} /> },
        { id: 'map', label: 'Map', icon: <MapIcon size={20} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    ];

    return (
        <aside
            className={cn(
                "fixed md:sticky top-[60px] left-0 h-[calc(100vh-60px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 transform transition-transform duration-300 z-40 overflow-y-auto",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}
        >
            <div className="py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Admin Menu
                </div>
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4",
                                activeTab === tab.id
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};
