import React, { useState, useEffect } from 'react';
import { Task, getTasks, saveTasks, generateId, clearUser } from '../utils/localStorage';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter, { FilterType } from './TaskFilter';
import { useToast } from '../hooks/use-toast';
import { useTheme } from '@/context/ThemeProvider';

interface TaskDashboardProps {
  username: string;
  onLogout: () => void;
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({ username, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setShowAddForm(false);

    toast({
      title: "Task added!",
      description: `"${newTask.title}" has been added to your tasks.`,
    });
  };

  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    const task = tasks.find(t => t.id === id);
    if (task) {
      toast({
        title: task.completed ? "Task reopened" : "Task completed!",
        description: `"${task.title}" has been ${task.completed ? 'reopened' : 'completed'}.`,
      });
    }
  };

  const handleEditTask = (id: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...taskData } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    toast({
      title: "Task updated!",
      description: `"${taskData.title}" has been updated.`,
    });
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    if (task) {
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted.`,
      });
    }
  };

  const handleLogout = () => {
    clearUser();
    onLogout();
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const getCounts = () => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    return {
      all: tasks.length,
      completed,
      pending,
    };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const counts = getCounts();

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed);

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="task-card p-6 mb-6 text-card-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {getGreeting()}, {username}!
              </h1>
              <p className="text-muted-foreground mb-4">
                {counts.pending > 0
                  ? `You have ${counts.pending} pending task${counts.pending === 1 ? '' : 's'} to complete.`
                  : counts.completed > 0
                    ? "All caught up! Great work!"
                    : "Ready to tackle your day? Add your first task!"
                }
              </p>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full max-w-md"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                Add Task
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-lg font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors"
                title="Logout"
              >
                Logout
              </button>

              <button
                onClick={toggleTheme}
                className="px-4 py-3 rounded-lg font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors"
                title="Toggle Dark Mode"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="mb-6">
            <TaskForm
              onSubmit={handleAddTask}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Task Filter */}
        <div className="mb-6">
          <TaskFilter
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          filter={filter}
          onToggleTask={handleToggleTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />

        {/* Stats Footer */}
        {tasks.length > 0 && (
          <div className="mt-8 p-4 text-center text-sm text-muted-foreground">
            {counts.completed > 0 && (
              <p>
                You've completed {counts.completed} task{counts.completed === 1 ? '' : 's'} out of {tasks.length} total.
                {counts.completed === tasks.length ? ' Amazing!' : ' Keep it up!'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;
