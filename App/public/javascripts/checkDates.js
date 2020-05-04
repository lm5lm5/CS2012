function check(event) {
    // Get Values
    var startDate  = document.getElementById('startdate').value;
    var endDate  = document.getElementById('enddate').value;
    console.log("start: " + startDate);
    console.log("end: " + endDate);

    // Simple Check
    if(startDate.length === 0 || endDate.length === 0) {
        alert("Date missing");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}
