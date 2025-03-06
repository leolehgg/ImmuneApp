import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState();

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {

        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users/list', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error("sdffsfdsdfsfdsdfsd",err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []) 

    return (
        <article>
            {/* Título de la sección */}
            <h2>Users List</h2>

            {/* Si 'users' contiene elementos, los mapea y los muestra en una lista */}
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                    </ul>
                ) 
                : <p>No users to display</p> // Si no hay usuarios, muestra un mensaje
            }
        </article>
    );
};

export default Users;
