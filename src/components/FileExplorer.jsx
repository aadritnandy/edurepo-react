import React, { useState, useEffect } from 'react';
import { Folder, FileText, File, ChevronRight, Upload, FolderPlus, ArrowLeft, Trash2, Download, FolderInput } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FileExplorer = ({ classId, isOwner }) => {
    const [files, setFiles] = useState([]);
    const [currentPath, setCurrentPath] = useState([]); // Array of folder objects {id, name}
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Current folder ID is the last item in path, or null for root
    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;

    useEffect(() => {
        loadFiles();

        const subscription = supabase
            .channel(`files:${classId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'files',
                filter: `class_id=eq.${classId}`
            }, () => {
                loadFiles();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [classId, currentFolderId]);

    const loadFiles = async () => {
        setLoading(true);
        let query = supabase
            .from('files')
            .select('*')
            .eq('class_id', classId)
            .order('type', { ascending: false }) // Folders first
            .order('name');

        if (currentFolderId) {
            query = query.eq('parent_id', currentFolderId);
        } else {
            query = query.is('parent_id', null);
        }

        const { data, error } = await query;
        if (!error) setFiles(data);
        setLoading(false);
    };

    const handleCreateFolder = async () => {
        const name = prompt('Enter folder name:');
        if (!name) return;

        const { error } = await supabase
            .from('files')
            .insert([{
                class_id: classId,
                parent_id: currentFolderId,
                name,
                type: 'folder'
            }]);

        if (error) alert('Error creating folder');
        else loadFiles();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Upload to Storage
            const filePath = `${classId}/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('class-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('class-files')
                .getPublicUrl(filePath);

            // 3. Create DB Record
            const { error: dbError } = await supabase
                .from('files')
                .insert([{
                    class_id: classId,
                    parent_id: currentFolderId,
                    name: file.name,
                    type: 'file',
                    url: publicUrl,
                    size: file.size
                }]);

            if (dbError) throw dbError;

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
            loadFiles();
        }
    };

    const handleDelete = async (fileId, type) => {
        if (!confirm(`Delete this ${type}?`)) return;

        const { error } = await supabase
            .from('files')
            .delete()
            .eq('id', fileId);

        if (error) alert('Error deleting item');
        else loadFiles();
    };

    const handleMove = async (fileId, currentName) => {
        // Simple implementation: Ask for destination folder name
        // In a real app, you'd want a folder picker modal
        const destName = prompt(`Move "${currentName}" to folder (enter folder name, or leave empty for root):`);
        if (destName === null) return; // Cancelled

        let newParentId = null;

        if (destName.trim()) {
            // Find the folder with this name in the current class
            const { data: folders, error: searchError } = await supabase
                .from('files')
                .select('id')
                .eq('class_id', classId)
                .eq('name', destName)
                .eq('type', 'folder')
                .single();

            if (searchError || !folders) {
                alert('Destination folder not found!');
                return;
            }
            newParentId = folders.id;
        }

        const { error } = await supabase
            .from('files')
            .update({ parent_id: newParentId })
            .eq('id', fileId);

        if (error) alert('Error moving item');
        else loadFiles();
    };

    const formatSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2 text-sm">
                    <button
                        onClick={() => setCurrentPath([])}
                        className={`hover:text-primary ${currentPath.length === 0 ? 'font-bold' : ''}`}
                    >
                        root
                    </button>
                    {currentPath.map((folder, index) => (
                        <React.Fragment key={folder.id}>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <button
                                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                                className={`hover:text-primary ${index === currentPath.length - 1 ? 'font-bold' : ''}`}
                            >
                                {folder.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>

                {isOwner && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCreateFolder}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-8 px-3"
                        >
                            <FolderPlus className="h-4 w-4 mr-2" />
                            New Folder
                        </button>
                        <label className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 cursor-pointer">
                            {uploading ? (
                                <span className="animate-pulse">Uploading...</span>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload File
                                </>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* File List */}
            <div className="divide-y">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : files.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <Folder className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>This folder is empty</p>
                    </div>
                ) : (
                    files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors group"
                        >
                            <button
                                onClick={() => {
                                    if (file.type === 'folder') {
                                        setCurrentPath([...currentPath, file]);
                                    } else {
                                        window.open(file.url, '_blank');
                                    }
                                }}
                                className="flex items-center gap-3 flex-1 text-left"
                            >
                                {file.type === 'folder' ? (
                                    <Folder className="h-5 w-5 text-blue-500 fill-blue-500/20" />
                                ) : (
                                    <FileText className="h-5 w-5 text-gray-500" />
                                )}
                                <span className="text-sm font-medium">{file.name}</span>
                            </button>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{formatSize(file.size)}</span>
                                <span className="w-24 text-right">
                                    {new Date(file.created_at).toLocaleDateString()}
                                </span>
                                {isOwner && (
                                    <>
                                        <button
                                            onClick={() => handleMove(file.id, file.name)}
                                            className="p-1 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Move"
                                        >
                                            <FolderInput className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(file.id, file.type)}
                                            className="p-1 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                                {file.type !== 'folder' && (
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                const response = await fetch(file.url);
                                                const blob = await response.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = file.name;
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            } catch (error) {
                                                console.error('Download failed:', error);
                                                window.open(file.url, '_blank');
                                            }
                                        }}
                                        className="p-1 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Download"
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FileExplorer;
