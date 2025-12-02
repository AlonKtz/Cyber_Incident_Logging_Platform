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
}
// for further purposes, the varaible userAge2 shows the final age.
// add Age Check functionality !