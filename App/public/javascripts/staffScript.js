function check(event) {
	// Get Values
	var username  = document.getElementById('username').value;
	var password  = document.getElementById('password').value;
	var restaurant  = document.getElementById('restaurant').value;
	
	// Simple Check
	if(username.length == 0 || password.length == 0 || restaurant.length == 0) {
		alert("Username or password or restaurant name missing");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}