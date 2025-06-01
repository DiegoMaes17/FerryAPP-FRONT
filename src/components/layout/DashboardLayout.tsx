import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      {children}
    </div>
  );
};

export default DashboardLayout;