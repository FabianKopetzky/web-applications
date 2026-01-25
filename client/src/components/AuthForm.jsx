import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Alert, Typography, Space } from "antd";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongEnoughPassword = (password) =>
  password.length >= 8;

const { Title, Text } = Typography;

//! API Functions

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

//! AUTH FORM COMPONENT

export default function AuthForm({ mode }) {
  const [emailForTitle, setEmailForTitle] = useState("");

  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const token = params.token;
    const [form] = Form.useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const [currentMode, setCurrentMode] = useState(mode || "login");
  const [message, setMessage] = useState("");

  const isLogin = currentMode === "login";
  const isRegister = currentMode === "register";
  const isActivation = currentMode === "activation";


  useEffect(() => {
    if (token) {
      setCurrentMode("activation");

      fetch(`/api/register/${token}`)
          .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then(data => {
            console.log("API Response:", data);
            form.setFieldsValue({ email: data.email });
            setEmailForTitle(data.email);
          })
          .catch(() => {
            setError(t("error.activationLinkInvalid"));
          });
    }
  }, [token, form]);

  const onFinish = async (values) => {
    setError("");


    try {
      if (isLogin) {
        const data = await loginUser(values.email, values.password);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        setMessage(t("login.success"));
        navigate("/dashboard");
      }

      if (isRegister) {
        await registerUser(values.email);
        setMessage(t("register.checkEmail"))
      }

      if (isActivation) {
        if (!token) throw new Error("error.activationTokenMissing");

        const [first_name, ...lastParts] = values.name.trim().split(" ");
        const last_name = lastParts.join(" ") || "";

        await completeRegistration(token, first_name, last_name, values.password);
        setMessage(t("activation.success"));
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError(t(err.message || "error.unexpected"));
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Space
      direction="vertical"
      size="large"
      style={{ maxWidth: 400, width: "100%", margin: "0, auto"}}
      >

      <Title level={2}>
        {isLogin && t("login.title")}
        {isRegister && t("register.title")}
        {isActivation && (
            <span>
      {t("activation.creatingAccountFor")} <br />
      <Text type="primary" style={{ fontSize: 'inherit' }}>
        {emailForTitle || "..."}
      </Text>
    </span>
        )}
      </Title>

      {isActivation && (
        <Text type="secondary">{t("activation.subtitle")}</Text>
      )}

      {error && <Alert type="error" message={error} showIcon />}
      {message && (
          <Alert
              type="success"
              message={message}
              showIcon
              style={{ marginBottom: '1rem' }}
          />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >

        {(isLogin || isRegister) && (
          <Form.Item
            label={t("login.placeholderEmail")}
            name="email"
            rules={[
              { required: true, message: t("error.emailRequired") },
              {
                validator: (_, value) =>
                  !value || isValidEmail(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error(t("error.invalidEmail"))),
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}

                {isActivation && (
          <>
            <Form.Item
              label={t("activation.placeholderName")}
              name="name"
              rules={[{ required: true, message: t("error.nameRequired") }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t("activation.placeholderPassword")}
              name="password"
              rules={[
                { required: true, message: t("error.passwordRequired") },
                {
                  validator: (_, value) =>
                    isStrongEnoughPassword(value)
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(t("error.passwordTooShort"))
                        ),
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
             <Form.Item
              label={t("activation.placeholderConfirmPassword")}
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: t("error.confirmPasswordRequired") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("error.passwordsDontMatch"))
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        {isLogin && (
          <Form.Item
            label={t("login.placeholderPassword")}
            name="password"
            rules={[{ required: true, message: t("error.passwordRequired") }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {isLogin && t("login.button")}
            {isRegister && t("register.button")}
            {isActivation && t("activation.button")}
          </Button>
        </Form.Item>

        </Form>
      {isLogin && (
        <Text>
          {t("login.noAccount")} <Link to="/register">{t("register.title")}</Link>
        </Text>
      )}

      {isRegister && (
        <Text>
          {t("register.alreadyAccount")} <Link to="/login">{t("login.title")}</Link>
        </Text>
      )}
        </Space>
         </>
  );
}
