import React, { useState } from 'react';
import { setUser } from '../utils/localStorage';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      setUser(username.trim());
      onLogin(username.trim());
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md">
        <div className="task-card p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">TaskTracker</h1>
            <p className="text-muted-foreground">
              Your personal productivity handler
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Enter your name to get started
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name..."
                className="input-field w-full"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="w-full btn-primary py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Getting started...
                </>
              ) : (
                'Start Managing Tasks'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              No signup required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
