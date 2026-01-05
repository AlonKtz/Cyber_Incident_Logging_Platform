// Display tech stack for current user on resume.html page
function displayTechStack() {
	var allResumes = JSON.parse(localStorage.getItem('resumes')) || {};
	var userResume = allResumes[currentUser.userName];

	var container = document.getElementById('techStackDisplay');
	container.innerHTML = '';

	if (!userResume) {
		container.innerHTML = '<p>No tech stack information available. <a href="update-profile.html">Add your tech stack now</a></p>';
		return;
	}

	if (!userResume.education.years && !userResume.experience.company && !userResume.skills) {
		container.innerHTML = '<p>No tech stack information added yet. <a href="update-profile.html">Add your tech stack now</a></p>';
		return;
	}

	var html = '<div class="tech-stack-display">';

	// Profile header
	html += '<div class="profile-header">';
	html += '<h2>' + currentUser.firstName + ' ' + currentUser.lastName + '</h2>';
	html += '<p>@' + currentUser.userName + '</p>';
	html += '</div>';

	// Education section
	if (userResume.education.years || userResume.education.field || userResume.education.degree !== 'Choose') {
		html += '<section class="tech-section">';
		html += '<h3>📚 Education</h3>';
		html += '<div class="section-content">';
		if (userResume.education.years) {
			html += '<p><strong>Years of Study:</strong> ' + userResume.education.years + ' years</p>';
		}
		if (userResume.education.field) {
			html += '<p><strong>Field:</strong> ' + escapeHtml(userResume.education.field) + '</p>';
		}
		if (userResume.education.degree && userResume.education.degree !== 'Choose') {
			html += '<p><strong>Degree:</strong> ' + escapeHtml(userResume.education.degree) + '</p>';
		}
		html += '</div>';
		html += '</section>';
	}

	// Experience section
	if (userResume.experience.company || userResume.experience.role) {
		html += '<section class="tech-section">';
		html += '<h3>💼 Experience</h3>';
		html += '<div class="section-content">';
		if (userResume.experience.company) {
			html += '<p><strong>Company:</strong> ' + escapeHtml(userResume.experience.company) + '</p>';
		}
		if (userResume.experience.role) {
			html += '<p><strong>Role:</strong> ' + escapeHtml(userResume.experience.role) + '</p>';
		}
		var statusText = userResume.experience.currentlyWorking ? 
			'<span class="status-current">Currently Working Here</span>' : 
			userResume.experience.yearsInCompany + ' years';
		html += '<p><strong>Duration:</strong> ' + statusText + '</p>';
		html += '</div>';
		html += '</section>';
	}

	// Skills section
	if (userResume.skills) {
		html += '<section class="tech-section">';
		html += '<h3>⚡ Skills</h3>';
		html += '<div class="section-content">';
		var skillsList = userResume.skills.split(',').map(function(skill) {
			return '<span class="skill-tag">' + escapeHtml(skill.trim()) + '</span>';
		}).join('');
		html += '<div class="skills-container">' + skillsList + '</div>';
		html += '</div>';
		html += '</section>';
	}

	html += '</div>';
	container.innerHTML = html;
}

// Safe HTML escaping
function escapeHtml(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
	displayTechStack();
});
