import React, { useState } from 'react';

const RegistrarUsuarioForm = () => {
  const [formData, setFormData] = useState({
    rif_cedula: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    tipo: 'Administrador'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Validaciones
      if (formData.contrasena !== formData.confirmarContrasena) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (formData.contrasena.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      const response = await fetch('/api/usuario/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rif_cedula: formData.rif_cedula,
          usuario: formData.usuario,
          contrasena: formData.contrasena,
          tipo: formData.tipo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      // Resetear formulario
      setFormData({
        rif_cedula: '',
        usuario: '',
        contrasena: '',
        confirmarContrasena: '',
        tipo: 'Administrador'
      });
      setSuccess('Usuario registrado exitosamente!');
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4">Registrar Nuevo Usuario</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl ">
        <form onSubmit={handleSubmit} className="space-y-6">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                RIF o Cédula *
              </label>
              <input
                type="text"
                name="rif_cedula"
                value={formData.rif_cedula}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre de Usuario *
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
                Contraseña *
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
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
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tipo de Usuario *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Administrador">Administrador</option>
                <option value="empresa">Empresa</option>
                <option value="empleado">Empleado</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out
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
                  Procesando...
                </>
              ) : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 bg-cyan-50 border-l-4 border-cyan-500 text-cyan-800 p-4 rounded">
        <h3 className="font-bold text-lg mb-2">Notas:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Todos los campos marcados con (*) son obligatorios</li>
          <li>La contraseña debe tener al menos 8 caracteres</li>
          <li>Los usuarios tipo "Empresa" necesitarán completar información adicional después del registro</li>
        </ul>
      </div>
    </div>
  );
};

export default RegistrarUsuarioForm;