// Render profile values
function renderProfile(user) {
	document.getElementById('profileName').textContent = user.firstName + ' ' + user.lastName;
	document.getElementById('profileUserName').textContent = user.userName;
	document.getElementById('profileEmail').textContent = user.email;
	document.getElementById('profileAge').textContent = user.age;
	document.getElementById('profileDob').textContent = user.userBirthday;
}

renderProfile(currentUser);

var editBtn = document.getElementById('editProfileBtn');
var saveBtn = document.getElementById('saveProfileBtn');
var originalUserName = currentUser.userName;

// validation settings copied from signUp.js rules
var AuthEmailDomains = [
	'@gmail.com',
	'@yahoo.com',
	'@outlook.com',
	'@hotmail.com',
	'@live.com'
];

// helper validations
function isValidEmailDomain(email) {
	if (!email) { return false; }
	var e = email.toLowerCase();
	for (var i = 0; i < AuthEmailDomains.length; i++) {
		if (e.indexOf(AuthEmailDomains[i], e.length - AuthEmailDomains[i].length) !== -1) {
			return true;
		}
	}
	return false;
}

function isUsernameAvailable(name) {
	if (!name || name.length < 6) { return false; }
	var users = JSON.parse(localStorage.getItem('users')) || [];
	for (var i = 0; i < users.length; i++) {
		if (users[i].userName === name && users[i].userName !== originalUserName) {
			return false;
		}
	}
	return true;
}

function isAgeAllowed(dobString) {
	var age = calcAgeFromDob(dobString);
	if (age === null || isNaN(age)) { return false; }
	return age >= 18 && age <= 65;
}

function setErrorMessage(id, msg) {
	var el = document.getElementById(id);
	if (!el) {
		el = document.createElement('p');
		el.id = id;
		el.className = 'error';
		var parent;
		if (id === 'profileUserError' || id === 'profileEmailError') {
			parent = document.getElementById(id === 'profileUserError' ? 'profileUserName' : 'profileEmail');
			parent.parentNode.insertBefore(el, parent.nextSibling);
		} else {
			// default: append to profile card
			var card = document.getElementById('profileCard');
			if (card) { card.appendChild(el); }
		}
	}
	el.style.display = msg ? 'block' : 'none';
	el.textContent = msg || '';
}

function validateFormFields() {
	var userNameInput = document.getElementById('userNameInput');
	var emailInput = document.getElementById('emailInput');
	var dobInput = document.getElementById('dobInput');

	var valid = true;

	var newUser = userNameInput ? userNameInput.value.trim() : currentUser.userName;
	if (!isUsernameAvailable(newUser)) {
		setErrorMessage('profileUserError', 'Username must be ≥6 chars and not taken.');
		valid = false;
	} else {
		setErrorMessage('profileUserError', '');
	}

	var newEmail = emailInput ? emailInput.value.trim() : currentUser.email;
	if (!isValidEmailDomain(newEmail)) {
		setErrorMessage('profileEmailError', 'Email must use allowed domains (gmail/yahoo/outlook/hotmail/live).');
		valid = false;
	} else {
		setErrorMessage('profileEmailError', '');
	}

	var newDob = dobInput ? dobInput.value : currentUser.userBirthday;
	if (!isAgeAllowed(newDob)) {
		setErrorMessage('profileDobError', 'Age must be between 18 and 65.');
		valid = false;
	} else {
		setErrorMessage('profileDobError', '');
	}

	saveBtn.disabled = !valid;
}

// ensure save button is disabled by default
saveBtn.disabled = true;

function calcAgeFromDob(dobString) {
	if (!dobString) { return null; }
	var dob = new Date(dobString);
	if (isNaN(dob.getTime())) { return null; }
	var diff = Date.now() - dob.getTime();
	var ageDate = new Date(diff);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function escapeHtml(str) {
	if (!str) { return ''; }
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

editBtn.addEventListener('click', function () {
	var nameSpan = document.getElementById('profileName');
	nameSpan.innerHTML = '<input id="firstNameInput" value="' + escapeHtml(currentUser.firstName) + '" /> ' +
						 '<input id="lastNameInput" value="' + escapeHtml(currentUser.lastName) + '" />';

	var userSpan = document.getElementById('profileUserName');
	userSpan.innerHTML = '<input id="userNameInput" value="' + escapeHtml(currentUser.userName) + '" />';

	var emailSpan = document.getElementById('profileEmail');
	emailSpan.innerHTML = '<input id="emailInput" value="' + escapeHtml(currentUser.email) + '" />';

	var dobSpan = document.getElementById('profileDob');
	dobSpan.innerHTML = '<input id="dobInput" type="date" value="' + escapeHtml(currentUser.userBirthday || '') + '" />';

	// attach live validation handlers (plain functions)
	var userNameInputLive = document.getElementById('userNameInput');
	var emailInputLive = document.getElementById('emailInput');
	var dobInputLive = document.getElementById('dobInput');

	if (userNameInputLive) { userNameInputLive.addEventListener('input', function () { validateFormFields(); }); }
	if (emailInputLive) { emailInputLive.addEventListener('input', function () { validateFormFields(); }); }
	if (dobInputLive) { dobInputLive.addEventListener('input', function () { validateFormFields(); }); }

	// run initial validation after inputs created
	validateFormFields();

	var ageSpan = document.getElementById('profileAge');
	ageSpan.textContent = calcAgeFromDob(currentUser.userBirthday) || currentUser.age || '';

	editBtn.style.display = 'none';
	saveBtn.style.display = 'inline';
});

saveBtn.addEventListener('click', function () {
	var firstNameInput = document.getElementById('firstNameInput');
	var lastNameInput = document.getElementById('lastNameInput');
	var userNameInput = document.getElementById('userNameInput');
	var emailInput = document.getElementById('emailInput');
	var dobInput = document.getElementById('dobInput');

	var newFirst = firstNameInput ? firstNameInput.value.trim() : currentUser.firstName;
	var newLast = lastNameInput ? lastNameInput.value.trim() : currentUser.lastName;
	var newUserName = userNameInput ? userNameInput.value.trim() : currentUser.userName;
	var newEmail = emailInput ? emailInput.value.trim() : currentUser.email;
	var newDob = dobInput ? dobInput.value : currentUser.userBirthday;

	if (!newFirst || !newLast || !newUserName) {
		alert('First name, last name and username are required.');
		return;
	}

	var newAge = calcAgeFromDob(newDob) || currentUser.age;

	// update currentUser
	currentUser.firstName = newFirst;
	currentUser.lastName = newLast;
	currentUser.userName = newUserName;
	currentUser.email = newEmail;
	currentUser.userBirthday = newDob;
	currentUser.age = newAge;

	// update users in localStorage
	var users = JSON.parse(localStorage.getItem('users')) || [];
	var found = false;
	for (var i = 0; i < users.length; i++) {
		if (users[i].userName === originalUserName) {
			users[i].firstName = newFirst;
			users[i].lastName = newLast;
			users[i].userName = newUserName;
			users[i].email = newEmail;
			users[i].userBirthday = newDob;
			users[i].age = newAge;
			found = true;
			break;
		}
	}

	if (!found) {
		// try match by email
		for (var j = 0; j < users.length; j++) {
			if (users[j].email === currentUser.email) {
				users[j].firstName = newFirst;
				users[j].lastName = newLast;
				users[j].userName = newUserName;
				users[j].email = newEmail;
				users[j].userBirthday = newDob;
				users[j].age = newAge;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		users.push(currentUser);
	}

	localStorage.setItem('users', JSON.stringify(users));
	localStorage.setItem('currentUser', JSON.stringify(currentUser));

	originalUserName = currentUser.userName;

	renderProfile(currentUser);
	saveBtn.style.display = 'none';
	editBtn.style.display = 'inline';
});


