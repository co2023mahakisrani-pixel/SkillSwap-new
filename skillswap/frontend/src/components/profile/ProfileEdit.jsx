import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';

const ProfileEdit = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        mobile: '',
        email: '',
        dob: '',
        location: '',
        bio: ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || user.displayName || '',
                surname: user.surname || '',
                mobile: user.mobile || '',
                email: user.email || '',
                dob: user.dob || '',
                location: user.location || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('surname', formData.surname);
            payload.append('mobile', formData.mobile);
            payload.append('dob', formData.dob);
            payload.append('location', formData.location);
            payload.append('bio', formData.bio);
            if (profilePicture) payload.append('profilePicture', profilePicture);
            const updatedUser = await userService.updateProfile(payload);
            if (setUser) setUser(updatedUser);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-edit max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Surname</label>
                    <input name="surname" value={formData.surname} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" value={formData.email} readOnly className="w-full border rounded p-2 bg-gray-100 text-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Mobile Number</label>
                    <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input name="location" value={formData.location} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Profile Picture</label>
                    <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50">
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default ProfileEdit;
