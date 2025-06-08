import type { ReactNode } from 'react'; 

type SidebarProps = {
  userName: string;
  userType: string;
  activeOption: string;
  setActiveOption: (option: string) => void;
  activeSubOption: string;
  setActiveSubOption: (subOption: string) => void;
};

const Sidebar = ({ 
  userName, 
  userType,
  activeOption,
  setActiveOption,
  activeSubOption,
  setActiveSubOption
}: SidebarProps) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  // Función para renderizar las opciones de menú según el tipo de usuario
  const renderMenuOptions = (): ReactNode => {
    // Administrador
    if (userType === 'Administrador') {
      return (
        <>
          <div 
            className={`px-4 py-3 cursor-pointer ${activeOption === 'empresa' ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
            onClick={() => setActiveOption(activeOption === 'empresa' ? '' : 'empresa')}
          >
            <div className="flex justify-between items-center">
              <span>Empresa</span>
              <span>{activeOption === 'empresa' ? '▲' : '▼'}</span>
            </div>
          </div>
          
          {activeOption === 'empresa' && (
            <div className="bg-cyan-900 pl-8">
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'registrar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('registrar')}
              >
                Registrar
              </div>
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'gestionar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('gestionar')}
              >
                Gestionar
              </div>
            </div>
          )}
          
          <div 
            className={`px-4 py-3 cursor-pointer ${activeOption === 'usuario' ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
            onClick={() => setActiveOption(activeOption === 'usuario' ? '' : 'usuario')}
          >
            <div className="flex justify-between items-center">
              <span>Usuario</span>
              <span>{activeOption === 'usuario' ? '▲' : '▼'}</span>
            </div>
          </div>
          
          {activeOption === 'usuario' && (
            <div className="bg-cyan-900 pl-8">
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'agregar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('agregar')}
              >
                Agregar
              </div>
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'gestionar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('gestionar')}
              >
                Gestionar
              </div>
            </div>
          )}
        </>
      );
    }
    
    // Empresa
    if (userType === 'empresa') {
      return (
        <>
          <div 
            className={`px-4 py-3 cursor-pointer ${activeOption === 'gestión' ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
            onClick={() => setActiveOption(activeOption === 'gestión' ? '' : 'gestión')}
          >
            <div className="flex justify-between items-center">
              <span>Gestión</span>
              <span>{activeOption === 'gestión' ? '▲' : '▼'}</span>
            </div>
          </div>
          
          {activeOption === 'gestión' && (
            <div className="bg-cyan-900 pl-8">
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'gestionar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('gestionar')}
              >
                Empresa
              </div>              
              
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'ver facturas' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('ver facturas')}
              >
                Ver facturas
              </div>
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'ver empleados' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('ver empleados')}
              >
                Ver empleados
              </div>
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'dashboard de ingresos' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('dashboard de ingresos')}
              >
                Dashboard de ingresos
              </div>
            </div>
          )}

          
          <div 
            className={`px-4 py-3 cursor-pointer ${activeOption === 'ferry' ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
            onClick={() => setActiveOption(activeOption === 'ferry' ? '' : 'ferry')}
          >
            <div className="flex justify-between items-center">
              <span>Ferry</span>
              <span>{activeOption === 'ferry' ? '▲' : '▼'}</span>
            </div>
          </div>
          
          {activeOption === 'ferry' && (
            <div className="bg-cyan-900 pl-8">
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'agregar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('agregar')}
              >
                Agregar
              </div>
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'desactivar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('desactivar')}
              >
                Desactivar
              </div>
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'editar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('editar')}
              >
                Editar
              </div>
            </div>
          )}
          
          <div 
            className={`px-4 py-3 cursor-pointer ${activeOption === 'empleado' ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
            onClick={() => setActiveOption(activeOption === 'empleado' ? '' : 'empleado')}
          >
            <div className="flex justify-between items-center">
              <span>Empleado</span>
              <span>{activeOption === 'empleado' ? '▲' : '▼'}</span>
            </div>
          </div>
          
          {activeOption === 'empleado' && (
            <div className="bg-cyan-900 pl-8">
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'agregar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('agregar')}
              >
                Agregar
              </div>
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'desactivar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('desactivar')}
              >
                Desactivar
              </div>
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'editar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('editar')}
              >
                Editar
              </div>
            </div>
          )}
          

        </>
      );
    }
    
    // Empleado
    if (userType === 'empleado') {
      return (
        <>
          <div 
            className={`px-4 py-3 cursor-pointer ${activeOption === 'usuario' ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
            onClick={() => setActiveOption(activeOption === 'usuario' ? '' : 'usuario')}
          >
            <div className="flex justify-between items-center">
              <span>Usuario</span>
              <span>{activeOption === 'usuario' ? '▲' : '▼'}</span>
            </div>
          </div>
          
          {activeOption === 'usuario' && (
            <div className="bg-cyan-900 pl-8">
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'modificar' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('modificar')}
              >
                Modificar
              </div>
            </div>
          )}
          
          <div 
            className={`px-4 py-3 cursor-pointer ${activeOption === 'factura' ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
            onClick={() => setActiveOption(activeOption === 'factura' ? '' : 'factura')}
          >
            <div className="flex justify-between items-center">
              <span>Factura</span>
              <span>{activeOption === 'factura' ? '▲' : '▼'}</span>
            </div>
          </div>
          
          {activeOption === 'factura' && (
            <div className="bg-cyan-900 pl-8">
              <div 
                className={`py-2 px-4 cursor-pointer ${activeSubOption === 'generar factura' ? 'text-cyan-300' : 'hover:text-cyan-300'}`}
                onClick={() => setActiveSubOption('generar factura')}
              >
                Generar factura
              </div>
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="w-64 bg-cyan-800 text-white flex flex-col">
      {/* Encabezado del sidebar */}
      <div className="p-4 border-b border-cyan-700 flex items-center">
        <img 
          src="/boat.png" 
          alt="FerryAPP Logo" 
          className="w-10 h-10 object-contain mr-3"
        />
        <h2 className="text-xl font-bold">Ferry<span className="text-cyan-300">APP</span></h2>
      </div>
      
      {/* Información del usuario */}
      <div className="p-4 border-b border-cyan-700">
        <div className="flex items-center mb-3">
          <div className="bg-cyan-600 rounded-full w-12 h-12 flex items-center justify-center mr-3">
            <span className="font-bold">{userName.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-cyan-300 capitalize">{userType}</p>
          </div>
        </div>
      </div>
      
      {/* Menú de opciones */}
      <div className="flex-1 overflow-y-auto py-4">
        {renderMenuOptions()}
      </div>
      
      {/* Pie del sidebar */}
      <div className="p-4 border-t border-cyan-700">
        <button 
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-cyan-700 hover:bg-cyan-600 rounded-lg text-white flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;