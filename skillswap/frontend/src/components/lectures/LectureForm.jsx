import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lectureService from '../../services/lectureService';

const LectureForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', description: '', videoUrl: '' });
    const [loading, setLoading] = useState(false);
    const isEditing = Boolean(id);

    useEffect(() => {
    if (isEditing) {
      lectureService.getLectureById(id).then((response) => {
        const lecture = response.lecture || response.data?.lecture || {}
        setFormData({
          title: lecture.title || '',
          description: lecture.description || '',
          videoUrl: lecture.videoUrl || '',
        });
      });
        }
    }, [id, isEditing]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await lectureService.updateLecture(id, formData);
            } else {
                await lectureService.createLecture(formData);
            }
            navigate('/lectures');
        } catch (err) {
            console.error('Error submitting lecture form:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lecture-form max-w-lg mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Lecture' : 'Create Lecture'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Video URL</label>
                    <input name="videoUrl" type="url" value={formData.videoUrl} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50">
                    {loading ? 'Saving...' : isEditing ? 'Update Lecture' : 'Create Lecture'}
                </button>
            </form>
        </div>
    );
};

export default LectureForm;
