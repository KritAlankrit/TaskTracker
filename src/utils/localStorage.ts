// localStorage utility functions for task management

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

// User management
export const setUser = (username: string): void => {
  localStorage.setItem('taskapp_user', username);
};

export const getUser = (): string | null => {
  return localStorage.getItem('taskapp_user');
};

export const clearUser = (): void => {
  localStorage.removeItem('taskapp_user');
};

// Task management
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem('taskapp_tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Initialize with sample data if no tasks exist
export const initializeSampleData = (): void => {
  const existingTasks = getTasks();
  if (existingTasks.length === 0) {
    const sampleTasks: Task[] = [
      {
        id: generateId(),
        title: "Complete React assignment",
        description: "Build a task tracker application with React hooks",
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'high'
      },
      {
        id: generateId(),
        title: "Review JavaScript concepts",
        description: "Go through ES6+ features and modern patterns",
        completed: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        priority: 'medium'
      },
      {
        id: generateId(),
        title: "Setup development environment",
        description: "Install Node.js, VS Code extensions, and project dependencies",
        completed: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        priority: 'low'
      }
    ];
    saveTasks(sampleTasks);
  }
};
