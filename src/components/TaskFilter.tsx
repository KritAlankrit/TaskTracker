import React from 'react';

export type FilterType = 'all' | 'completed' | 'pending';

interface TaskFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    completed: number;
    pending: number;
  };
}

const TaskFilter: React.FC<TaskFilterProps> = ({ activeFilter, onFilterChange, counts }) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All Tasks', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-muted text-foreground rounded-xl transition-colors">
      {filters.map(({ key, label, count }) => {
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`filter-tab ${isActive ? 'active' : ''}`}
          >
            <span className="mr-2">{label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TaskFilter;
