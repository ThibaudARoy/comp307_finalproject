// If user is not authorized, redirect to login page
export const isAuthorized = (response) => {
    if (response === "Unauthorized") {
        localStorage.removeItem("token");
        window.location.replace("/login");
    }
}