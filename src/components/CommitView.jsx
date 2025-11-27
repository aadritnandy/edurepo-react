import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, X } from 'lucide-react';

const CommitView = () => {
    const navigate = useNavigate();
    const [fileName, setFileName] = useState('');
    const [content, setContent] = useState('');
    const [commitMessage, setCommitMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate submission
        setTimeout(() => {
            navigate('/repo/1');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link to="/repo/1" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to repository
                    </Link>
                    <h1 className="text-2xl font-bold">Create new file</h1>
                    <p className="text-muted-foreground">Submit your assignment by creating a new file or uploading one.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-md border bg-card">
                        <div className="border-b px-4 py-3 bg-muted/30 flex items-center gap-2">
                            <span className="text-muted-foreground">CS101 /</span>
                            <input
                                type="text"
                                placeholder="Name your file..."
                                className="bg-transparent border-none focus:outline-none focus:ring-0 font-medium placeholder:text-muted-foreground/50 w-full"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="p-0">
                            <textarea
                                className="w-full min-h-[400px] p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-y"
                                placeholder="// Type your code here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="rounded-md border bg-card p-4">
                        <h3 className="font-semibold mb-4">Commit changes</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <div className="h-3 w-3 rounded-full bg-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Commit message"
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={commitMessage}
                                        onChange={(e) => setCommitMessage(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        placeholder="Extended description (optional)"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <Link to="/repo/1" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-9 px-4 py-2"
                                >
                                    Commit changes
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommitView;
