import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import notesService from '../../services/notesService';

const NotesEditor = () => {
    const { lectureId } = useParams();
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await notesService.getNotes(lectureId);
                setNotes(response?.notes || response?.content || '');
            } catch (error) {
                console.error('Error fetching notes:', error);
            } finally {
                setLoading(false);
            }
        };
        if (lectureId) fetchNotes();
    }, [lectureId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await notesService.createNote({ lectureId, content: notes });
            alert('Notes saved successfully!');
        } catch (error) {
            console.error('Error saving notes:', error);
            alert('Failed to save notes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-4">Loading notes...</div>;

    return (
        <div className="notes-editor p-4">
            <h2 className="text-lg font-semibold mb-2">Lecture Notes</h2>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={12}
                className="w-full border rounded p-2 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Add your notes here..."
            />
            <button
                onClick={handleSave}
                disabled={saving}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Notes'}
            </button>
        </div>
    );
};

export default NotesEditor;
