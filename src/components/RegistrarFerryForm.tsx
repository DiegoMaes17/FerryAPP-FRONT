import React, { useState } from 'react';

const RegistrarFerryForm = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    nombre: '',
    modelo: '',
    capacidad_economica: 0,
    capacidad_vip: 0,
    estado: true, // Por defecto, el ferry se registra como activo
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ 
            ...prev, 
            [name]: (name.includes('capacidad')) ? parseInt(value, 10) : value 
        }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones del frontend
    if (!formData.matricula || !formData.nombre || !formData.modelo) {
      setError('Matrícula, nombre y modelo son campos obligatorios.');
      return;
    }
    if (formData.capacidad_economica <= 0 || formData.capacidad_vip <= 0) {
      setError('Las capacidades deben ser números mayores a cero.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const rif_empresa = localStorage.getItem('userRif');

      if (!rif_empresa) {
        throw new Error('No se pudo identificar a la empresa. Inicie sesión de nuevo.');
      }
      
      const body = {
        ...formData,
        rif_empresa,
      };

      const response = await fetch('/api/ferry/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message || 'Error al registrar el ferry.');
      }

      setSuccess(`Ferry con matrícula ${data.matricula} registrado exitosamente.`);
      // Limpiar formulario
      setFormData({
        matricula: '', nombre: '', modelo: '',
        capacidad_economica: 0, capacidad_vip: 0, estado: true,
      });

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4">Registrar Nuevo Ferry</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
          {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">{success}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Matrícula *</label>
              <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del Ferry *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
             <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Modelo *</label>
              <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Capacidad Económica *</label>
              <input type="number" name="capacidad_economica" value={formData.capacidad_economica} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required min="1"/>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Capacidad VIP *</label>
              <input type="number" name="capacidad_vip" value={formData.capacidad_vip} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required min="1"/>
            </div>
            <div className="md:col-span-2 flex items-center gap-4">
              <label className="block text-gray-700 text-sm font-bold">Estado</label>
              <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"/>
              <span className="text-gray-700">{formData.estado ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-2 px-6 rounded-lg">
              {isLoading ? 'Registrando...' : 'Registrar Ferry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarFerryForm;