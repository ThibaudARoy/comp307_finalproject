export const isAuthorized = (response) => {
    if (response === "Unauthorized") {
        localStorage.removeItem("token");
        window.location.replace("/login");
    }
}