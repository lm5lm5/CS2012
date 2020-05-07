function check(event) {
    // Get Values
    var date  = document.getElementById('date').value;
    var location  = document.getElementById('loc').value;

    // Simple Check
    if (location.length === 0) {
        alert("Location missing");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if (date.length === 0) {
        alert("Date missing");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}
