export function logout(navigate) {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
    console.log("User logged out");
}
