import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const Profile = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        nickname: ''
    });
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        fetchProfile();
    }, [axiosPrivate]);

    const fetchProfile = async () => {
        try {
            const response = await axiosPrivate.get('/users/me');
            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                lastname: response.data.lastname || '',
                nickname: response.data.nickname || ''
            });
        } catch (err) {
            setErrMsg('Failed to load profile');
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.put('/users/me', formData);
            setUser(response.data);
            setEditMode(false);
            setErrMsg('');
        } catch (err) {
            setErrMsg('Failed to update profile');
            console.error(err);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <section>
            <h1>My Profile</h1>
            {errMsg && <p className="error">{errMsg}</p>}
            {!editMode ? (
                <div>
                    <p>Email: {user.email}</p>
                    <p>Name: {user.name || 'Not set'}</p>
                    <p>Lastname: {user.lastname || 'Not set'}</p>
                    <p>Nickname: {user.nickname || 'Not set'}</p>
                    <p>Role: {user.role}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <label htmlFor="lastname">Lastname:</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                    />
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" style={{ marginRight: '10px' }}>Save</button>
                        <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default Profile;