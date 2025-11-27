import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Code,
    AlertCircle,
    GitPullRequest,
    Play,
    BookOpen,
    Star,
    GitFork,
    Eye,
    ChevronDown,
    FileText,
    Folder,
    Download,
    History
} from 'lucide-react';
import { motion } from 'framer-motion';

const RepoView = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');

    // Mock data based on ID (in a real app, fetch this)
    const repoData = {
        name: id === '1' ? 'CS101: Intro to Computer Science' : 'Course Name',
        author: 'prof-smith',
        description: 'Fundamental concepts of programming and algorithms.',
        files: [
            { name: 'syllabus.pdf', type: 'file', size: '1.2 MB', updated: '2 days ago', message: 'Update syllabus' },
            { name: 'lectures', type: 'folder', size: '-', updated: '1 week ago', message: 'Add week 1 slides' },
            { name: 'assignments', type: 'folder', size: '-', updated: '3 days ago', message: 'Release assignment 1' },
            { name: 'resources.md', type: 'file', size: '2 KB', updated: '1 month ago', message: 'Initial commit' },
        ]
    };

    const tabs = [
        { id: 'code', label: 'Code', icon: Code },
        { id: 'issues', label: 'Issues', icon: AlertCircle, count: 3 },
        { id: 'pulls', label: 'Pull Requests', icon: GitPullRequest, count: 1 },
        { id: 'actions', label: 'Actions', icon: Play },
        { id: 'projects', label: 'Projects', icon: BookOpen },
    ];

    return (
        <div className="bg-background min-h-screen">
            {/* Repo Header */}
            <div className="bg-muted/30 border-b pt-6 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-lg">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <Link to="/" className="text-primary hover:underline">{repoData.author}</Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-bold text-primary">{repoData.name}</span>
                            <span className="ml-2 rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground">Public</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-2">
                                <Eye className="h-4 w-4" />
                                Watch
                                <span className="bg-muted px-1.5 py-0.5 rounded-full text-xs">12</span>
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-2">
                                <GitFork className="h-4 w-4" />
                                Fork
                                <span className="bg-muted px-1.5 py-0.5 rounded-full text-xs">4</span>
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-2">
                                <Star className="h-4 w-4" />
                                Star
                                <span className="bg-muted px-1.5 py-0.5 rounded-full text-xs">12</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-3 border-b-2 px-1 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary text-foreground font-medium'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                                {tab.count && (
                                    <span className="bg-muted px-1.5 py-0.5 rounded-full text-xs text-foreground">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto p-6">
                {activeTab === 'code' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-3">
                                    <GitFork className="mr-2 h-4 w-4" />
                                    main
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </button>
                                <div className="flex items-center text-sm text-muted-foreground ml-2">
                                    <GitFork className="h-4 w-4 mr-1" />
                                    <strong>1</strong> branch
                                    <span className="mx-2">·</span>
                                    <GitFork className="h-4 w-4 mr-1" />
                                    <strong>0</strong> tags
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link to={`/repo/${id}/commit`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
                                    Add file
                                </Link>
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3">
                                    Code
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* File Browser */}
                        <div className="rounded-md border bg-card">
                            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <span className="font-medium">prof-smith</span>
                                    <span className="text-muted-foreground">Initial course setup</span>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <span className="font-mono text-xs">a1b2c3d</span>
                                    <span>2 days ago</span>
                                    <div className="flex items-center gap-1">
                                        <History className="h-4 w-4" />
                                        <span>24 commits</span>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y">
                                {repoData.files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-3 flex-1">
                                            {file.type === 'folder' ? (
                                                <Folder className="h-4 w-4 text-blue-400 fill-blue-400/20" />
                                            ) : (
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="text-sm group-hover:text-primary group-hover:underline">
                                                {file.name}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-sm text-muted-foreground truncate px-4">
                                            {file.message}
                                        </div>
                                        <div className="text-sm text-muted-foreground w-24 text-right">
                                            {file.updated}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* README */}
                        <div className="rounded-md border bg-card mt-6">
                            <div className="border-b px-4 py-2 bg-muted/20 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                <span className="text-sm font-medium">README.md</span>
                            </div>
                            <div className="p-8 prose dark:prose-invert max-w-none">
                                <h1>{repoData.name}</h1>
                                <p>{repoData.description}</p>
                                <h2>Course Overview</h2>
                                <p>Welcome to CS101. In this course, we will cover the basics of computer science, including:</p>
                                <ul>
                                    <li>Algorithms</li>
                                    <li>Data Structures</li>
                                    <li>Python Programming</li>
                                </ul>
                                <h2>Assignments</h2>
                                <p>All assignments will be posted here. Please fork this repository and submit your work via Pull Request.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'issues' && (
                    <div className="text-center py-12">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                            <AlertCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No open issues</h3>
                        <p className="text-muted-foreground mt-1">
                            Have a question? Open a new issue to ask the professor or TAs.
                        </p>
                        <button className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                            New Issue
                        </button>
                    </div>
                )}

                {activeTab === 'pulls' && (
                    <div className="text-center py-12">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                            <GitPullRequest className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No pull requests</h3>
                        <p className="text-muted-foreground mt-1">
                            Ready to submit your homework? Create a pull request.
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <Link to={`/repo/${id}/commit`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                                New Pull Request
                            </Link>
                            <Link to={`/repo/${id}/pulls/1`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                View Example PR
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepoView;
