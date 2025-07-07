import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import TaskDashboard from '../components/TaskDashboard';
import { getUser, initializeSampleData } from '../utils/localStorage';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData();
    
    // Check for existing user
    const user = getUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading TaskTracker...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return <TaskDashboard username={currentUser} onLogout={handleLogout} />;
};

export default Index;
