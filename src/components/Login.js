import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // success | error | warning

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Signup
  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setMsgType("warning");
      setMessage("⚠ Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMsgType("success");
        setMessage("✅ Signup successful! Please login.");
        setIsSignup(false);
        setForm({ name: "", email: "", password: "" });
      } else {
        setMsgType("error");
        setMessage(`❌ ${data.message || "Signup failed"}`);
      }
    } catch (err) {
      setMsgType("error");
      setMessage("🚫 Server connection error");
    }
  };

  // Handle Login
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setMsgType("warning");
      setMessage("⚠ Please enter your email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsgType("success");
       // setMessage("✅ Login successful!");
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000); // Short delay for UX
      } else {
        setMsgType("error");
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      setMsgType("error");
      setMessage("🚫 Server connection error");
    }
  };

  return (
    <div className="avatar-login-page">
      <div className="overlay"></div>

      <ul className="glow-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>

      <div className={`glass-card ${isSignup ? "flip" : ""}`}>
        <div className="card-inner">

          {/* Login Face */}
          <div className="card-face card-login">
            <h2 className="login-title">LOGIN</h2>

            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              className="input-field"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              className="input-field"
              value={form.password}
              onChange={handleChange}
            />

            <button className="login-btn" onClick={handleLogin}>ENTER</button>

            {message && !isSignup && (
              <div className={`message-box ${msgType}`}>{message}</div>
            )}

            <div className="footer-text">
              <a href="#" className="forgot">Forgot Password?</a>
              <span> Don’t have an account? </span>
              <button className="toggle-btn" onClick={() => setIsSignup(true)}>
                SIGN UP
              </button>
            </div>
          </div>

          {/* Signup Face */}
          <div className="card-face card-signup">
            <h2 className="login-title">SIGN UP</h2>

            <input
              type="text"
              name="name"
              placeholder="FULL NAME"
              className="input-field"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              className="input-field"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              className="input-field"
              value={form.password}
              onChange={handleChange}
            />

            <button className="login-btn" onClick={handleSignup}>REGISTER</button>

            {message && isSignup && (
              <div className={`message-box ${msgType}`}>{message}</div>
            )}

            <div className="footer-text">
              <span>Already have an account? </span>
              <button className="toggle-btn" onClick={() => setIsSignup(false)}>
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
