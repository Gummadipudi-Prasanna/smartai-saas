
import {
  LayoutDashboard,
  Sparkles,
  History,
  CreditCard,
  UserCircle,
  LogOut,
  Zap,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar({ activeSection = "dashboard", onNavigate, onLogout }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "generator",
      label: "AI Generator",
      icon: Sparkles,
    },
    {
      id: "history",
      label: "Content History",
      icon: History,
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: CreditCard,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: UserCircle,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Zap size={24} />
        </div>

        <div>
          <h2>SmartAI</h2>
          <span>SAAS PLATFORM</span>
        </div>
      </div>

      <div className="sidebar-menu">
        <p className="menu-heading">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`sidebar-link ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => onNavigate?.(item.id)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <button className="sidebar-logout" onClick={onLogout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>

        <p className="sidebar-version">SmartAI SaaS v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
