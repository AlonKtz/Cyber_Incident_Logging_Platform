function func() {
    let userEmail = document.getElementById("userEmail").value;
	let userName = document.getElementById("userName").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	localStorage.setItem("CurrentUser", firstName + " " + lastName);
	localStorage.setItem("User_Name", userName);
    localStorage.setItem("userEmail", userEmail);
}
