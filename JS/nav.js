// download the navbar file content (fetch)
fetch("navBar.html")
// response is the file and .text tell it to be red as text (read)
.then(function(response){ return response.text(); })
// put the html text R into the div with id "navBar" (insert)
.then(function(t){ document.getElementById("navBar").innerHTML = t; });

// fix this! disconnect logic doesnt work
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            //remove logged in user
            localStorage.removeItem("currentUser");
            //redirect to login page
            window.parent.location.href = "./pages/login.html"

        })
    }
}) // fix disconnect button ! 