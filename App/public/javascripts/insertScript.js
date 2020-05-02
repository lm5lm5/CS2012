function check(event) {
	// Get Values
	var cid  = document.getElementById('cid').value;
	
	// Simple Check
	if(cid < 0) {
		alert("Invalid cid no");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}