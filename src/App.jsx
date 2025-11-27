import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Book, Bell, Plus, User, Search, Menu, LogOut, Settings, ChevronDown, Pencil } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import ClassView from './components/ClassView';
import CommitView from './components/CommitView';
import PRView from './components/PRView';
import Login from './components/Login';
import Signup from './components/Signup';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Navbar - only show when authenticated */}
      {isAuthenticated && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4 max-w-screen-2xl mx-auto">
            <div className="mr-4 hidden md:flex">
              <Link to="/" className="mr-6 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Book className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="hidden font-bold sm:inline-block">edurepo</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground">Dashboard</Link>
              </nav>
            </div>

            <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </button>

            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search or jump to..."
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8 md:w-[300px] lg:w-[400px]"
                  />
                  <div className="absolute right-2 top-2 hidden lg:flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </div>
                </div>
              </div>
              <nav className="flex items-center gap-2">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">New project</span>
                </button>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 px-2"
                  >
                    <div className="h-6 w-6 rounded-full border bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md z-50">
                        <div className="px-2 py-1.5 text-sm font-medium border-b mb-1">
                          <div className="font-semibold">{user?.name}</div>
                          <div className="text-xs text-muted-foreground">{user?.email}</div>
                        </div>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            // Navigate to settings (placeholder)
                          }}
                          className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </button>
                        <div className="border-t my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors text-destructive"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/repo/:id" element={<ProtectedRoute><ClassView /></ProtectedRoute>} />
          <Route path="/repo/:id/commit" element={<ProtectedRoute><CommitView /></ProtectedRoute>} />
          <Route path="/repo/:id/pulls/:prId" element={<ProtectedRoute><PRView /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router basename="/edurepo-react">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
