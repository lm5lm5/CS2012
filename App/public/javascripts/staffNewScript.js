function check(event) {
	// Get Values
	// var ccNo  = document.getElementById('ccNo').value;
	var username  = document.getElementById('username').value;
	var password  = document.getElementById('password').value;
	var restaurant  = document.getElementById('restaurant').value;

//"wen shufa" = "   wen    shufa     "
//"wen shufa" "wen shufa "
	// Simple Check
	if(username.length == 0 || password.length == 0 || restaurant.length == 0) {
		alert("pls fill up all missing box");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

}