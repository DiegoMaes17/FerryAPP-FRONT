import React, { useState, useEffect } from 'react';

interface Usuario {
  rif_cedula: string;
  usuario: string;
  tipo: string;
  estado: boolean;
}

const GestionarUsuarioForm = () => {
  const [busqueda, setBusqueda] = useState('');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    usuario: '',
    tipo: '',
  });
  const [passwordData, setPasswordData] = useState({
    nuevaContrasena: '',
    confirmarContrasena: '',
  });

  // Actualizar formData cuando cambia el usuario
  useEffect(() => {
    if (usuario) {
      setFormData({
        usuario: usuario.usuario,
        tipo: usuario.tipo,
      });
    }
  }, [usuario]);

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      setError('Por favor ingrese una cédula o RIF');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setUsuario(null);

    try {
      const response = await fetch(`/api/usuario/${busqueda}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar usuario');
      }

      setUsuario(data);
      setSuccess('Usuario encontrado');
    } catch (err: any) {
      setError(err.message || 'Error al buscar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardarCambios = async () => {
    if (!usuario) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/usuario/${usuario.rif_cedula}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          // No enviamos contraseña aquí porque tiene su propio endpoint
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar usuario');
      }

      // Actualizar el usuario en el estado
      setUsuario({
        ...usuario,
        usuario: formData.usuario,
        tipo: formData.tipo,
      });

      setSuccess('Cambios guardados exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al guardar cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCambiarContrasena = async () => {
    if (!usuario) return;
    
    // Validaciones
    if (passwordData.nuevaContrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (passwordData.nuevaContrasena !== passwordData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/usuario/${usuario.rif_cedula}/cambiar-contrasena`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nuevaContrasena: passwordData.nuevaContrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar contraseña');
      }

      setSuccess('Contraseña actualizada exitosamente');
      setShowPasswordModal(false);
      setPasswordData({ nuevaContrasena: '', confirmarContrasena: '' });
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCambiarEstado = async () => {
    if (!usuario) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const accion = usuario.estado ? 'desactivar' : 'activar';
      const response = await fetch(`/api/usuarios/${usuario.rif_cedula}/${accion}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar estado');
      }

      // Actualizar el estado del usuario
      setUsuario({
        ...usuario,
        estado: !usuario.estado,
      });

      setSuccess(`Usuario ${accion} correctamente`);
      setShowConfirm(false);
    } catch (err: any) {
      setError(err.message || 'Error al cambiar estado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4">Gestionar Usuario</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
        {/* Búsqueda */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Buscar por RIF o Cédula
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ej: V12345678 o J-123456789"
            />
            <button
              onClick={handleBuscar}
              disabled={isLoading}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 hover:scale-105 transform transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded-lg flex items-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Buscar
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}

        {success && !usuario && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            {success}
          </div>
        )}

        {usuario && (
          <div className="border-t border-gray-200 pt-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-cyan-700 mb-4">Datos del Usuario</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    RIF/Cédula
                  </label>
                  <input
                    type="text"
                    value={usuario.rif_cedula}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Estado
                  </label>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${usuario.estado ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{usuario.estado ? 'Activo' : 'Inactivo'}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de Usuario
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="administrador">Administrador</option>
                    <option value="empresa">Empresa</option>
                    <option value="empleado">Empleado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleGuardarCambios}
                disabled={isLoading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Guardar Cambios
              </button>
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cambiar Contraseña
              </button>
              
              <button
                onClick={() => setShowConfirm(true)}
                className={`${usuario.estado 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded-lg`}
              >
                {usuario.estado ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmación para estado */}
        {showConfirm && usuario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
              <h3 className="text-xl font-bold text-cyan-800 mb-4">Confirmar acción</h3>
              <p className="mb-6">
                ¿Está seguro que desea {usuario.estado ? 'desactivar' : 'activar'} al usuario 
                <span className="font-semibold"> {usuario.usuario}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCambiarEstado}
                  disabled={isLoading}
                  className={`${usuario.estado 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded-lg flex items-center`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {usuario.estado ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para cambiar contraseña */}
        {showPasswordModal && usuario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
              <h3 className="text-xl font-bold text-cyan-800 mb-4">Cambiar Contraseña</h3>
              <p className="mb-4">Para el usuario: <span className="font-semibold">{usuario.usuario}</span></p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="nuevaContrasena"
                    value={passwordData.nuevaContrasena}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmarContrasena"
                    value={passwordData.confirmarContrasena}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ nuevaContrasena: '', confirmarContrasena: '' });
                    setError('');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCambiarContrasena}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>
        )}

        {success && usuario && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionarUsuarioForm;