import { supabase } from '../lib/supabase';

// Helper to generate a random class code
const generateClassCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const createClass = async (classData) => {
    const code = generateClassCode();

    // Extract only the fields that exist in the database schema
    const { name, description, language, color, ownerId } = classData;

    const { data: newClass, error: classError } = await supabase
        .from('classes')
        .insert([{
            name,
            description,
            language,
            color,
            code,
            owner_id: ownerId
        }])
        .select()
        .single();

    if (classError) throw classError;

    // Automatically enroll the creator
    const { error: joinError } = await supabase
        .from('user_classes')
        .insert([{
            user_id: classData.ownerId,
            class_id: newClass.id
        }]);

    if (joinError) throw joinError;

    return newClass;
};

export const joinClass = async (userId, classCode) => {
    // 1. Find the class
    const { data: classData, error: findError } = await supabase
        .from('classes')
        .select('*')
        .eq('code', classCode)
        .single();

    if (findError) throw new Error('Class not found');

    // 2. Check if already enrolled
    const { data: existing } = await supabase
        .from('user_classes')
        .select('*')
        .eq('user_id', userId)
        .eq('class_id', classData.id)
        .single();

    if (existing) throw new Error('You are already enrolled in this class');

    // 3. Enroll
    const { error: joinError } = await supabase
        .from('user_classes')
        .insert([{
            user_id: userId,
            class_id: classData.id
        }]);

    if (joinError) throw joinError;

    return classData;
};

export const getUserClasses = async (userId) => {
    const { data, error } = await supabase
        .from('user_classes')
        .select(`
            class_id,
            classes (
                *,
                user_classes (count)
            )
        `)
        .eq('user_id', userId);

    if (error) throw error;

    // Flatten and format
    return data.map(item => ({
        ...item.classes,
        memberCount: item.classes.user_classes[0].count
    }));
};

export const getClassByCode = async (code) => {
    const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('code', code)
        .single();

    if (error) return null;
    return data;
};
