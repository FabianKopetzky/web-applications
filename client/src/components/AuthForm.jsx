import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ============================================
   API FUNCTIONS
   ============================================ */

async function registerUser(email) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Registration failed");
  }
}

async function completeRegistration(token, first_name, last_name, password) {
  const res = await fetch(`/api/register/${token}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ first_name, last_name, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Activation failed");
  }
}

async function loginUser(email, password) {
  const res = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",
    body: new URLSearchParams({
      username: email,
      password: password,
      grant_type: "password",
      client_id: "client",
    }),
  });

  

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Login failed");
  }

  return res.json(); // { message: "Logged in successfully" }
}


/* ============================================
   AUTH FORM COMPONENT
   ============================================ */

export default function AuthForm({ mode }) {
  const navigate = useNavigate();
  const params = useParams();
  const token = params.token; // grabs token from /register/:token

  const [currentMode, setCurrentMode] = useState(mode || "login");
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const isLogin = currentMode === "login";
  const isRegister = currentMode === "register";
  const isActivation = currentMode === "activation";

  // Auto-switch to activation mode if token exists
  useEffect(() => {
    if (token) setCurrentMode("activation");
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // LOGIN
      if (isLogin) {
        const data = await loginUser(form.email, form.password);
        console.log("TOKEN RESPONSE:", data);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        alert("Login successful!");
        navigate("/dashboard");
      }

      // REGISTER (email only)
      if (isRegister) {
        await registerUser(form.email);
        alert(
          "Registration started! Check your email for the activation link."
        );
      }

      // ACTIVATION (full name + password)
      if (isActivation) {
        if (!token) {
          setMessage("Activation token missing");
          return;
        }

        if (form.password !== form.confirmPassword) {
          setMessage("Passwords do not match");
          return;
        }

        // Split full name into first and last
        let [first_name, ...lastParts] = form.name.trim().split(" ");
        let last_name = lastParts.join(" ") || "";

        await completeRegistration(token, first_name, last_name, form.password);
        alert("Account activated! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      setMessage(err.message);
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h1>
        {isLogin && "Login"}
        {isRegister && "Register"}
        {isActivation &&
          `Activating account for ${form.email ? form.email : "user"}`}
      </h1>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email for login & register */}
        {(isLogin || isRegister) && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        )}

        {/* Activation fields */}
        {isActivation && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Login password */}
        {isLogin && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">
          {isLogin && "Login"}
          {isRegister && "Register"}
          {isActivation && "Activate"}
        </button>
      </form>

      {/* Navigation links */}
      {isLogin && (
        <p>
          Don't have an account?{" "}
          <a href="#" onClick={() => setCurrentMode("register")}>
            Register
          </a>
        </p>
      )}

      {isRegister && (
        <p>
          Already have an account?{" "}
          <a href="#" onClick={() => setCurrentMode("login")}>
            Login
          </a>
        </p>
      )}
    </div>
  );
}
