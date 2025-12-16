function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (err) {
      alert("Logout failed. Please try again.");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
