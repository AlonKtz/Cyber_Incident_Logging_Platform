// Initialize resume data structure for current user
var resumeData = {};

// Load or initialize resume for current user
function initializeResume() {
	var allResumes = JSON.parse(localStorage.getItem('resumes')) || {};
	if (!allResumes[currentUser.userName]) {
		allResumes[currentUser.userName] = {
			education: [],
			experience: [],
			skills: ''
		};
		localStorage.setItem('resumes', JSON.stringify(allResumes));
	}
	resumeData = allResumes[currentUser.userName];
	// Migrate old single data to arrays if needed
	if (resumeData.education && !Array.isArray(resumeData.education)) {
		resumeData.education = resumeData.education.years ? [resumeData.education] : [];
	}
	if (resumeData.experience && !Array.isArray(resumeData.experience)) {
		resumeData.experience = resumeData.experience.company ? [resumeData.experience] : [];
	}
	renderResumeDisplay();
}

// Render resume display (read-only view)
function renderResumeDisplay() {
	var container = document.getElementById('resumeDisplay');
	container.innerHTML = '';

	if (!resumeData.education.length && !resumeData.experience.length && !resumeData.skills) {
		container.innerHTML = '<p>No tech stack information added yet. Click "Edit Education", "Edit Experience", or "Edit Skills" to add.</p>';
		return;
	}

	var html = '<div class="resume-card"><h3>Your Tech Stack</h3>';

	// Education section
	if (resumeData.education.length > 0) {
		html += '<div class="resume-section"><h4>Education</h4>';
		resumeData.education.forEach(function(edu, index) {
			html += '<div class="education-item">';
			html += '<p><strong>Years of Study:</strong> ' + (edu.years || 'N/A') + '</p>';
			html += '<p><strong>Field:</strong> ' + (edu.field || 'N/A') + '</p>';
			html += '<p><strong>Degree:</strong> ' + (edu.degree || 'N/A') + '</p>';
			html += '</div>';
		});
		html += '</div>';
	}

	// Experience section
	if (resumeData.experience.length > 0) {
		html += '<div class="resume-section"><h4>Experience</h4>';
		resumeData.experience.forEach(function(exp, index) {
			html += '<div class="experience-item">';
			html += '<p><strong>Company:</strong> ' + (exp.company || 'N/A') + '</p>';
			var status = exp.currentlyWorking ? 'Currently Working' : (exp.yearsInCompany || 0) + ' years';
			html += '<p><strong>Time:</strong> ' + status + '</p>';
			html += '<p><strong>Role:</strong> ' + (exp.role || 'N/A') + '</p>';
			html += '</div>';
		});
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

// Validation for education form
function validateEducationForm() {
	var isValid = true;
	document.querySelectorAll('#educationList .education-item').forEach(function(item) {
		var years = item.querySelector('.education-years').value;
		var field = item.querySelector('.education-field').value.trim();
		var degree = item.querySelector('.degree-type').value;
		
		var yearsError = item.querySelector('.education-years-error');
		var fieldError = item.querySelector('.education-field-error');
		var degreeError = item.querySelector('.degree-type-error');
		
		yearsError.style.display = 'none';
		fieldError.style.display = 'none';
		degreeError.style.display = 'none';
		
		if (years === '' || isNaN(years) || parseInt(years) < 1 || parseInt(years) > 10) {
			yearsError.textContent = 'Years must be between 1 and 10';
			yearsError.style.display = 'block';
			isValid = false;
		}
		if (field.length === 0 || field.length > 100) {
			fieldError.textContent = 'Field is required and must be under 100 characters';
			fieldError.style.display = 'block';
			isValid = false;
		}
		if (degree === 'Choose') {
			degreeError.textContent = 'Please select a degree type';
			degreeError.style.display = 'block';
			isValid = false;
		}
	});
	document.getElementById('saveEducationBtn').disabled = !isValid;
	return isValid;
}

// Validation for experience form
function validateExperienceForm() {
	var isValid = true;
	document.querySelectorAll('#experienceList .experience-item').forEach(function(item) {
		var company = item.querySelector('.company-name').value.trim();
		var years = item.querySelector('.years-in-company').value;
		var role = item.querySelector('.job-role').value.trim();
		
		var companyError = item.querySelector('.company-name-error');
		var yearsError = item.querySelector('.years-in-company-error');
		var roleError = item.querySelector('.job-role-error');
		
		companyError.style.display = 'none';
		yearsError.style.display = 'none';
		roleError.style.display = 'none';
		
		if (company.length === 0 || company.length > 100) {
			companyError.textContent = 'Company name is required and must be under 100 characters';
			companyError.style.display = 'block';
			isValid = false;
		}
		if (years === '' || isNaN(years) || parseInt(years) < 0 || parseInt(years) > 50) {
			yearsError.textContent = 'Years must be between 0 and 50';
			yearsError.style.display = 'block';
			isValid = false;
		}
		if (role.length === 0 || role.length > 100) {
			roleError.textContent = 'Role is required and must be under 100 characters';
			roleError.style.display = 'block';
			isValid = false;
		}
	});
	document.getElementById('saveExperienceBtn').disabled = !isValid;
	return isValid;
}

// Validation for skills form
function validateSkillsForm() {
	var skills = document.getElementById('skills').value.trim();
	var isValid = skills.length > 0 && skills.length <= 500;
	document.getElementById('skillsError').style.display = isValid ? 'none' : 'block';
	document.getElementById('skillsError').textContent = isValid ? '' : 'Skills are required and must be under 500 characters';
	document.getElementById('saveSkillsBtn').disabled = !isValid;
	return isValid;
}

// Helper to set error messages
function setResumeError(elementId, message) {
	var el = document.getElementById(elementId);
	if (el) {
		el.style.display = message ? 'block' : 'none';
		el.textContent = message;
	}
}

// Render education edit form
function renderEducationForm() {
	var list = document.getElementById('educationList');
	list.innerHTML = '';
	resumeData.education.forEach(function(edu, index) {
		var item = document.createElement('div');
		item.className = 'education-item';
		item.innerHTML = `
			<label>Years of Study:</label>
			<input type="number" class="education-years" min="1" max="10" value="${edu.years || ''}" />
			<p class="error education-years-error" style="display: none;"></p>
			<label>Field:</label>
			<input type="text" class="education-field" value="${edu.field || ''}" />
			<p class="error education-field-error" style="display: none;"></p>
			<label>Degree Type:</label>
			<select class="degree-type">
				<option value="Choose">Choose</option>
				<option value="BSC">BSC (Bachelor of Science)</option>
				<option value="BA">BA (Bachelor of Arts)</option>
				<option value="BCS">BCS (Bachelor of Computer Science)</option>
				<option value="MBA">MBA (Master of Business Administration)</option>
				<option value="MS">MS (Master of Science)</option>
				<option value="Diploma">Diploma</option>
				<option value="Other">Other</option>
			</select>
			<p class="error degree-type-error" style="display: none;"></p>
			<button class="remove-education-btn">Remove</button>
		`;
		item.querySelector('.degree-type').value = edu.degree || 'Choose';
		item.querySelector('.remove-education-btn').addEventListener('click', function() {
			resumeData.education.splice(index, 1);
			renderEducationForm();
			validateEducationForm();
		});
		list.appendChild(item);
	});
	// Add event listeners for validation
	document.querySelectorAll('#educationList input, #educationList select').forEach(function(input) {
		input.addEventListener('input', validateEducationForm);
		input.addEventListener('change', validateEducationForm);
	});
}

// Render experience edit form
function renderExperienceForm() {
	var list = document.getElementById('experienceList');
	list.innerHTML = '';
	resumeData.experience.forEach(function(exp, index) {
		var item = document.createElement('div');
		item.className = 'experience-item';
		item.innerHTML = `
			<label>Company Name:</label>
			<input type="text" class="company-name" value="${exp.company || ''}" />
			<p class="error company-name-error" style="display: none;"></p>
			<label>Time in Company:</label>
			<input type="number" class="years-in-company" min="0" max="50" value="${exp.yearsInCompany || ''}" />
			<p class="error years-in-company-error" style="display: none;"></p>
			<label><input type="checkbox" class="currently-working" ${exp.currentlyWorking ? 'checked' : ''} /> I am currently working here</label>
			<label>Role/Position:</label>
			<input type="text" class="job-role" value="${exp.role || ''}" />
			<p class="error job-role-error" style="display: none;"></p>
			<button class="remove-experience-btn">Remove</button>
		`;
		item.querySelector('.remove-experience-btn').addEventListener('click', function() {
			resumeData.experience.splice(index, 1);
			renderExperienceForm();
			validateExperienceForm();
		});
		list.appendChild(item);
	});
	// Add event listeners for validation
	document.querySelectorAll('#experienceList input, #experienceList select').forEach(function(input) {
		input.addEventListener('input', validateExperienceForm);
		input.addEventListener('change', validateExperienceForm);
	});
}

// Handle edit education
function handleEditEducation() {
	renderEducationForm();
	document.getElementById('educationContainer').style.display = 'block';
	validateEducationForm();
}

// Handle edit experience
function handleEditExperience() {
	renderExperienceForm();
	document.getElementById('experienceContainer').style.display = 'block';
	validateExperienceForm();
}

// Handle edit skills
function handleEditSkills() {
	document.getElementById('skills').value = resumeData.skills || '';
	document.getElementById('skillsContainer').style.display = 'block';
	validateSkillsForm();
}

// Handle add education
function handleAddEducation() {
	resumeData.education.push({years: '', field: '', degree: 'Choose'});
	renderEducationForm();
	validateEducationForm();
}

// Handle add experience
function handleAddExperience() {
	resumeData.experience.push({company: '', yearsInCompany: '', currentlyWorking: false, role: ''});
	renderExperienceForm();
	validateExperienceForm();
}

// Handle save education
function handleSaveEducation() {
	if (!validateEducationForm()) return;
	resumeData.education = [];
	document.querySelectorAll('#educationList .education-item').forEach(function(item) {
		var edu = {
			years: parseInt(item.querySelector('.education-years').value),
			field: item.querySelector('.education-field').value.trim(),
			degree: item.querySelector('.degree-type').value
		};
		resumeData.education.push(edu);
	});
	saveResumeData();
	document.getElementById('educationContainer').style.display = 'none';
	renderResumeDisplay();
	alert('Education updated successfully!');
}

// Handle save experience
function handleSaveExperience() {
	if (!validateExperienceForm()) return;
	resumeData.experience = [];
	document.querySelectorAll('#experienceList .experience-item').forEach(function(item) {
		var exp = {
			company: item.querySelector('.company-name').value.trim(),
			yearsInCompany: parseInt(item.querySelector('.years-in-company').value),
			currentlyWorking: item.querySelector('.currently-working').checked,
			role: item.querySelector('.job-role').value.trim()
		};
		resumeData.experience.push(exp);
	});
	saveResumeData();
	document.getElementById('experienceContainer').style.display = 'none';
	renderResumeDisplay();
	alert('Experience updated successfully!');
}

// Handle save skills
function handleSaveSkills() {
	if (!validateSkillsForm()) return;
	resumeData.skills = document.getElementById('skills').value.trim();
	saveResumeData();
	document.getElementById('skillsContainer').style.display = 'none';
	renderResumeDisplay();
	alert('Skills updated successfully!');
}

// Handle cancel education
function handleCancelEducation() {
	document.getElementById('educationContainer').style.display = 'none';
}

// Handle cancel experience
function handleCancelExperience() {
	document.getElementById('experienceContainer').style.display = 'none';
}

// Handle cancel skills
function handleCancelSkills() {
	document.getElementById('skillsContainer').style.display = 'none';
}

// Save resume data to localStorage
function saveResumeData() {
	var allResumes = JSON.parse(localStorage.getItem('resumes')) || {};
	allResumes[currentUser.userName] = resumeData;
	localStorage.setItem('resumes', JSON.stringify(allResumes));
}

// Add real-time validation as user types
document.addEventListener('DOMContentLoaded', function() {
	initializeResume();

	var editEducationBtn = document.getElementById('editEducationBtn');
	var editExperienceBtn = document.getElementById('editExperienceBtn');
	var editSkillsBtn = document.getElementById('editSkillsBtn');
	var addEducationBtn = document.getElementById('addEducationBtn');
	var addExperienceBtn = document.getElementById('addExperienceBtn');
	var saveEducationBtn = document.getElementById('saveEducationBtn');
	var saveExperienceBtn = document.getElementById('saveExperienceBtn');
	var saveSkillsBtn = document.getElementById('saveSkillsBtn');
	var cancelEducationBtn = document.getElementById('cancelEducationBtn');
	var cancelExperienceBtn = document.getElementById('cancelExperienceBtn');
	var cancelSkillsBtn = document.getElementById('cancelSkillsBtn');

	if (editEducationBtn) editEducationBtn.addEventListener('click', handleEditEducation);
	if (editExperienceBtn) editExperienceBtn.addEventListener('click', handleEditExperience);
	if (editSkillsBtn) editSkillsBtn.addEventListener('click', handleEditSkills);
	if (addEducationBtn) addEducationBtn.addEventListener('click', handleAddEducation);
	if (addExperienceBtn) addExperienceBtn.addEventListener('click', handleAddExperience);
	if (saveEducationBtn) saveEducationBtn.addEventListener('click', handleSaveEducation);
	if (saveExperienceBtn) saveExperienceBtn.addEventListener('click', handleSaveExperience);
	if (saveSkillsBtn) saveSkillsBtn.addEventListener('click', handleSaveSkills);
	if (cancelEducationBtn) cancelEducationBtn.addEventListener('click', handleCancelEducation);
	if (cancelExperienceBtn) cancelExperienceBtn.addEventListener('click', handleCancelExperience);
	if (cancelSkillsBtn) cancelSkillsBtn.addEventListener('click', handleCancelSkills);

	// Real-time validation for skills
	var skillsInput = document.getElementById('skills');
	if (skillsInput) {
		skillsInput.addEventListener('input', validateSkillsForm);
	}
});
