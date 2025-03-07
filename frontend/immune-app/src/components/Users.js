import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users/list');
                console.log('Users response:', response.data);
                setUsers(response.data);
            } catch (err) {
                console.error('Fetch error:', err);
                setErrMsg(err.response?.status === 401 ? 'Please log in to view users' : 'Failed to fetch users');
            }
        };
        fetchUsers();
    }, [axiosPrivate]);

    return (
        <section>
            <h1>Users</h1>
            {errMsg && <p className="error">{errMsg}</p>}
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>{user.email} - {user.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No users to display</p>
            )}
        </section>
    );
};

export default Users;