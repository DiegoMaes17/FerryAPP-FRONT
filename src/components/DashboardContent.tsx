import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import GestionarUsuarioForm from './GestionarUsuarioForm';

type DashboardContentProps = {
  userName: string;
  activeOption: string;
  activeSubOption: string;
};

const DashboardContent = ({ 
  userName, 
  activeOption, 
  activeSubOption 
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

  // Mostrar formulario de registro
  if (activeOption === 'usuario' && activeSubOption === 'agregar') {
    return <RegistrarUsuarioForm />;
  }

  // Mostrar gestión de usuarios
  if (activeOption === 'usuario' && activeSubOption === 'gestionar') {
    return <GestionarUsuarioForm />;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4 capitalize">{activeOption}</h2>
      {activeSubOption && (
        <h3 className="text-xl font-semibold text-cyan-700 mb-6 capitalize">{activeSubOption}</h3>
      )}
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">
          Contenido de la opción seleccionada. Aquí iría la funcionalidad específica para 
          <span className="font-semibold"> {activeOption}</span>
          {activeSubOption && (
            <span> / <span className="font-semibold">{activeSubOption}</span></span>
          )}
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;