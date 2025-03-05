// Importa el hook 'useState' para manejar el estado en el componente
import { useState, useEffect } from "react";

// Importa un hook personalizado 'useAxiosPrivate' para hacer peticiones HTTP con autenticación
import useAxiosPrivate from "../hooks/useAxiosPrivate";

// Importa 'useNavigate' y 'useLocation' de React Router para navegación y obtener la ubicación actual
import { useNavigate, useLocation } from "react-router-dom";

// Componente 'Users' que se encarga de mostrar la lista de usuarios
const Users = () => {
    // Define el estado local 'users' que almacenará la lista de usuarios
    const [users, setUsers] = useState();

    // Asigna el hook 'useAxiosPrivate' a 'axiosPrivate' para hacer peticiones con autorización
    const axiosPrivate = useAxiosPrivate();

    // Inicializa 'navigate' para redirigir al usuario a otra página si es necesario
    const navigate = useNavigate();

    // Inicializa 'location' para obtener la ubicación actual y usarla en redirecciones
    const location = useLocation();

    // 'useEffect' se ejecuta después del renderizado para obtener los usuarios desde la API
    useEffect(() => {
        // Se define una variable 'isMounted' para evitar actualizaciones de estado en un componente desmontado
        let isMounted = true;
        // Crea un controlador de aborto para manejar la cancelación de la solicitud si el componente se desmonta
        const controller = new AbortController();

        // Función asincrónica para obtener la lista de usuarios desde la API
        const getUsers = async () => {
            try {
                // Realiza una solicitud GET a '/users/list' usando 'axiosPrivate' con el controlador de aborto
                const response = await axiosPrivate.get('/users/list', {
                    signal: controller.signal
                });
                // Muestra la respuesta de la API en la consola
                console.log(response.data);
                // Si el componente sigue montado, actualiza el estado 'users' con la respuesta
                isMounted && setUsers(response.data);
            } catch (err) {
                // Si ocurre un error, muestra el error en la consola
                console.error("sdffsfdsdfsfdsdfsd",err);
                // Si hay un error (como 401 Unauthorized), redirige al usuario al login
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        // Llama a la función 'getUsers' para obtener la lista de usuarios
        getUsers();

        // Función de limpieza que se ejecuta cuando el componente se desmonta
        return () => {
            // Cambia 'isMounted' a false para evitar cambios de estado en el componente desmontado
            isMounted = false;
            // Abortamos la solicitud si el componente se desmonta
            controller.abort();
        }
    }, []) // El hook 'useEffect' se ejecuta solo una vez al montar el componente

    // Renderiza el componente con la lista de usuarios
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

// Exporta el componente para ser usado en otras partes de la aplicación
export default Users;
