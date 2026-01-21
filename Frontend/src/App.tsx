import { useState, useEffect } from 'react';
import type { AdminTab, Issue, UserRole } from './types';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { IssueDetailModal } from './components/IssueDetailModal';

// Mock Data
const INITIAL_ISSUES: Issue[] = [
  {
    id: 1,
    summary: "Broken water pipe in bathroom",
    location: "Block A / Room 201",
    category: "Plumbing",
    severity: "high",
    status: "Open",
    priority: 95,
    text: "The water pipe in the bathroom sink is leaking water constantly. Creates a puddle on the floor.",
    upvotes: 3,
    image: "https://images.unsplash.com/photo-1585258380295-d8515320e4b8?auto=format&fit=crop&q=80&w=300",
    timeline: ["Reported by User • Jan 20, 2026"],
    createdAt: "2026-01-20"
  },
  {
    id: 2,
    summary: "Flickering lights in hallway",
    location: "Block B / Hallway 3",
    category: "Electrical",
    severity: "medium",
    status: "In Progress",
    priority: 72,
    text: "The lights in hallway 3 are flickering on and off. It is very distracting and potentially dangerous.",
    upvotes: 5,
    image: null,
    timeline: ["Reported by User • Jan 21, 2026", "Technician assigned • Jan 21, 2026"],
    createdAt: "2026-01-21"
  }
];

function App() {
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [adminTab, setAdminTab] = useState<AdminTab>('issues');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Data State
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);

  // Modal State
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Theme Toggle Effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleUser = () => {
    setUserRole(prev => prev === 'student' ? 'admin' : 'student');
    setIsSidebarOpen(false); // Close sidebar on switch
  };

  const handleIssueSubmit = async (data: Partial<Issue>) => {
    const newIssue: Issue = {
      id: issues.length + 1,
      summary: data.summary || "Untitled Issue",
      location: data.location || "Unknown",
      category: data.category || "Other",
      severity: data.severity || "low",
      status: "Open",
      priority: 0,
      text: data.text || "",
      upvotes: 0,
      image: null,
      timeline: [`Reported • ${new Date().toLocaleDateString()}`],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setIssues([newIssue, ...issues]);
  };

  const openIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  return (
    <Layout
      header={
        <Header
          userRole={userRole}
          toggleUserRole={handleToggleUser}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      }
      sidebar={userRole === 'admin' ? (
        <Sidebar
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          isOpen={isSidebarOpen}
        />
      ) : null}
    >
      {userRole === 'student' ? (
        <StudentDashboard
          issues={issues}
          onSubmitIssue={handleIssueSubmit}
          onIssueClick={openIssue}
        />
      ) : (
        <AdminDashboard
          activeTab={adminTab}
          issues={issues}
          onIssueClick={openIssue}
        />
      )}

      <IssueDetailModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}

export default App;
