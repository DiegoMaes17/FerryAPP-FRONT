import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import GestionarUsuarioForm from './GestionarUsuarioForm';
import RegistrarEmpresaForm from './RegistrarEmpresaForm';
import GestionarEmpresaForm from './GestionarEmpresaForm'; 
import EditarEmpresaForm from './GestionarEmpresaForm';


import RegistrarEmpleadoForm from './RegistrarEmpleadoForm';
import GestionarEmpleadosWrapper from './GestionarEmpleadoForm';

import RegistrarFerryForm from './RegistrarFerryForm';
import GestionarFerrysForm from './GestionarFerryForm';


type DashboardContentProps = {
  userName: string;
  userType: string; 
  activeOption: string;
  activeSubOption: string;
};

const DashboardContent = ({ 
  userName, 
  userType, 
  activeOption, 
  activeSubOption,
}: DashboardContentProps) => {
  if (!activeOption) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-cyan-800 mb-6">Bienvenido, {userName}!</h1>
        <p className="text-xl text-gray-600 max-w-2xl text-center">
          Gracias por usar FerryAPP. Selecciona una opción del menú para comenzar a gestionar 
          tus operaciones.
        </p>
        <div className="mt-10">
          <img 
            src="/boat.png" 
            alt="FerryAPP Logo" 
            className="w-64 h-64 object-contain opacity-20"
          />
        </div>
      </div>
    );
  }

  // Formularios de usuario (para Administrador)
  if (activeOption === 'usuario') {
    switch (activeSubOption) {
      case 'agregar':
        return <RegistrarUsuarioForm />;
      case 'gestionar':
        return <GestionarUsuarioForm />;
      default:
        break;
    }
  }

  // Formularios de empresa (para Administrador)
  if (activeOption === 'empresa') {
    switch (activeSubOption) {
      case 'registrar':
        return <RegistrarEmpresaForm />;
      case 'gestionar':
        return <GestionarEmpresaForm userType="Administrador" />;
      case 'editar':
        return <EditarEmpresaForm />;
      case 'desactivar':
        return <GestionarEmpresaForm userType="Administrador" />; 
      default:
        break;
    }
  }

  // Opciones de gestión para el usuario "empresa"
  if (activeOption === 'gestión') {
    switch (activeSubOption) {
      case 'gestionar':
        return <GestionarEmpresaForm userType={userType} />;
      default:
        break;
    }
  }

  // --- NUEVA SECCIÓN PARA GESTIÓN DE EMPLEADOS ---
  // (Accesible por el tipo de usuario 'empresa')
  if (activeOption === 'empleado') {
    switch (activeSubOption) {
      case 'registrar':
        return <RegistrarEmpleadoForm />;
      case 'gestionar':
        return <GestionarEmpleadosWrapper />;
      default:
        break;
    }
  }

    if (activeOption === 'ferry') {
    switch (activeSubOption) {
      case 'registrar':
        return <RegistrarFerryForm />;
      case 'gestionar':
        return <GestionarFerrysForm />;
      default:
        break;
    }
  }


  // Contenido genérico para otras opciones
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4 capitalize">{activeOption}</h2>
      {activeSubOption && (
        <h3 className="text-xl font-semibold text-cyan-700 mb-6 capitalize">{activeSubOption}</h3>
      )}
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">
          Este es el menu de:
          <span className="font-semibold"> {activeOption}</span>   
         </p>
         <p className="text-gray-600">Porfavor seleccione una opcion para continuar</p>
      </div>
    </div>
  );
};

export default DashboardContent;