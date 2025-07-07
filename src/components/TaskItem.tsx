import React, { useState } from 'react';
import { Task } from '../utils/localStorage';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleEdit = (updatedTask: Omit<Task, 'id' | 'createdAt'>) => {
    onEdit(task.id, updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const handleToggle = () => {
    onToggle(task.id);
  };

  if (isEditing) {
    return (
      <div className="task-card">
        <TaskForm
          editingTask={task}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          isInline
        />
      </div>
    );
  }

  return (
    <div
      className={`task-card transition-all ${
        task.completed ? 'opacity-70 bg-muted' : 'bg-card'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
            task.completed
              ? 'bg-primary border-primary'
              : 'border-border hover:border-primary'
          }`}
        >
          {task.completed && (
            <span className="text-primary-foreground text-sm font-bold">✓</span>
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <h3 className="task-title font-semibold text-foreground text-lg mb-1 flex items-center gap-2">
            {task.title}
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                task.priority === 'high'
                  ? 'bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : task.priority === 'medium'
                  ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}
            >
              {task.priority}
            </span>
            {task.completed && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-muted-foreground mb-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {formatDate(task.createdAt)}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-muted"
                title="Edit task"
              >
                <span className="text-sm">✏️</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-muted"
                title="Delete task"
              >
                <span className="text-sm">🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="task-card max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Delete Task</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex-1"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="border border-border bg-background text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
