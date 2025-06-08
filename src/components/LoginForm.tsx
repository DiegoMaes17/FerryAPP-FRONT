import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    usuario: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Enviar las credenciales 
      const response = await axios.post('/api/login', {
        usuario: {
          usuario: credentials.usuario,
          contrasena: credentials.contrasena
        }
      });
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);

      // Guardar datos del usuario
      localStorage.setItem('userName', credentials.usuario);
      localStorage.setItem('userType', response.data.tipo);
      localStorage.setItem('userRif', response.data.rif_cedula);
      
      // Redirigir al dashboard
      navigate('/dashboard');

    } catch (err: any) {
      // Manejo de errores específicos
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Extraer el mensaje de error del backend
          if (err.response.data && err.response.data.error) {
            setError(err.response.data.error);
          } else {
            setError('Error en el servidor');
          }
        } else if (err.request) {
          setError('No se pudo conectar con el servidor');
        } else {
          setError('Error inesperado');
        }
      } else {
        setError('Error desconocido: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="w-full max-w-md px-6 py-12 bg-white rounded-3xl shadow-xl">
        {/* Logo con temática de ferry */}
        <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center p-2">
                <img 
                src="/boat.png" 
                alt="FerryAPP Logo" 
                className="w-full h-full object-contain" />
            </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-cyan-800 mb-2">
          Ferry<span className="text-blue-600">APP</span>
        </h1>
        <p className="text-center text-gray-600 mb-8">Gestión de facturas</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              required
              value={credentials.usuario}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              placeholder="Ingresa tu usuario"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              required
              value={credentials.contrasena}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 py-2 px-4 rounded-lg animate-fadeIn">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-white font-medium transition
                ${isLoading 
                  ? 'bg-cyan-400 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-100 hover:shadow-cyan-200'}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="px-3 text-gray-500 text-sm">¿Necesitas ayuda?</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>
          
          <p className="text-sm text-gray-600">
            Soporte técnico: <a href="mailto:soporte@ferryapp.com" className="text-cyan-600 hover:underline">soporte@ferryapp.com</a>
          </p>
        </div>
      </div>
      
      {/* Elementos decorativos con temática marina */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-cyan-700 opacity-20"></div>
      <div className="absolute bottom-4 left-10 w-24 h-8 bg-cyan-800 rounded-t-full opacity-30"></div>
      <div className="absolute bottom-4 right-10 w-16 h-8 bg-cyan-800 rounded-t-full opacity-30"></div>
      
    </div>
  );
};

export default LoginForm;