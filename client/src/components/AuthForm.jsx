import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongEnoughPassword = (password) =>
  password.length >= 6;

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
    throw new Error(data.message || "error.registrationFailed");
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
    throw new Error(data.message || "error.activationFailed");
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
    throw new Error(data.message || "error.loginFailed");
  }

  return res.json();
}

/* ============================================
   AUTH FORM COMPONENT
============================================ */

export default function AuthForm({ mode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const token = params.token;

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

  useEffect(() => {
    if (token) {
      setCurrentMode("activation");

      fetch(`/api/register/${token}`)
        .then(res => res.json())
        .then(data => setForm(prev => ({ ...prev, email: data.email || "" })))
        .catch(() => setForm(prev => ({ ...prev, email: "" })));
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        if (!form.email || !form.password) {
          setMessage(t('error.emailRequired'));
          return;
        }
        if (!isValidEmail(form.email)) {
          setMessage(t('error.invalidEmail'));
          return;
        }

        const data = await loginUser(form.email, form.password);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        alert(t('login.title') + " erfolgreich!");
        navigate("/dashboard");
      }

      if (isRegister) {
        if (!form.email) {
          setMessage(t('error.emailRequired'));
          return;
        }
        if (!isValidEmail(form.email)) {
          setMessage(t('error.invalidEmail'));
          return;
        }

        await registerUser(form.email);
        alert(t('register.title') + " gestartet! " + t('activation.checkEmail'));
      }

      if (isActivation) {
        if (!token) {
          setMessage(t('error.activationTokenMissing'));
          return;
        }
        if (!isStrongEnoughPassword(form.password)) {
          setMessage(t('error.passwordTooShort'));
          return;
        }
        if (form.password !== form.confirmPassword) {
          setMessage(t('error.passwordsDontMatch'));
          return;
        }

        const [first_name, ...lastParts] = form.name.trim().split(" ");
        const last_name = lastParts.join(" ") || "";

        await completeRegistration(token, first_name, last_name, form.password);
        alert(t('activation.title') + " erfolgreich! " + t('login.pleaseLogin'));
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
        {isLogin && t('login.title')}
        {isRegister && t('register.title')}
        {isActivation && `${t('activation.title')} ${form.email || ""}`}
      </h1>

      {isActivation && <p>{t('activation.subtitle')}</p>}

      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {(isLogin || isRegister) && (
          <input
            type="email"
            name="email"
            placeholder={t('login.placeholderEmail')}
            value={form.email}
            onChange={handleChange}
            required
          />
        )}

        {isActivation && (
          <>
            <input
              type="text"
              name="name"
              placeholder={t('activation.placeholderName')}
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder={t('activation.placeholderPassword')}
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder={t('activation.placeholderConfirmPassword')}
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </>
        )}

        {isLogin && (
          <input
            type="password"
            name="password"
            placeholder={t('login.placeholderPassword')}
            value={form.password}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">
          {isLogin && t('login.button')}
          {isRegister && t('register.button')}
          {isActivation && t('activation.button')}
        </button>
      </form>

      {isLogin && (
        <p>{t('login.noAccount')} <a href="/register">{t('register.title')}</a></p>
      )}
      {isRegister && (
        <p>{t('register.alreadyAccount')} <a href="/login">{t('login.title')}</a></p>
      )}
    </div>
  );
}
