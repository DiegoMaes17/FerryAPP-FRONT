import React, { useState, useEffect, useCallback } from 'react';

// Interfaces
interface Ferry {
    matricula: string;
    rif_empresa: string;
    nombre: string;
    modelo: string;
    capacidad_economica: number;
    capacidad_vip: number;
    estado: boolean;
}

// Componente para el Modal de Gestión
const GestionModal = ({ ferry, onClose, onUpdate }: { ferry: Ferry, onClose: () => void, onUpdate: () => void }) => {
  const [formData, setFormData] = useState({
    nombre: ferry.nombre,
    modelo: ferry.modelo,
    capacidad_economica: ferry.capacidad_economica,
    capacidad_vip: ferry.capacidad_vip,
    estado: ferry.estado,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (name.includes('capacidad') ? parseInt(value) : value)
    }));
  };

  const handleGuardarCambios = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/ferry/actualizar/${ferry.matricula}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.Message || 'Error al actualizar');
      setSuccess('Ferry actualizado correctamente.');
      onUpdate(); // Callback para refrescar la lista
      setTimeout(onClose, 1500); // Cierra el modal tras el éxito
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-cyan-800 mb-4">Gestionar Ferry</h3>
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">Matrícula</label>
                    <input type="text" value={ferry.matricula} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100"/>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700">Modelo</label>
                    <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Capacidad Económica</label>
                    <input type="number" name="capacidad_economica" value={formData.capacidad_economica} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Capacidad VIP</label>
                    <input type="number" name="capacidad_vip" value={formData.capacidad_vip} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                <div className="flex items-center gap-4">
                    <label className="block text-gray-700 text-sm font-bold">Estado</label>
                    <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"/>
                    <span className="text-gray-700">{formData.estado ? 'Activo' : 'Inactivo'}</span>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancelar</button>
                <button onClick={handleGuardarCambios} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
     </div>
  );
};


// Componente principal que muestra la lista de ferris
const GestionarFerrysForm = () => {
    const [ferrys, setFerrys] = useState<Ferry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFerry, setSelectedFerry] = useState<Ferry | null>(null);

    const fetchFerrys = useCallback(async () => {
        setIsLoading(true);
        const rif = localStorage.getItem('userRif');
        if (!rif) {
            setError('RIF de empresa no encontrado.');
            setIsLoading(false);
            return;
        }
        try {
            // NOTA: Se asume un endpoint para traer ferris por RIF de empresa.
            const response = await fetch(`/api/empresas/${rif}/ferrys`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error('No se pudieron cargar los ferris.');
            const data = await response.json();
            setFerrys(data || []);
        } catch (err: any) {
            setError(err.message);
            setFerrys([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFerrys();
    }, [fetchFerrys]);

    const handleOpenModal = (ferry: Ferry) => setSelectedFerry(ferry);
    const handleCloseModal = () => setSelectedFerry(null);
    const handleUpdate = () => fetchFerrys();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-cyan-800 mb-6">Gestionar Flota de Ferris</h2>
            {isLoading && <p>Cargando flota...</p>}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
            
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ferrys.length > 0 ? (
                        ferrys.map(ferry => (
                            <div key={ferry.matricula} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
                                <div>
                                    <p className="text-xl font-bold text-cyan-900">{ferry.nombre}</p>
                                    <p className="text-gray-600">Matrícula: {ferry.matricula}</p>
                                    <p className="text-sm text-gray-500">Modelo: {ferry.modelo}</p>
                                    <p className="text-sm text-gray-500">Capacidad: {ferry.capacidad_economica} (Econ) / {ferry.capacidad_vip} (VIP)</p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                     <span className={`text-sm font-semibold flex items-center ${ferry.estado ? 'text-green-600' : 'text-red-600'}`}>
                                        <span className={`w-3 h-3 rounded-full mr-2 ${ferry.estado ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {ferry.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                    <button 
                                        onClick={() => handleOpenModal(ferry)}
                                        className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transform transition"
                                    >
                                        Gestionar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">No hay ferris registrados en la flota.</p>
                    )}
                </div>
            )}

            {selectedFerry && (
                <GestionModal 
                    ferry={selectedFerry} 
                    onClose={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default GestionarFerrysForm;