import React, { useState, useEffect } from 'react';
import { BookOpen, Star, GitFork, Clock, Plus, LogIn, Copy, Check, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserClasses } from '../utils/db';
import CreateClassModal from './CreateClassModal';
import JoinClassModal from './JoinClassModal';

const Dashboard = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        if (user) {
            loadClasses();
        }
    }, [user]);

    const loadClasses = async () => {
        try {
            setLoading(true);
            const userClasses = await getUserClasses(user.id);
            setClasses(userClasses);
        } catch (error) {
            console.error('Error loading classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClassCreated = () => {
        loadClasses();
    };

    const handleClassJoined = () => {
        loadClasses();
    };

    const copyClassCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Welcome back, {user?.user_metadata?.name || 'Student'}!
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your classes and track your progress
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Class
                    </button>
                    <button
                        onClick={() => setIsJoinModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        Join Class
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center py-12 rounded-lg border bg-card">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No classes yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first class or join one using a code
                    </p>
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Class
                        </button>
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Join Class
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((course) => (
                        <div
                            key={course.id}
                            className="group relative flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                            style={{ borderLeftWidth: '4px', borderLeftColor: course.color }}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                        <Link to={`/repo/${course.id}`} className="font-semibold text-primary hover:underline line-clamp-1">
                                            {course.name}
                                        </Link>
                                    </div>
                                    <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                                        {user?.id === course.owner_id ? 'Owner' : 'Enrolled'}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {course.description}
                                </p>
                                {user?.id === course.owner_id && (
                                    <div className="mb-4 p-2 rounded-md bg-muted/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Code:</span>
                                            <code className="text-sm font-mono font-bold">{course.code}</code>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                copyClassCode(course.code);
                                            }}
                                            className="p-1 hover:bg-muted rounded transition-colors"
                                            title="Copy class code"
                                        >
                                            {copiedCode === course.code ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: course.color }}
                                        />
                                        <span>{course.language}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>{course.memberCount} Members</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{Math.floor(Math.random() * 7)} days ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateClassModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onClassCreated={handleClassCreated}
            />

            <JoinClassModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onClassJoined={handleClassJoined}
            />
        </div>
    );
};

export default Dashboard;
