import React from 'react';
import { DEFAULT_PROFILE_PIC } from '../../utils/constants';

const ProfileCard = ({ user }) => {
    if (!user) return null;
    return (
        <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex items-center gap-4">
                <img
                    src={user.profilePicture || user.avatar || DEFAULT_PROFILE_PIC}
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <h2 className="text-xl font-semibold">
                        {[user.name || user.displayName, user.surname].filter(Boolean).join(' ')}
                    </h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    {user.mobile && <p className="text-gray-500 text-sm">Mobile: {user.mobile}</p>}
                    {user.dob && <p className="text-gray-500 text-sm">DOB: {user.dob}</p>}
                    {user.location && <p className="text-gray-500 text-sm">Location: {user.location}</p>}
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">Bio</h3>
                <p className="text-gray-700 text-sm">{user.bio || 'No bio available.'}</p>
            </div>
            {user.skills && user.skills.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                {typeof skill === 'string' ? skill : skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
