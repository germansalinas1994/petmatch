import jwtDecode from 'jwt-decode'; // Asegúrate de que la importación sea correcta

interface DecodedToken {
  exp: number; 
  email?: string;
}

// Función para decodificar y validar el token, esto se va a utilzar de forma global tambien
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    // Decodifica el token usando jwt-decode
    const decoded: DecodedToken = jwtDecode(token);

    // Obtiene el tiempo actual en segundos
    const currentTime = Math.floor(Date.now() / 1000);

    // Verifica si el token ha expirado
    return currentTime < decoded.exp;
  } catch (error) {
    console.error("Error al decodificar el token JWT:", error);
    return false;
  }
};
