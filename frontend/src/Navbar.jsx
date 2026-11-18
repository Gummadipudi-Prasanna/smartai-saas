
import { Bell, UserCircle, Search } from "lucide-react";
import "./Navbar.css";

function Navbar({ username = "User", plan = "Free" }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back, {username}!</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>

        <button className="navbar-icon" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="navbar-user">
          <UserCircle size={32} />
          <div>
            <strong>{username}</strong>
            <span>{plan} Plan</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
