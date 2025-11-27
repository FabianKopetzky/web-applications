const API_URL = "/api";

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include", // <-- critical!
    body: new URLSearchParams({
      grant_type: "password",
      username: email,
      password: password,
    }),
  });

  if (!res.ok) throw new Error("Login failed");
  return true;
}

export async function registerUser(email) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Registration failed");
  return true;
}

export async function activateUser(token, data) {
  const res = await fetch(`${API_URL}/register/${token}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Activation failed");
  return true;
}
