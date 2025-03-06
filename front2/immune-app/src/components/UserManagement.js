import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const UserManagement = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [axiosPrivate]);

    const fetchUsers = async () => {
        try {
            const response = await axiosPrivate.get('/users/list');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const handleEdit = (user) => {
        setEditUser({ ...user });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.put(`/users/${editUser.id}`, editUser);
            setUsers(users.map(u => u.id === editUser.id ? response.data : u));
            setEditUser(null);
        } catch (err) {
            console.error('Failed to update user:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axiosPrivate.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                console.error('Failed to delete user:', err);
            }
        }
    };

    return (
        <section>
            <h1>User Management</h1>
            {users.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {users.map(user => (
                        <li key={user.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: '#F5F5F5',
                            borderRadius: '4px'
                        }}>
                            <span>{user.email} - {user.name} ({user.role})</span>
                            {auth.role === 'ADMIN' && (
                                <div>
                                    <button
                                        onClick={() => handleEdit(user)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ backgroundColor: '#EF5350' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ color: '#666' }}>No users to display</p>
            )}
            {editUser && (
                <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="email"
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        placeholder="Email"
                        required
                    />
                    <select
                        value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" style={{ marginRight: '10px' }}>Save</button>
                        <button
                            type="button"
                            onClick={() => setEditUser(null)}
                            style={{ backgroundColor: '#666' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default UserManagement;