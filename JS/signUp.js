// Age Calculation function
// using "new" for getting the date to be a functional object.
function calcAge() {
	const dob = new Date(document.getElementById("userDob").value);
	const userAge1 = Date.now() - dob.getTime();
	const ageDate = new Date(userAge1);
	// using Math.Abs to prevent negative values
	const userAge2 = Math.abs(ageDate.getUTCFullYear() - 1970);
	document.getElementById("ageResult").textContent =
		"You are " + userAge2 + " years old";

	return userAge2;
}
// Age Validation Section
const userDob = document.getElementById("userDob");
const errorAgeMessage = document.getElementById("errorAgeMessage");

// using function () because i need it only here.
userDob.addEventListener("input", function () {
	const age = calcAge();
	checkAge(age);
});

function checkAge(age) {
	if (isNaN(age) || age < 18 || age > 65) {
		errorAgeMessage.style.display = "block";
		submitBtn.disabled = true;
		return;
	} else {
		errorAgeMessage.style.display = "none";
		submitBtn.disabled = false;
	}
}

// Name length checker
const fNameShortError = document.getElementById("fNameShortError");
const lNameShortError = document.getElementById("lNameShortError");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");

firstName.addEventListener("input", checkNameFields);
lastName.addEventListener("input", checkNameFields);

function checkNameFields() {
	if (firstName.value.length >= 2 && lastName.value.length >= 2) {
		fNameShortError.style.display = "none";
		lNameShortError.style.display = "none";
		submitBtn.disabled = false;
		return;
	}

	if (firstName.value.length < 2) {
		fNameShortError.style.display = "block";
		submitBtn.disabled = true;
	} else {
		fNameShortError.style.display = "none";
	}

	if (lastName.value.length < 2) {
		lNameShortError.style.display = "block";
		submitBtn.disabled = true;
	} else {
		lNameShortError.style.display = "none";
	}
}

// checking password match
const pass1 = document.getElementById("userPassword");
const pass2 = document.getElementById("userPasswordV");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitSignUp");
const passErrorStrength = document.getElementById("passErrorStrength");
const passErrorLength = document.getElementById("passErrorLength");

pass1.addEventListener("input", checkPasswords);
pass2.addEventListener("input", checkPasswords);

function checkPasswords() {
	const specialChars = '!@#$%^&*(),.?":{}|<>_-+=/';
	// reseting error messages
	passErrorLength.style.display = "none";
	passErrorStrength.style.display = "none";
	message.style.display = "none";
	// when fields are empty.
	if (pass1.value === "" || pass2.value === "") {
		submitBtn.disabled = true;
		return;
	}

	// password verification

	if (pass1.value !== pass2.value) {
		message.style.display = "block";
		submitBtn.disabled = true;
		return;
	}

	// Length Check
	if (pass1.value.length < 8) {
		passErrorLength.style.display = "block";
		submitBtn.disabled = true;
		return;
	}
	// Strength check
	// making a Boolean flag of hasNumber and hasSpecialChar
	let hasNumber = false;
	let hasSpecialChar = false;
	// for loop that goes through every char of the password, and checks for the appearance of special char
	for (let i = 0; i < pass1.value.length; i++) {
		let char = pass1.value[i];

		if (char >= "0" && char <= "9") hasNumber = true;
		if (specialChars.includes(char)) hasSpecialChar = true;
	}

	if (!hasNumber || !hasSpecialChar) {
		passErrorStrength.style.display = "block";
		submitBtn.disabled = true;
		return;
	}

	submitBtn.disabled = false;
}

// hide and show pass logic
const togglePass = document.getElementById("togglePass");

togglePass.addEventListener("click", function () {
	if (pass1.type === "password") {
		pass1.type = "text";
		pass2.type = "text";
		togglePass.textContent = "🫣";
	} else {
		pass1.type = "password";
		pass2.type = "password";
		togglePass.textContent = "👀";
	}
});

// username checks
const userName = document.getElementById("userName");
const errorMessageUserShort = document.getElementById("errorMessageUserShort");
const errorMessageUserTaken = document.getElementById("errorMessageUserTaken");

userName.addEventListener("input", checkUserName);

function checkUserName() {
	if (userName.value.length < 6) {
		errorMessageUserShort.style.display = "block";
		submitBtn.disabled = true;
		return;
	} else {
		errorMessageUserShort.style.display = "none";
		submitBtn.disabled = false;
	}

	// gets the users from the storage, and if empty returns an empty array
	let users = JSON.parse(localStorage.getItem("users")) || [];

	for (let i = 0; i < users.length; i++) {
		if (users[i].userName === userName.value) {
			errorMessageUserTaken.style.display = "block";
			submitBtn.disabled = true;
			return;
		}
	}
	errorMessageUserTaken.style.display = "none";
	submitBtn.disabled = false;
}

// conditionsChecker();

// for further purposes, the varaible userAge2 shows the final age.
