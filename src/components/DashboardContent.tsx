import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import GestionarUsuarioForm from './GestionarUsuarioForm';
import RegistrarEmpresaForm from './RegistrarEmpresaForm';
import GestionarEmpresaForm from './GestionarEmpresaForm';
import EditarEmpresaForm from './GestionarEmpresaForm';


type DashboardContentProps = {
  userName: string;
  activeOption: string;
  activeSubOption: string;
};

const DashboardContent = ({ 
  userName, 
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

  // Formularios de usuario
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



  // Formularios de empresa
  if (activeOption === 'empresa') {
    switch (activeSubOption) {
      case 'registrar':
        return <RegistrarEmpresaForm />;
      case 'gestionar':
        return <GestionarEmpresaForm />;
      case 'editar':
        return <EditarEmpresaForm />;
      case 'desactivar':
        return <GestionarEmpresaForm />; 
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