import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import '../css/Profile.css';

const Profile = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastname: ''
    });
    const [passwordMode, setPasswordMode] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({});

    useEffect(() => {
        fetchProfile();
    }, [axiosPrivate]);

    const fetchProfile = async () => {
        try {
            const response = await axiosPrivate.get('/users/me');
            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                lastname: response.data.lastname || ''
            });
        } catch (err) {
            setErrMsg('Failed to load profile');
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
        validatePassword({ ...passwordData, [name]: value });
    };

    const validatePassword = (data) => {
        const errors = {};
        if (data.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.newPassword)) {
            errors.complexity = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        if (data.newPassword !== data.confirmNewPassword) {
            errors.confirmNewPassword = 'Passwords do not match';
        }
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.put('/users/me', formData);
            setUser(response.data);
            setEditMode(false);
            setSuccessMsg('Profile updated successfully');
            setErrMsg('');
        } catch (err) {
            setErrMsg('Failed to update profile');
            console.error(err);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(passwordData)) return;
        try {
            const response = await axiosPrivate.put('/users/me/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordMode(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
            setSuccessMsg(response.data);
            setErrMsg('');
            setPasswordErrors({});
        } catch (err) {
            setErrMsg(err.response?.data || 'Failed to change password');
            console.error(err);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <section className="profile-section">
            <h1>My Profile</h1>
            {errMsg && <p className="error">{errMsg}</p>}
            {successMsg && <p className="success">{successMsg}</p>}

            {!editMode && !passwordMode ? (
                <div className="profile-card">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.name || 'Not set'}</p>
                    <p><strong>Lastname:</strong> {user.lastname || 'Not set'}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <div className="profile-buttons">
                        <button onClick={() => setEditMode(true)}>Edit Profile</button>
                        <button onClick={() => setPasswordMode(true)}>Change Password</button>
                    </div>
                </div>
            ) : editMode ? (
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Lastname:</label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handlePasswordSubmit} className="edit-form">
                    <div className="form-group">
                        <label htmlFor="oldPassword">Current Password:</label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        {passwordErrors.newPassword && <p className="validation-error">{passwordErrors.newPassword}</p>}
                        {passwordErrors.complexity && <p className="validation-error">{passwordErrors.complexity}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        {passwordErrors.confirmNewPassword && <p className="validation-error">{passwordErrors.confirmNewPassword}</p>}
                    </div>
                    <div className="form-buttons">
                        <button 
                            type="submit" 
                            disabled={Object.keys(passwordErrors).length > 0 || !passwordData.newPassword}
                        >
                            Change Password
                        </button>
                        <button type="button" onClick={() => setPasswordMode(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default Profile;