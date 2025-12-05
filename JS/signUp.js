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

// checking password match
const pass1 = document.getElementById("userPassword");
const pass2 = document.getElementById("userPasswordV");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitSignUp");

pass1.addEventListener("input", checkPasswords);
pass2.addEventListener("input", checkPasswords);

function checkPasswords() {
	// if one of them is empty we dont do nothing
	if (pass1.value === "" || pass2.value === "") {
		message.style.display = "block";
		submitBtn.disabled = true;
		return;
	} 

	if (pass1.value === pass2.value) {
		message.style.display = "none";
		submitBtn.disabled = false;
	} else {
		message.style.display = "block";
		submitBtn.disabled = true;
	}
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
})

// passwordChecker(); for ref: userPassword  to userPasswordV
// ageValidator();
// conditionsChecker();

// for further purposes, the varaible userAge2 shows the final age.
