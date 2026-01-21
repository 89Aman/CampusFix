import { useState, useEffect } from 'react';
import type { AdminTab, Issue, UserRole } from './types';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { IssueDetailModal } from './components/IssueDetailModal';

import { getIssues, submitIssue, upvoteIssue } from './api';

function App() {
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [adminTab, setAdminTab] = useState<AdminTab>('issues');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Data State
  const [issues, setIssues] = useState<Issue[]>([]);

  // Fetch issues on mount
  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const data = await getIssues();
      setIssues(data);
    } catch (error) {
      console.error("Failed to load issues", error);
    }
  };

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

  const handleIssueSubmit = async (data: Partial<Issue>, imageFile?: File | null) => {
    try {
      const formData = new FormData();
      formData.append('description', data.text || "");
      formData.append('location', data.location || "");
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await submitIssue(formData);
      // Refresh list
      await loadIssues();
    } catch (error) {
      console.error("Failed to submit issue", error);
    }
  };

  const handleUpvote = async (id: number) => {
    try {
      await upvoteIssue(id);
      const updatedIssues = issues.map(issue => {
        if (issue.id === id) {
          return { ...issue, upvotes: issue.upvotes + 1 };
        }
        return issue;
      });
      setIssues(updatedIssues);
      if (selectedIssue && selectedIssue.id === id) {
        setSelectedIssue({ ...selectedIssue, upvotes: selectedIssue.upvotes + 1 });
      }
    } catch (error) {
      console.error("Failed to upvote", error);
    }
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
        onUpvote={handleUpvote}
      />
    </Layout>
  );
}

export default App;
