// Importa la instancia de axios configurada previamente desde 'axios' en '/api/axios'
import { axiosPrivate } from "../api/axios";

// Importa el hook 'useEffect' de React para realizar efectos secundarios en componentes
import { useEffect } from "react";

// Importa un hook personalizado para obtener el refresh token
import useRefreshToken from "./useRefreshToken";

// Importa el hook personalizado para obtener el estado de autenticación del usuario
import useAuth from "./useAuth";

// Hook personalizado 'useAxiosPrivate' para realizar peticiones con autenticación
const useAxiosPrivate = () => {
    // Obtiene el refresh token usando el hook 'useRefreshToken'
    const refresh = useRefreshToken();

    // Obtiene el estado de autenticación actual del usuario
    const { auth } = useAuth();

    // 'useEffect' se ejecuta al montar el componente o cuando 'auth' o 'refresh' cambian
    useEffect(() => {
        // Configura un interceptor de solicitudes para agregar el token de acceso en los encabezados
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // Si no existe un encabezado 'Authorization', lo agrega con el token de acceso del usuario
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // Configura un interceptor de respuestas para manejar errores relacionados con la expiración del token
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response, // Si la respuesta es exitosa, la retorna
            async (error) => {
                // Obtiene la configuración de la solicitud que falló
                const prevRequest = error?.config;
                // Si el error es un 403 (Forbidden) y la solicitud no ha sido reenviada, intenta refrescar el token
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true; // Marca la solicitud como reenviada
                    // Llama a la función 'refresh' para obtener un nuevo token de acceso
                    const newAccessToken = await refresh();
                    // Agrega el nuevo token de acceso a los encabezados de la solicitud
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // Reenvía la solicitud original con el nuevo token
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error); // Si no se puede refrescar el token, rechaza la promesa
            }
        );

        // Función de limpieza para remover los interceptores cuando el componente se desmonte
        return () => {
            // Elimina el interceptor de solicitudes
            axiosPrivate.interceptors.request.eject(requestIntercept);
            // Elimina el interceptor de respuestas
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh]) // El hook se ejecuta cuando el estado 'auth' o 'refresh' cambia

    // Devuelve la instancia de 'axiosPrivate' configurada con los interceptores
    return axiosPrivate;
}

// Exporta el hook personalizado para ser utilizado en otros componentes
export default useAxiosPrivate;
