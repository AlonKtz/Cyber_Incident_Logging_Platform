//checking who is the user online and showing his userName.
document.getElementById("userName").textContent = currentUser.userName;

// reseting an array for a new event in local storage
let events = JSON.parse(localStorage.getItem("events"));
if (!Array.isArray(events)) {
	events = [];
	localStorage.setItem("events", JSON.stringify(events));
}

function NewEventChecker() {
	// bolean flags i chose to use
	let dateCheck = false;
	let drillCheck = false;
	let eventTypeCheck = false;
	let roleCheck = false;
	let severityCheck = false;
	let affectedSystemCheck = false;
	let summaryCheck = false;

	// getting user inputs
	let eventDateTime = document.getElementById("eventDateTime").value;
	let drillFlag = document.getElementById("drillFlag").value;
	let eventType = document.getElementById("cyberEvents").value;
	let role = document.getElementById("roleOfReporter").value;
	let severity = document.getElementById("severity").value;
	let affectedSystem = document.getElementById("affectedSystem").value;
	let summary = document.getElementById("eventSummary").value;

	//checks and fun
	if (eventDateTime !== "") {
		dateCheck = true;
	}
	if (drillFlag !== "Choose") {
		drillCheck = true;
	}
	if (eventType !== "Choose") {
		eventTypeCheck = true;
	}
	if (role !== "Choose") {
		roleCheck = true;
	}
	if (severity !== "Select severity level") {
		severityCheck = true;
	}
	if (affectedSystem.trim() !== "") {
		affectedSystemCheck = true;
	}
	if (summary.trim() !== "") {
		summaryCheck = true;
	}

	// getting all the flags to one variable
	let isFormValid =
		dateCheck &&
		drillCheck &&
		eventTypeCheck &&
		roleCheck &&
		severityCheck &&
		affectedSystemCheck &&
		summaryCheck;

	// all in here, desicion if form is sendable
	if (isFormValid === true) {
		document.getElementById("logNewEventBtn").disabled = false;
	} else {
		document.getElementById("logNewEventBtn").disabled = true;
	}
	return isFormValid;
}
function handleAddEvent() {
	if (NewEventChecker() === true) {
		return true;
	}
	return false;
}

