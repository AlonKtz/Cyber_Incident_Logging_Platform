let userName = JSON.parse(localStorage.getItem("currentUser"));

// show greeting
document.getElementById('userName').textContent = currentUser.firstName + ' ' + ', Also Known by: ' + currentUser.userName;

// render only events logged by the current user
function renderUserEvents() {
    var events = JSON.parse(localStorage.getItem('events')) || [];
    var userEvents = [];
    for (var i = 0; i < events.length; i++) {
        if (events[i].reporter === currentUser.userName) {
            userEvents.push(events[i]);
        }
    }

    var container = document.getElementById('eventsContainer');
    container.innerHTML = '';

    var title = document.createElement('h3');
    title.textContent = 'Your Logged Events';
    container.appendChild(title);

    if (userEvents.length === 0) {
        var p = document.createElement('p');
        p.textContent = 'You have not logged any events yet.';
        container.appendChild(p);
        // link to add new event
        var addLink = document.createElement('a');
        addLink.href = './addNew.html';
        addLink.textContent = 'Add a new event';
        container.appendChild(addLink);
        return;
    }

    var table = document.createElement('table');

    // header (show full event fields)
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    var headers = ['Date & Time', 'Drill/Actual', 'Type', 'Role', 'Severity', 'Affected System', 'Summary', 'Reporter'];
    for (var j = 0; j < headers.length; j++) {
        var th = document.createElement('th');
        th.textContent = headers[j];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    // body (full data rows)
    var tbody = document.createElement('tbody');
    for (var k = 0; k < userEvents.length; k++) {
        var ev = userEvents[k];
        var row = document.createElement('tr');

        var tdDate = document.createElement('td'); tdDate.textContent = ev.eventDateTime || '';
        var tdDrill = document.createElement('td'); tdDrill.textContent = ev.drillFlag || '';
        var tdType = document.createElement('td'); tdType.textContent = ev.eventType || '';
        var tdRole = document.createElement('td'); tdRole.textContent = ev.role || '';
        var tdSeverity = document.createElement('td'); tdSeverity.textContent = ev.severity || '';
        var tdSystem = document.createElement('td'); tdSystem.textContent = ev.affectedSystem || '';
        var tdSummary = document.createElement('td'); tdSummary.textContent = ev.summary || '';
        var tdReporter = document.createElement('td'); tdReporter.textContent = ev.reporter || '';

        row.appendChild(tdDate);
        row.appendChild(tdDrill);
        row.appendChild(tdType);
        row.appendChild(tdRole);
        row.appendChild(tdSeverity);
        row.appendChild(tdSystem);
        row.appendChild(tdSummary);
        row.appendChild(tdReporter);

        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    container.appendChild(table);

    // total count
    var count = document.createElement('p');
    count.textContent = 'Total events: ' + userEvents.length;
    container.appendChild(count);

    // link to view all incidents
    var viewAll = document.createElement('a');
    viewAll.href = './myIncidents.html';
    viewAll.textContent = 'View all incidents';
    container.appendChild(viewAll);
}

// run when script loads
renderUserEvents();

