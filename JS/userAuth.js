	// checking user auth (if hes logged it sends the object, if not, redirect)
function requireLogin() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
// if user is not logged in
    if (!user) {
        window.location.href = "login.html";
    }
    return user;
} 
// checking the auth actually
const currentUser = requireLogin();

