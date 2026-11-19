
import { useState } from "react";
import {
  Bell,
  UserCircle,
  Search,
  X,
  CreditCard,
  Sparkles,
} from "lucide-react";
import "./Navbar.css";

function Navbar({
  username = "User",
  plan = "Free",
  usage,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  onNavigate,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const remaining = usage?.remaining ?? 0;
  const dailyLimit = usage?.daily_limit ?? 0;
  const used = Math.max(dailyLimit - remaining, 0);

  const handleProfileClick = () => {
    setShowNotifications(false);
    onNavigate("profile");
  };

  const handleSubscriptionClick = () => {
    setShowNotifications(false);
    onNavigate("subscription");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back, {username}!</p>
        </div>
      </div>

      <div className="navbar-right">
        <form
          className="navbar-search"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <Search size={18} />

          <input
            type="text"
            placeholder="Search generated content..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search generated content"
          />

          {searchQuery && (
            <button
              type="button"
              className="navbar-search-clear"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </form>

        <div className="navbar-notification-wrapper">
          <button
            className="navbar-icon"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() =>
              setShowNotifications((previous) => !previous)
            }
          >
            <Bell size={20} />
          </button>

          {showNotifications && (
            <div className="navbar-notification-panel">
              <div className="notification-header">
                <h3>Notifications</h3>

                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="notification-item">
                <Sparkles size={19} />

                <div>
                  <strong>Daily Usage</strong>
                  <p>
                    You have used {used} of {dailyLimit} generations
                    today.
                  </p>
                  <span>{remaining} generations remaining</span>
                </div>
              </div>

              <div className="notification-item">
                <CreditCard size={19} />

                <div>
                  <strong>Current Subscription</strong>
                  <p>Your current plan is {plan}.</p>

                  <button
                    className="notification-link"
                    onClick={handleSubscriptionClick}
                  >
                    View Subscription
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="navbar-user"
          onClick={handleProfileClick}
          aria-label="Open My Profile"
        >
          <UserCircle size={32} />

          <div>
            <strong>{username}</strong>
            <span>{plan} Plan</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
