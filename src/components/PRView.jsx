import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitPullRequest, CheckCircle2, MessageSquare, FileDiff, Check } from 'lucide-react';

const PRView = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-muted/30 px-6 py-4">
                <div className="max-w-6xl mx-auto">
                    <Link to="/repo/1" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to repository
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                Assignment 1 Submission
                                <span className="text-muted-foreground font-normal text-xl">#1</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-500/15 text-green-700 dark:text-green-400 border-transparent">
                                    <GitPullRequest className="mr-1 h-3 w-3" />
                                    Open
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">student-user</span> wants to merge 1 commit into <span className="font-mono bg-muted px-1 rounded">main</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                Edit
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-9 px-4 py-2">
                                Merge pull request
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        {/* Conversation */}
                        <div className="relative pl-12 pb-8 border-l-2 border-muted ml-4">
                            <div className="absolute -left-[19px] top-0 h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div className="rounded-md border bg-card">
                                <div className="border-b px-4 py-2 bg-muted/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium">student-user</span>
                                        <span className="text-muted-foreground">commented 2 days ago</span>
                                    </div>
                                    <div className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
                                        Author
                                    </div>
                                </div>
                                <div className="p-4 text-sm">
                                    <p>Here is my submission for Assignment 1. I implemented the sorting algorithm as requested.</p>
                                </div>
                            </div>
                        </div>

                        {/* Review */}
                        <div className="relative pl-12 pb-8 border-l-2 border-muted ml-4">
                            <div className="absolute -left-[19px] top-0 h-10 w-10 rounded-full border-2 border-background bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>

                            <div className="rounded-md border bg-card">
                                <div className="border-b px-4 py-2 bg-muted/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium">prof-smith</span>
                                        <span className="text-muted-foreground">approved these changes yesterday</span>
                                    </div>
                                    <div className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
                                        Maintainer
                                    </div>
                                </div>
                                <div className="p-4 text-sm">
                                    <p>Great work! The logic looks sound. 100/100.</p>
                                </div>
                            </div>
                        </div>

                        {/* Diff View */}
                        <div className="rounded-md border bg-card overflow-hidden">
                            <div className="border-b px-4 py-2 bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <FileDiff className="h-4 w-4 text-muted-foreground" />
                                    assignment1.py
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+45</span> <span className="text-red-600">-0</span> lines
                                </div>
                            </div>
                            <div className="bg-[#0d1117] text-gray-300 font-mono text-sm p-4 overflow-x-auto">
                                <pre>
                                    {`def bubble_sort(arr):
+    n = len(arr)
+    for i in range(n):
+        for j in range(0, n-i-1):
+            if arr[j] > arr[j+1]:
+                arr[j], arr[j+1] = arr[j+1], arr[j]
+    return arr`}
                                </pre>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-md border bg-card p-4 space-y-4">
                            <div className="flex items-center justify-between text-sm font-medium border-b pb-2">
                                Reviewers
                                <span className="text-muted-foreground font-normal">1</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                    PS
                                </div>
                                <span>prof-smith</span>
                                <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                            </div>
                        </div>

                        <div className="rounded-md border bg-card p-4 space-y-4">
                            <div className="flex items-center justify-between text-sm font-medium border-b pb-2">
                                Assignees
                                <span className="text-muted-foreground font-normal">0</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                No one assigned
                            </div>
                        </div>

                        <div className="rounded-md border bg-card p-4 space-y-4">
                            <div className="flex items-center justify-between text-sm font-medium border-b pb-2">
                                Labels
                                <span className="text-muted-foreground font-normal">2</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    assignment
                                </span>
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    graded
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PRView;
