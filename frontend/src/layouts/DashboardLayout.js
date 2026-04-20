import Sidebar from "../components/sidebar/sidebar";
import { Outlet, useLocation } from "react-router-dom";

function DashboardLayout() {
  const location = useLocation();
  
  const getActiveNavId = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 0;
    if (path.includes('/transactions')) return 1;
    if (path.includes('/budgets')) return 12;
    if (path.includes('/savings')) return 13;
    if (path.includes('/newTransaction')) return 2;
    if (path.includes('/statistics')) return 9;
    if (path.includes('/savedTransactions')) return 11;
    if (path.includes('/settings')) return 3;
    return 0;
  };

  return (
    <div className="user-panel">
      <Sidebar activeNavId={getActiveNavId()} />
      <div className="user-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;