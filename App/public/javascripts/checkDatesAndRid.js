function check(event) {
    // Get Values
    var startDate  = document.getElementById('startdate').value;
    var endDate  = document.getElementById('enddate').value;
    var rid = document.getElementById('rid').value;
    console.log("start: " + startDate);
    console.log("end: " + endDate);
    console.log("rid: " + rid);

    // Simple Check
    if(startDate.length === 0 || endDate.length === 0) {
        alert("Date missing");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if(rid.length === 0) {
        alert("Rider id missing");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    alert("--- Your Input ---\nStart: " + startDate + "\nEnd: " + endDate + "\nRid: " + rid);
}
