import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildPath } from '../components/Path.tsx';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    function isPasswordComplex(password: string): boolean {
        // 8 characters, one uppercase, one lowercase, one digit, one special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return regex.test(password);
    }

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!token) {
            setError('Invalid or missing token.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Check password complexity
        if (!isPasswordComplex(newPassword)) {
            setError(
                'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.'
            );
            return;
        }

        try {
            const response = await fetch(buildPath('api/reset-password'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                setMessage('Password successfully reset. You may now log in.');
            }
        } catch (err: any) {
            setError('Something went wrong: ' + err.message);
        }
        console.log(buildPath('api/reset-password'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <form
                onSubmit={handleReset}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                {message && <p className="text-green-600 mb-4">{message}</p>}
                {error && <p className="text-red-600 mb-4">{error}</p>}

                <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg hover:bg-cyan-800"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
