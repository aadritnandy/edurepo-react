import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Image as ImageIcon, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import FileExplorer from './FileExplorer';

const ClassView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClassData();
    }, [id]);

    const loadClassData = async () => {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('id', id)
            .single();

        if (!error) setClassData(data);
        setLoading(false);
    };

    const isOwner = user?.id === classData?.owner_id;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!classData) return <div>Class not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{classData.name}</h1>
                        <p className="text-muted-foreground">{classData.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        <User className="h-4 w-4" />
                        <span>{classData.owner_id === user.id ? 'You are the Owner' : 'Member View'}</span>
                    </div>
                </div>
            </div>

            <FileExplorer classId={id} isOwner={isOwner} />
        </div>
    );
};

export default ClassView;
