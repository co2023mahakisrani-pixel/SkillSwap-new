import React, { useEffect, useState } from 'react';
import notesService from '../../services/notesService';
import LoadingSpinner from '../common/LoadingSpinner';

const NotesList = ({ lectureId }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await notesService.getNotes(lectureId);
                setNotes(response.notes || response.data?.notes || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (lectureId) fetchNotes();
    }, [lectureId]);

    if (loading) return <LoadingSpinner size="sm" />;
    if (error) return <div className="text-red-500 text-sm">{error}</div>;
    if (notes.length === 0) return <div className="text-gray-500 text-sm">No notes yet.</div>;

    return (
        <div className="notes-list">
            <h2 className="text-lg font-semibold mb-2">Your Notes</h2>
            <ul className="space-y-3">
                {notes.map((note) => (
                    <li key={note.id || note._id} className="border rounded p-3 bg-gray-50">
                        <h3 className="font-medium">{note.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">{note.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotesList;
