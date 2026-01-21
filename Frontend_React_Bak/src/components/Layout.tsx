import React from 'react';
import { cn } from '../lib/utils'; // Assuming this imports cn correctly

interface LayoutProps {
    header: React.ReactNode;
    sidebar?: React.ReactNode;
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, sidebar, children }) => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900">
            {header}
            <div className="flex pt-[61px] min-h-[calc(100vh)]">
                {sidebar}
                <main className={cn(
                    "flex-1 p-4 md:p-6 transition-all duration-300 w-full mx-auto",
                    !sidebar && "max-w-2xl"
                )}>
                    {children}
                </main>
            </div>
        </div>
    );
};
