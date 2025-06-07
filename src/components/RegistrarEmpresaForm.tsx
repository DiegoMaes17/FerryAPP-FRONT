import React, { useState } from 'react';

const RegistrarEmpresaForm = () => {
  const [empresaData, setEmpresaData] = useState({
    rif: '',
    nombre: '',
    email: '',
    direccion: ''
  });
  
  const [usuarioData, setUsuarioData] = useState({
    usuario: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpresaData(prev => ({ ...prev, [name]: value }));
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuarioData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Validaciones
      if (usuarioData.contrasena !== usuarioData.confirmarContrasena) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (usuarioData.contrasena.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      // Validar campos obligatorios
      const camposObligatorios = [
        empresaData.rif, empresaData.nombre, empresaData.email, 
        usuarioData.usuario, usuarioData.contrasena
      ];
      
      if (camposObligatorios.some(campo => !campo.trim())) {
        throw new Error('Todos los campos marcados con * son obligatorios');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(empresaData.email)) {
        throw new Error('El formato del email es inválido');
      }

      // Validar formato de RIF (ejemplo básico)
      const rifRegex = /^[JGVEP]-\d{8,9}$/;
      if (!rifRegex.test(empresaData.rif)) {
        throw new Error('Formato de RIF inválido. Ejemplos válidos: J-123456789, G-987654321');
      }

      // Preparar datos para enviar
      const requestData = {
        empresa: {
          rif: empresaData.rif.replace(/^J-/, ''),
          nombre: empresaData.nombre,
          email: empresaData.email,
          direccion: empresaData.direccion
        },
        usuario: {
          usuario: usuarioData.usuario,
          contrasena: usuarioData.contrasena
        }
      };


       console.log('Payload enviado:', JSON.stringify(requestData, null, 2));

      const response = await fetch('/api/empresas/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({
              error: response.statusText
          }));
          throw new Error(errorData.error || 'Error al registrar empresa');
        }

      const data = await response.json();

      // Resetear formulario
      setEmpresaData({
        rif: '',
        nombre: '',
        email: '',
        direccion: ''
      });
      
      setUsuarioData({
        usuario: '',
        contrasena: '',
        confirmarContrasena: ''
      });
      
      setSuccess('¡Empresa registrada exitosamente!');
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4">Registrar Nueva Empresa</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              {success}
            </div>
          )}
          
          {/* Sección de Datos de la Empresa */}
          <div>
            <h3 className="text-xl font-semibold text-cyan-700 mb-6 pb-2 border-b border-cyan-200">
              Información de la Empresa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  RIF *
                </label>
                <input
                  type="text"
                  name="rif"
                  value={empresaData.rif}
                  onChange={handleEmpresaChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Ej: J-123456789"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Formato: Letra guión y números (Ej: J-123456789)</p>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={empresaData.nombre}
                  onChange={handleEmpresaChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={empresaData.email}
                  onChange={handleEmpresaChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="contacto@empresa.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={empresaData.direccion}
                  onChange={handleEmpresaChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Av. Principal, Ciudad"
                />
              </div>
            </div>
          </div>
          
          {/* Sección de Usuario Administrador */}
          <div>
            <h3 className="text-xl font-semibold text-cyan-700 mb-6 pb-2 border-b border-cyan-200">
              Usuario Administrador
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  name="usuario"
                  value={usuarioData.usuario}
                  onChange={handleUsuarioChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="usuario_admin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={usuarioData.contrasena}
                  onChange={handleUsuarioChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  name="confirmarContrasena"
                  value={usuarioData.confirmarContrasena}
                  onChange={handleUsuarioChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition duration-300 ease-in-out
                ${isSubmitting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-teal-600 hover:to-cyan-700 hover:scale-105'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </>
              ) : 'Registrar Empresa'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 bg-cyan-50 border-l-4 border-cyan-500 text-cyan-800 p-4 rounded">
        <h3 className="font-bold text-lg mb-2">Notas importantes:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Todos los campos marcados con (*) son obligatorios</li>
          <li>La contraseña debe tener al menos 8 caracteres</li>
          <li>El usuario administrador tendrá acceso completo a la gestión de la empresa</li>
          <li>Verifique que el RIF y email sean correctos antes de enviar el formulario</li>
          <li>Después del registro, se enviará un correo de confirmación a la dirección proporcionada</li>
        </ul>
      </div>
    </div>
  );
};

export default RegistrarEmpresaForm;