import React, { useState, useEffect, useCallback } from 'react';

// Interfaces
interface Empleado {
  cedula: string;
  nombres: string;
  apellidos: string;
  rif_empresa: string;
  email: string;
  cargo: string;
  estado: boolean;
  numero_tlf: string;
}

// Componente para el Modal de Gestión
const GestionModal = ({ empleado, onClose, onUpdate }: { empleado: Empleado, onClose: () => void, onUpdate: () => void }) => {
  const [formData, setFormData] = useState({
    nombres: empleado.nombres,
    apellidos: empleado.apellidos,
    email: empleado.email,
    cargo: empleado.cargo,
    numero_tlf: empleado.numero_tlf,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardarCambios = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/empleado/actualizar/${empleado.cedula}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar');
      setSuccess('Empleado actualizado correctamente.');
      onUpdate(); // Callback para refrescar la lista
      setTimeout(onClose, 1500); // Cierra el modal tras el éxito
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCambiarEstado = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const accion = empleado.estado ? 'desactivar' : 'activar';
    try {
        const response = await fetch(`/api/empleado//${accion}/${empleado.cedula}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al cambiar estado');
        setSuccess(`Empleado ${accion} correctamente.`);
        onUpdate();
         setTimeout(onClose, 1500);
    } catch (err:any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };


  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-cyan-800 mb-4">Gestionar Empleado</h3>
             {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">Cédula</label>
                    <input type="text" value={empleado.cedula} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100"/>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700">Nombres</label>
                    <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700">Apellidos</label>
                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Cargo</label>
                    <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700">Teléfono</label>
                    <input type="text" name="numero_tlf" value={formData.numero_tlf} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancelar</button>
                 <button onClick={handleCambiarEstado} disabled={isLoading} className={`${empleado.estado ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded-lg`}>
                    {isLoading ? '...' : (empleado.estado ? 'Desactivar' : 'Activar')}
                </button>
                <button onClick={handleGuardarCambios} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </div>
     </div>
  );
};


// Componente principal que muestra la lista de empleados
const GestionarEmpleadosWrapper = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);

    const fetchEmpleados = useCallback(async () => {
        setIsLoading(true);
        const rif = localStorage.getItem('userRif');
        if (!rif) {
            setError('RIF de empresa no encontrado.');
            setIsLoading(false);
            return;
        }
        try {
            // NOTA: Asumiendo que tienes un endpoint para traer empleados por RIF de empresa.
            // Si no existe, deberás crearlo en el backend.
            const response = await fetch(`/api/empresas/${rif}/empleados`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error('No se pudieron cargar los empleados.');
            const data = await response.json();
            setEmpleados(data || []);
        } catch (err: any) {
            setError(err.message);
            setEmpleados([]); // Limpia la lista en caso de error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmpleados();
    }, [fetchEmpleados]);

    const handleOpenModal = (empleado: Empleado) => {
        setSelectedEmpleado(empleado);
    };

    const handleCloseModal = () => {
        setSelectedEmpleado(null);
    };

    const handleUpdate = () => {
      fetchEmpleados(); // Refresca la lista de empleados
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-cyan-800 mb-6">Gestionar Empleados</h2>
            {isLoading && <p>Cargando empleados...</p>}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
            
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {empleados.length > 0 ? (
                        empleados.map(empleado => (
                            <div key={empleado.cedula} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
                                <div>
                                    <p className="text-lg font-bold text-cyan-900">{empleado.nombres} {empleado.apellidos}</p>
                                    <p className="text-gray-600">{empleado.cargo}</p>
                                    <p className="text-sm text-gray-500">{empleado.email}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                     <span className={`text-sm font-semibold flex items-center ${empleado.estado ? 'text-green-600' : 'text-red-600'}`}>
                                        <span className={`w-3 h-3 rounded-full mr-2 ${empleado.estado ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {empleado.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                    <button 
                                        onClick={() => handleOpenModal(empleado)}
                                        className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transform transition"
                                    >
                                        Gestionar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">No hay empleados registrados.</p>
                    )}
                </div>
            )}

            {selectedEmpleado && (
                <GestionModal 
                    empleado={selectedEmpleado} 
                    onClose={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default GestionarEmpleadosWrapper;