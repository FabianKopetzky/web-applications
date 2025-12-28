import { refreshToken } from "./auth";

export async function apiFetch(url, options = {}) {
  let accessToken = localStorage.getItem("access_token");
  const refreshTokenValue = localStorage.getItem("refresh_token");

  // attempt the request
  let res = await fetch(`/api${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  /* ------------------------
     If access token expired → 401
     Try refresh + retry request
  ------------------------- */
  if (res.status === 401 && refreshTokenValue) {
    try {
      const newTokens = await refreshToken(refreshTokenValue);
      console.log("TOKEN RESPONSE:", data);
      // Save new tokens
      localStorage.setItem("access_token", newTokens.accessToken);
      localStorage.setItem("refresh_token", newTokens.refreshToken);

      accessToken = newTokens.accessToken;

      // retry the original request
      res = await fetch(`/api${url}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      // refresh failed → user must log in again
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw new Error("Session expired. Please log in again.");
    }
  }

  // If still unauthorized → logout
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw new Error("Unauthorized");
  }

  // Return JSON result
  return res.json();
}
