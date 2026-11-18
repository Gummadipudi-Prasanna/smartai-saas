
import { useEffect, useState } from "react";
import axios from "axios";

import ContentGenerator from "./ContentGenerator";
import ContentHistory from "./ContentHistory";
import Subscription from "./Subscription";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "./Dashboard.css";

function Dashboard({ onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [profile, setProfile] = useState(null);

  const [error, setError] = useState("");

  // Restore the last opened section after refresh
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "dashboard";
  });

  const username = localStorage.getItem("username") || "User";

  // Save the selected section in localStorage
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  // Clear the saved section when logging out
  const handleLogout = () => {
    localStorage.removeItem("activeSection");
    onLogout();
  };

  // Fetch dashboard data
  useEffect(() => {
    const token = localStorage.getItem("access");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchDashboardData = async () => {
      try {
        const [
          analyticsRes,
          subscriptionRes,
          usageRes,
          profileRes,
        ] = await Promise.all([
          axios.get(
            "http://127.0.0.1:8000/api/analytics/",
            { headers }
          ),
          axios.get(
            "http://127.0.0.1:8000/api/subscriptions/my-subscription/",
            { headers }
          ),
          axios.get(
            "http://127.0.0.1:8000/api/subscriptions/usage/",
            { headers }
          ),
          axios.get(
            "http://127.0.0.1:8000/api/auth/profile/",
            { headers }
          ),
        ]);

        setAnalytics(analyticsRes.data);
        setSubscription(subscriptionRes.data);
        setUsage(usageRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error(
          "Dashboard Error:",
          err.response?.data || err.message
        );

        setError(
          "Unable to load dashboard data. Please login again."
        );
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setError("Please login to continue.");
    }
  }, []);

  // Render selected section
  const renderContent = () => {
    switch (activeSection) {
      case "generator":
        return <ContentGenerator />;

      case "history":
        return <ContentHistory />;

      case "subscription":
        return <Subscription />;

      case "profile":
        return (
          <div className="dashboard-section">
            <h2>My Profile</h2>
            <p>Manage and view your account information.</p>

            <div className="profile-details">
              <p>
                <strong>Account ID:</strong>{" "}
                {profile?.id ?? "-"}
              </p>

              <p>
                <strong>Username:</strong>{" "}
                {profile?.username || "-"}
              </p>

              <p>
                <strong>First Name:</strong>{" "}
                {profile?.first_name || "-"}
              </p>

              <p>
                <strong>Last Name:</strong>{" "}
                {profile?.last_name || "-"}
              </p>

              <p>
                <strong>Email Address:</strong>{" "}
                {profile?.email || "-"}
              </p>

              <p>
                <strong>Subscription Plan:</strong>{" "}
                {subscription?.plan || "Free"}
              </p>

              <p>
                <strong>Account Status:</strong> Active
              </p>
            </div>

            <button
              className="profile-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        );

      case "dashboard":
      default:
        return (
          <>
            <div className="dashboard-heading">
              <h1>Welcome to SmartAI SaaS</h1>
              <p>AI-Powered Content Generation Platform</p>
            </div>

            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Total Generations</h3>
                <h2>
                  {analytics?.total_generations ?? 0}
                </h2>
              </div>

              <div className="dashboard-card">
                <h3>Today's Generations</h3>
                <h2>
                  {analytics?.today_generations ?? 0}
                </h2>
              </div>

              <div className="dashboard-card">
                <h3>Current Plan</h3>
                <h2>
                  {subscription?.plan || "Free"}
                </h2>
              </div>

              <div className="dashboard-card">
                <h3>Daily Limit</h3>
                <h2>
                  {usage?.daily_limit ?? 0}
                </h2>
              </div>

              <div className="dashboard-card">
                <h3>Remaining Generations</h3>
                <h2>
                  {usage?.remaining ?? 0}
                </h2>
              </div>
            </div>
          </>
        );
    }
  };

  if (error) {
    return <div className="dashboard">{error}</div>;
  }

  if (!analytics || !subscription || !usage || !profile) {
    return (
      <div className="dashboard">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="main-layout">
        <Navbar
          username={profile.username || username}
          plan={subscription.plan}
        />

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
