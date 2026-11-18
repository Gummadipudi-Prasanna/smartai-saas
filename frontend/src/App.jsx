
import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isRegister, setIsRegister] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("access"))
  );

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);
    setIsError(false);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          username: username.trim(),
          password: password,
        }
      );

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("username", username.trim());

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      setIsError(true);

      if (error.response?.status === 401) {
        setMessage("Invalid username or password.");
      } else if (!error.response) {
        setMessage("Backend server is not running.");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    if (password.length < 8) {
      setIsError(true);
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          username: username.trim(),
          email: email.trim(),
          password: password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        }
      );

      setIsError(false);
      setMessage("Registration successful! Please login.");

      setIsRegister(false);
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data || error.message
      );

      setIsError(true);

      if (!error.response) {
        setMessage("Backend server is not running.");
      } else if (error.response.status === 400) {
        const errors = error.response.data;
        const firstError = Object.values(errors).flat()[0];
        setMessage(
          typeof firstError === "string"
            ? firstError
            : "Please check your registration details."
        );
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setIsRegister(false);
    setUsername("");
    setPassword("");
    setMessage("");
  };

  if (isLoggedIn) {
    return (
      <>
        <Dashboard onLogout={handleLogout} />
      </>
    );
  }

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={isRegister ? handleRegister : handleLogin}
      >
        <h1>SmartAI SaaS</h1>
        <p>AI-Powered Content Generation Platform</p>

        {isRegister && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? isRegister
              ? "Creating Account..."
              : "Logging in..."
            : isRegister
              ? "Create Account"
              : "Login"}
        </button>

        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}

        <p>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
          {" "}
          <button
            type="button"
            className="toggle-auth-button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setIsError(false);
              setPassword("");
              setConfirmPassword("");
            }}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default App;
