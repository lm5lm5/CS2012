function check(event) {
	// Get Values
	var feedback  = document.getElementById('feedback').value;
	// Simple Check
	if(feedback.length == 0) {
		alert("You are required to fill in all fields");
		event.preventDefault();
		event.stopPropagation();
		return false;
        }
}