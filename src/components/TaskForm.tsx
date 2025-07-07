import React, { useState, useEffect } from 'react';
import { Task } from '../utils/localStorage';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  editingTask?: Task | null;
  isInline?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  editingTask,
  isInline = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = ['work', 'study', 'personal'];

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority || 'medium');
      setTags(editingTask.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTags([]);
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        completed: editingTask?.completed || false,
        priority,
        tags: tags.length > 0 ? tags : undefined,
      });

      if (!editingTask) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setTags([]);
      }
      setIsSubmitting(false);
    }, 200);
  };

  const handleCancel = () => {
    setTitle(editingTask?.title || '');
    setDescription(editingTask?.description || '');
    setPriority(editingTask?.priority || 'medium');
    setTags(editingTask?.tags || []);
    onCancel?.();
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-foreground mb-2">
          Task Title *
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="input-field w-full"
          disabled={isSubmitting}
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-foreground mb-2">
          Description (optional)
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details about this task..."
          rows={3}
          className="input-field w-full resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="task-priority" className="block text-sm font-medium text-foreground mb-2">
          Priority
        </label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="input-field w-full"
          disabled={isSubmitting}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Tags (optional)
        </label>
        <div className="flex flex-wrap gap-3">
          {availableTags.map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-2 text-sm cursor-pointer text-foreground"
            >
              <input
                type="checkbox"
                checked={tags.includes(tag)}
                onChange={(e) =>
                  setTags((prev) =>
                    e.target.checked ? [...prev, tag] : prev.filter((t) => t !== tag)
                  )
                }
                className="accent-[hsl(var(--primary))]"
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="btn-primary px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              {editingTask ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            editingTask ? 'Update Task' : 'Add Task'
          )}
        </button>

        {(editingTask || onCancel) && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  if (isInline) {
    return <div className="p-4 border border-border rounded-lg bg-background">{formContent}</div>;
  }

  return (
    <div className="task-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h2>
      {formContent}
    </div>
  );
};

export default TaskForm;
