import { useState, useEffect } from 'react';
import DashboardLayout from './layout/DashboardLayout';
import DashboardContent from './DashboardContent';
import Sidebar from './layout/Sidebar';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [activeOption, setActiveOption] = useState('');
  const [activeSubOption, setActiveSubOption] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || 'Usuario';
    const storedUserType = localStorage.getItem('userType') || 'administrador';
    
    setUserName(storedUserName);
    setUserType(storedUserType);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex w-full">
        <Sidebar
          userName={userName}
          userType={userType}
          activeOption={activeOption}
          setActiveOption={setActiveOption}
          activeSubOption={activeSubOption}
          setActiveSubOption={setActiveSubOption}
        />
        
        {/* Área de contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Barra superior */}
          <div className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-cyan-800">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                {userType}
              </div>
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1 p-6 overflow-y-auto">
            <DashboardContent 
              userName={userName}
              activeOption={activeOption}
              activeSubOption={activeSubOption}
            />
          </div>
          
          {/* Pie de página */}
          <div className="bg-white border-t p-4 text-center text-gray-500 text-sm">
            FerryAPP - Gestión de facturacion &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;