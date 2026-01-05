
// events are loaded on each render to ensure up-to-date data
var events = [];

function createTableHeader() {
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    var headers = ['Date & Time', 'Drill/Actual', 'Type', 'Role', 'Severity', 'Affected System', 'Summary', 'Reporter', 'Actions'];
    for (var i = 0; i < headers.length; i++) {
        var th = document.createElement('th');
        th.textContent = headers[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    return thead;
}

function createTableBody(events) {
    var tbody = document.createElement('tbody');
    for (var i = 0; i < events.length; i++) {
        var ev = events[i];
        var tr = document.createElement('tr');

        var tdDate = document.createElement('td'); tdDate.textContent = ev.eventDateTime || '';
        var tdDrill = document.createElement('td'); tdDrill.textContent = ev.drillFlag || '';
        var tdType = document.createElement('td'); tdType.textContent = ev.eventType || '';
        var tdRole = document.createElement('td'); tdRole.textContent = ev.role || '';
        var tdSeverity = document.createElement('td'); tdSeverity.textContent = ev.severity || '';
        var tdSystem = document.createElement('td'); tdSystem.textContent = ev.affectedSystem || '';
        var tdSummary = document.createElement('td'); tdSummary.textContent = ev.summary || '';
        var tdReporter = document.createElement('td'); tdReporter.textContent = ev.reporter || '';

        tr.appendChild(tdDate);
        tr.appendChild(tdDrill);
        tr.appendChild(tdType);
        tr.appendChild(tdRole);
        tr.appendChild(tdSeverity);
        tr.appendChild(tdSystem);
        tr.appendChild(tdSummary);
        tr.appendChild(tdReporter);

        // actions cell: show delete button only for events created by current user
        var tdAction = document.createElement('td');
        if (typeof currentUser !== 'undefined' && currentUser && currentUser.userName && ev.reporter) {
            var reporterNorm = ev.reporter.toString().trim().toLowerCase();
            var currentNorm = currentUser.userName.toString().trim().toLowerCase();
            if (reporterNorm === currentNorm) {
                var btn = document.createElement('button');
                btn.textContent = 'Delete';
                btn.className = 'delete-btn';
                // store id on the button to avoid closure issues
                btn.setAttribute('data-id', ev.id);
                btn.addEventListener('click', function () {
                    var id = this.getAttribute('data-id');
                    if (confirm('Delete this event?')) {
                        removeEvent(Number(id));
                    }
                });
                tdAction.appendChild(btn);
            } else {
                tdAction.textContent = '';
            }
        } else {
            tdAction.textContent = '';
        }
        tr.appendChild(tdAction);

        tbody.appendChild(tr);
    }
    return tbody;
}

function removeEvent(id) {
    for (var i = 0; i < events.length; i++) {
        if (events[i].id === id) {
            events.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('events', JSON.stringify(events));
    renderIncidents();
}

// Actions column removed — no remove buttons are rendered anymore.
// If a future feature needs row actions, add a separate actions UI outside the table and implement handlers here.

function renderIncidents() {
    // reload events to get fresh data
    events = JSON.parse(localStorage.getItem('events')) || [];

    var container = document.getElementById('incidentsTableContainer');
    if (!container) {
        // create container if missing
        container = document.createElement('div');
        container.id = 'incidentsTableContainer';
        var root = document.body;
        root.appendChild(container);
    }

    // clear container
    container.innerHTML = '';

    if (!events || events.length === 0) {
        var p = document.createElement('p');
        p.textContent = 'No incidents logged yet.';
        container.appendChild(p);
        return;
    }

    // wrapper to hold table
    var wrapper = document.createElement('div');
    wrapper.className = 'incidents-wrapper';

    var table = document.createElement('table');
    table.appendChild(createTableHeader());
    table.appendChild(createTableBody(events));

    wrapper.appendChild(table);

    container.appendChild(wrapper);
}

// run on load
document.addEventListener('DOMContentLoaded', function () {
    renderIncidents();
});
