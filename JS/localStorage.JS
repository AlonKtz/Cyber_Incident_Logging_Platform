function saveUser() {
// getting user inputs
	const userEmail = document.getElementById("userEmail").value;
	const userName = document.getElementById("userName").value;
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const age = calcAge();

	// creating the user object 
	const newUser = {
		firstName: firstName,
		lastName: lastName,
		userName: userName,
		email: userEmail,
		age: age
	};

	// making existing users to be an array or create an empty one
	let users = JSON.parse(localStorage.getItem("users")) || [];

	// add a new user to the end of the array
	users.push(newUser);

	// save to local storage and stringify it
	localStorage.setItem("users", JSON.stringify(users));

}

