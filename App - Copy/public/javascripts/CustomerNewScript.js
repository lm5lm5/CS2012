function check(event) {
	// Get Values
	var ccNo  = document.getElementById('ccNo').value;
	var username  = document.getElementById('username').value;
	var password  = document.getElementById('password').value;

	// Simple Check
	if(username.length == 0 || password.length == 0) {
		alert("Username or password missing");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	
	// Simple Check
	if(ccNo.length != 8) {
		alert("Invalid cid no");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	
}