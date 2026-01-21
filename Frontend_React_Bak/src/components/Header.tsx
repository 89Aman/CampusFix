import React from 'react';
import { User, LogOut, Sun, Moon, Menu } from 'lucide-react';
import type { UserRole } from '../types';

interface HeaderProps {
    userRole: UserRole;
    toggleUserRole: () => void;
    toggleTheme: () => void;
    isDark: boolean;
    toggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    userRole,
    toggleUserRole,
    toggleTheme,
    isDark,
    toggleSidebar
}) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center z-50 shadow-sm transition-colors duration-200">
            <div className="flex items-center gap-3">
                {userRole === 'admin' && (
                    <button onClick={toggleSidebar} className="md:hidden p-1 text-gray-600 dark:text-gray-300">
                        <Menu size={24} />
                    </button>
                )}
                <div className="font-semibold text-xl text-gray-800 dark:text-white tracking-tight">
                    Campus<span className="text-blue-600">Fix</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                    title="Toggle Theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div
                    onClick={toggleUserRole}
                    className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 ring-blue-500 transition-all text-gray-700 dark:text-gray-200"
                    title={`Current: ${userRole} (Click to switch)`}
                >
                    <User size={18} />
                </div>

                {/* Placeholder for Logout - currently just visual as we toggle roles */}
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};
