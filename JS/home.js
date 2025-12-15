let userName = JSON.parse(localStorage.getItem("currentUser"));
document.getElementById("userName").textContent =
	currentUser.firstName + " " + ", Also Known by: " + currentUser.userName;

