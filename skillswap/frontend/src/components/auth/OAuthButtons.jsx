import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const OAuthButtons = () => {
    const { googleLogin, facebookLogin, microsoftLogin } = useContext(AuthContext);

    const handleGoogleLogin = async () => {
        await googleLogin();
    };

    const handleFacebookLogin = async () => {
        await facebookLogin();
    };

    const handleMicrosoftLogin = async () => {
        await microsoftLogin();
    };

    return (
        <div className="flex flex-col space-y-3 mt-4">
            <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded p-2 hover:bg-gray-50 w-full"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>
            <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-2 bg-blue-700 text-white rounded p-2 hover:bg-blue-800 w-full"
            >
                Continue with Facebook
            </button>
            <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded p-2 hover:bg-gray-50 w-full"
            >
                Continue with Microsoft
            </button>
        </div>
    );
};

export default OAuthButtons;
