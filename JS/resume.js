// Initialize resume data structure for current user
var resumeData = {};

// Load or initialize resume for current user
function initializeResume() {
	var allResumes = JSON.parse(localStorage.getItem('resumes')) || {};
	if (!allResumes[currentUser.userName]) {
		allResumes[currentUser.userName] = {
			education: {
				years: 0,
				field: '',
				degree: 'Choose'
			},
			experience: {
				company: '',
				yearsInCompany: 0,
				currentlyWorking: false,
				role: ''
			},
			skills: ''
		};
		localStorage.setItem('resumes', JSON.stringify(allResumes));
	}
	resumeData = allResumes[currentUser.userName];
	renderResumeDisplay();
}

// Render resume display (read-only view)
function renderResumeDisplay() {
	var container = document.getElementById('resumeDisplay');
	container.innerHTML = '';

	if (!resumeData.education.years && !resumeData.experience.company && !resumeData.skills) {
		container.innerHTML = '<p>No tech stack information added yet. Click "Edit Tech Stack" to add.</p>';
		return;
	}

	var html = '<div class="resume-card"><h3>Your Tech Stack</h3>';

	// Education section
	if (resumeData.education.years || resumeData.education.field || resumeData.education.degree !== 'Choose') {
		html += '<div class="resume-section"><h4>Education</h4>';
		html += '<p><strong>Years of Study:</strong> ' + (resumeData.education.years || 'N/A') + '</p>';
		html += '<p><strong>Field:</strong> ' + (resumeData.education.field || 'N/A') + '</p>';
		html += '<p><strong>Degree:</strong> ' + (resumeData.education.degree || 'N/A') + '</p>';
		html += '</div>';
	}

	// Experience section
	if (resumeData.experience.company || resumeData.experience.role) {
		html += '<div class="resume-section"><h4>Experience</h4>';
		html += '<p><strong>Company:</strong> ' + (resumeData.experience.company || 'N/A') + '</p>';
		var status = resumeData.experience.currentlyWorking ? 'Currently Working' : resumeData.experience.yearsInCompany + ' years';
		html += '<p><strong>Time:</strong> ' + status + '</p>';
		html += '<p><strong>Role:</strong> ' + (resumeData.experience.role || 'N/A') + '</p>';
		html += '</div>';
	}

	// Skills section
	if (resumeData.skills) {
		html += '<div class="resume-section"><h4>Skills</h4>';
		html += '<p>' + resumeData.skills + '</p>';
		html += '</div>';
	}

	html += '</div>';
	container.innerHTML = html;
}

// Validation function (similar to NewEventChecker pattern)
function validateResumeForm() {
	var educationYearsCheck = false;
	var educationFieldCheck = false;
	var degreeTypeCheck = false;
	var companyNameCheck = false;
	var yearsInCompanyCheck = false;
	var jobRoleCheck = false;
	var skillsCheck = false;

	// Get input values
	var educationYears = document.getElementById('educationYears').value;
	var educationField = document.getElementById('educationField').value.trim();
	var degreeType = document.getElementById('degreeType').value;
	var noEducation = document.getElementById('noEducation') ? document.getElementById('noEducation').checked : false;
	var companyName = document.getElementById('companyName').value.trim();
	var yearsInCompany = document.getElementById('yearsInCompany').value;
	var jobRole = document.getElementById('jobRole').value.trim();
	var noExperience = document.getElementById('noExperience') ? document.getElementById('noExperience').checked : false;
	var skills = document.getElementById('skills').value.trim();

	// Education validation: either filled in OR "No Education" checked
	if (noEducation) {
		educationYearsCheck = true;
		educationFieldCheck = true;
		degreeTypeCheck = true;
	} else {
		if (educationYears !== '' && !isNaN(educationYears) && parseInt(educationYears) >= 1 && parseInt(educationYears) <= 10) {
			educationYearsCheck = true;
		}
		if (educationField.length > 0 && educationField.length <= 100) {
			educationFieldCheck = true;
		}
		if (degreeType !== 'Choose') {
			degreeTypeCheck = true;
		}
	}

	// Experience validation: either filled in OR "No Experience" checked
	if (noExperience) {
		companyNameCheck = true;
		yearsInCompanyCheck = true;
		jobRoleCheck = true;
	} else {
		if (companyName.length > 0 && companyName.length <= 100) {
			companyNameCheck = true;
		}
		if (yearsInCompany !== '' && !isNaN(yearsInCompany) && parseInt(yearsInCompany) >= 0 && parseInt(yearsInCompany) <= 50) {
			yearsInCompanyCheck = true;
		}
		if (jobRole.length > 0 && jobRole.length <= 100) {
			jobRoleCheck = true;
		}
	}
	if (skills.length > 0 && skills.length <= 500) {
		skillsCheck = true;
	}

	// Display error messages
	setResumeError('educationYearsError', educationYearsCheck ? '' : (noEducation ? '' : 'Years must be between 1 and 10'));
	setResumeError('educationFieldError', educationFieldCheck ? '' : (noEducation ? '' : 'Field is required and must be under 100 characters'));
	setResumeError('degreeTypeError', degreeTypeCheck ? '' : (noEducation ? '' : 'Please select a degree type'));
	setResumeError('companyNameError', companyNameCheck ? '' : (noExperience ? '' : 'Company name is required and must be under 100 characters'));
	setResumeError('yearsInCompanyError', yearsInCompanyCheck ? '' : (noExperience ? '' : 'Years must be between 0 and 50'));
	setResumeError('jobRoleError', jobRoleCheck ? '' : (noExperience ? '' : 'Role is required and must be under 100 characters'));
	setResumeError('skillsError', skillsCheck ? '' : 'Skills are required and must be under 500 characters');

	// All checks must pass
	var isFormValid = educationYearsCheck && educationFieldCheck && degreeTypeCheck && 
	                  companyNameCheck && yearsInCompanyCheck && jobRoleCheck && skillsCheck;

	document.getElementById('saveResumeBtn').disabled = !isFormValid;
	return isFormValid;

}

// Helper to set error messages
function setResumeError(elementId, message) {
	var el = document.getElementById(elementId);
	if (el) {
		el.style.display = message ? 'block' : 'none';
		el.textContent = message;
	}
}

// Handle save resume
function handleSaveResume() {
	if (!validateResumeForm()) {
		return false;
	}

	// Collect form data
	var noEducation = document.getElementById('noEducation') ? document.getElementById('noEducation').checked : false;
	var noExperience = document.getElementById('noExperience') ? document.getElementById('noExperience').checked : false;
	
	if (noEducation) {
		resumeData.education.years = 0;
		resumeData.education.field = 'No Education';
		resumeData.education.degree = 'No Education';
	} else {
		resumeData.education.years = parseInt(document.getElementById('educationYears').value);
		resumeData.education.field = document.getElementById('educationField').value.trim();
		resumeData.education.degree = document.getElementById('degreeType').value;
	}
	
	if (noExperience) {
		resumeData.experience.company = 'No Experience';
		resumeData.experience.yearsInCompany = 0;
		resumeData.experience.currentlyWorking = false;
		resumeData.experience.role = 'No Experience';
	} else {
		resumeData.experience.company = document.getElementById('companyName').value.trim();
		resumeData.experience.yearsInCompany = parseInt(document.getElementById('yearsInCompany').value);
		resumeData.experience.currentlyWorking = document.getElementById('currentlyWorking').checked;
		resumeData.experience.role = document.getElementById('jobRole').value.trim();
	}
	
	resumeData.skills = document.getElementById('skills').value.trim();

	// Save to localStorage
	var allResumes = JSON.parse(localStorage.getItem('resumes')) || {};
	allResumes[currentUser.userName] = resumeData;
	localStorage.setItem('resumes', JSON.stringify(allResumes));

	// Reset UI
	document.getElementById('resumeContainer').style.display = 'none';
	renderResumeDisplay();
	alert('Tech Stack updated successfully!');
	return false;
}

// Handle cancel
function handleCancelResume() {
	document.getElementById('resumeContainer').style.display = 'none';
	return false;
}

// Handle edit button
function handleEditResume() {
	// Populate form with current data
	var noEducation = document.getElementById('noEducation');
	if (noEducation && resumeData.education.field === 'No Education') {
		noEducation.checked = true;
	} else if (noEducation) {
		noEducation.checked = false;
	}
	
	document.getElementById('educationYears').value = (resumeData.education.years && resumeData.education.field !== 'No Education') ? resumeData.education.years : '';
	document.getElementById('educationField').value = (resumeData.education.field && resumeData.education.field !== 'No Education') ? resumeData.education.field : '';
	document.getElementById('degreeType').value = (resumeData.education.degree && resumeData.education.degree !== 'No Education') ? resumeData.education.degree : 'Choose';
	
	var noExperience = document.getElementById('noExperience');
	if (noExperience && resumeData.experience.company === 'No Experience') {
		noExperience.checked = true;
	} else if (noExperience) {
		noExperience.checked = false;
	}
	
	document.getElementById('companyName').value = (resumeData.experience.company && resumeData.experience.company !== 'No Experience') ? resumeData.experience.company : '';
	document.getElementById('yearsInCompany').value = (resumeData.experience.yearsInCompany && resumeData.experience.company !== 'No Experience') ? resumeData.experience.yearsInCompany : '';
	document.getElementById('currentlyWorking').checked = resumeData.experience.currentlyWorking || false;
	document.getElementById('jobRole').value = (resumeData.experience.role && resumeData.experience.role !== 'No Experience') ? resumeData.experience.role : '';
	document.getElementById('currentlyWorking').checked = resumeData.experience.currentlyWorking || false;
	document.getElementById('jobRole').value = (resumeData.experience.role && resumeData.experience.role !== 'No Experience') ? resumeData.experience.role : '';
	
	document.getElementById('skills').value = resumeData.skills || '';

	document.getElementById('resumeContainer').style.display = 'block';
	
	// Clear previous errors
	document.querySelectorAll('.error').forEach(function(el) {
		el.style.display = 'none';
	});

	return false;
}

// Add real-time validation as user types
document.addEventListener('DOMContentLoaded', function() {
	initializeResume();

	var editBtn = document.getElementById('editResumeBtn');
	var saveBtn = document.getElementById('saveResumeBtn');
	var cancelBtn = document.getElementById('cancelResumeBtn');

	if (editBtn) {
		editBtn.addEventListener('click', handleEditResume);
	}

	if (saveBtn) {
		saveBtn.addEventListener('click', handleSaveResume);
	}

	if (cancelBtn) {
		cancelBtn.addEventListener('click', handleCancelResume);
	}

	// Real-time validation
	var formInputs = [
		'educationYears',
		'educationField',
		'degreeType',
		'noEducation',
		'companyName',
		'yearsInCompany',
		'noExperience',
		'jobRole',
		'skills'
	];

	formInputs.forEach(function(inputId) {
		var input = document.getElementById(inputId);
		if (input) {
			input.addEventListener('input', validateResumeForm);
			input.addEventListener('change', validateResumeForm);
		}
	});
});
