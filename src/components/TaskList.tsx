import React from 'react';
import { Task } from '../utils/localStorage';
import TaskItem from './TaskItem';
import { FilterType } from './TaskFilter';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onToggleTask: (id: string) => void;
  onEditTask: (id: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}) => {
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center text-3xl">
          {filter === 'completed' && <span>🎉</span>}
          {filter === 'pending' && <span>📋</span>}
          {filter === 'all' && <span>✨</span>}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {filter === 'completed' && 'No completed tasks yet'}
          {filter === 'pending' && 'No pending tasks'}
          {filter === 'all' && 'No tasks yet'}
        </h3>
        <p className="text-muted-foreground">
          {filter === 'completed' && 'Complete some tasks to see them here!'}
          {filter === 'pending' && 'All caught up! Great work!'}
          {filter === 'all' && 'Add your first task to get started!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
