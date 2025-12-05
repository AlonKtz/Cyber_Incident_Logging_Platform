// if user logged-in send to home page
const alreadyLogged = JSON.parse(localStorage.getItem("currentUser"));
if (alreadyLogged) {
    window.location.href = "./home_dashboard.html";
}

const form = document.getElementById("signIn");
//finds the login form, and when user clicks connect, preventdef stops the page from refresh
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // look what the user typed into the login
    const inputUser = document.getElementById("userName").value;
    const inputPass = document.getElementById("userPassword").value;

    // load all registered users (pulls users out of the array and if non then returns an empty array)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // finds the user within the data we have stored
    let foundUser = null;

    //loop through users array
    for (let i=0; i<users.length; i++) {
        if (users[i].userName === inputUser) {
            foundUser = users[i];
            break; // user found no need to keep looking
        }
    }
    // username not found
    if (foundUser === null) {
        alert("User name does not exist.");
        return;
    }
    // password not matches but username does.
    if (foundUser.userPassword !== inputPass) {
        alert("incorrect password, user exists.");
        return;
    }

    // user and password matches and stored
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    // redirect to home page
    window.location.href = "./home_dashboard.html";
})