export interface Issue {
    id: number;
    summary: string;
    location: string;
    category: string;
    severity: 'high' | 'medium' | 'low';
    status: 'Open' | 'In Progress' | 'Resolved';
    priority: number;
    text: string;
    upvotes: number;
    image: string | null;
    timeline: string[];
    createdAt: string;
}

export type UserRole = 'student' | 'admin';
export type AdminTab = 'issues' | 'map' | 'analytics';
export type StudentView = 'submit' | 'list';
