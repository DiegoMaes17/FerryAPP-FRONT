 import React, { useState } from 'react';

const RegistrarEmpleadoForm = () => {
  const [formData, setFormData] = useState({
    // Empleado
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    cargo: '',
    numero_tlf: '',
    // Usuario
    usuario: '',
    contrasena: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación simple de campos no vacíos
    const { contrasena, ...restData } = formData;
    if (Object.values(restData).some(field => field.trim() === '') || contrasena.trim() === '') {
      setError('Todos los campos son obligatorios.');
      return;
    }
     if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }


    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const rif_empresa = localStorage.getItem('userRif'); // Obtener RIF de la empresa logueada

      if (!rif_empresa) {
        throw new Error('No se pudo identificar a la empresa. Por favor, inicie sesión nuevamente.');
      }

      // Estructura de la solicitud anidada como espera el backend
      const requestBody = {
        empleado: {
          cedula: formData.cedula,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          cargo: formData.cargo,
          numero_tlf: formData.numero_tlf,
          rif_empresa: rif_empresa,
        },
        usuario: {
          usuario: formData.usuario,
          contrasena: formData.contrasena,
        },
      };

      const response = await fetch('/api/empleado/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el empleado.');
      }

      setSuccess(`Empleado ${data.Cedula} registrado exitosamente con el usuario ${data.Usuario}.`);
      // Limpiar formulario
      setFormData({
        cedula: '', nombres: '', apellidos: '', email: '', cargo: '', numero_tlf: '',
        usuario: '', contrasena: '',
      });

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4">Registrar Nuevo Empleado</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
          {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">{success}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- DATOS DEL EMPLEADO --- */}
            <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-cyan-700 mb-2 border-b">Datos Personales</h3>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Cédula *</label>
              <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
             <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombres *</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Apellidos *</label>
              <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Cargo *</label>
              <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
             <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Número de Teléfono *</label>
              <input type="text" name="numero_tlf" value={formData.numero_tlf} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>

            {/* --- DATOS DEL USUARIO --- */}
            <div className="md:col-span-2 mt-4">
                 <h3 className="text-lg font-semibold text-cyan-700 mb-2 border-b">Datos de Acceso</h3>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de Usuario *</label>
              <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña *</label>
              <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-2 px-6 rounded-lg">
              {isLoading ? 'Registrando...' : 'Registrar Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarEmpleadoForm;