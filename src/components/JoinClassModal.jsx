import React, { useState } from 'react';
import { X, LogIn, CheckCircle2 } from 'lucide-react';
import { joinClass } from '../utils/db';
import { useAuth } from '../context/AuthContext';

const JoinClassModal = ({ isOpen, onClose, onClassJoined }) => {
    const { user } = useAuth();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const joinedClass = await joinClass(user.id, code.toUpperCase());
            setSuccess(true);
            onClassJoined(joinedClass);
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to join class. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCode('');
        setError('');
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border bg-card shadow-lg">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <LogIn className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Join a Class</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-md p-1 hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="rounded-md bg-destructive/15 border border-destructive/50 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-md bg-green-500/15 border border-green-500/50 px-3 py-2 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Successfully joined the class!
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="classCode" className="text-sm font-medium">
                            Class Code
                        </label>
                        <input
                            id="classCode"
                            type="text"
                            placeholder="Enter 6-character code"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 uppercase font-mono tracking-wider"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            maxLength={6}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Ask your teacher for the class code
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={success || loading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
                        >
                            {loading ? 'Joining...' : 'Join Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinClassModal;
