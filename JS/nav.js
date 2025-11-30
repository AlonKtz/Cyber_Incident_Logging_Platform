// download the navbar file content (fetch)
fetch("navBar.html")
// r is the file and .text tell it to be red as text (read)
.then(function(r){ return r.text(); })
// put the html text R into the div with id "navBar" (insert)
.then(function(t){ document.getElementById("navBar").innerHTML = t; });