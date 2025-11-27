import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activateUser } from "../api/auth";

export default function Activate() {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await activateUser(token, {
        first_name: form.first_name,
        last_name: form.last_name,
        password: form.password,
      });

      alert("Activation successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Activation failed");
    }
  };

  return (
    <div className="activate-container">
      <h1>Activate Your Account</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
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

        <button type="submit">Activate Account</button>
      </form>
    </div>
  );
}
