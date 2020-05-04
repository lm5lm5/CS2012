function check(event) {
	// Get Values
	var previouspw  = document.getElementById('previouspw').value;
	var password  = document.getElementById('password').value;
	var password2  = document.getElementById('password2').value;
	// Simple Check
	if(previouspw.length == 0 || password.length == 0 || password2.length == 0) {
		alert("You are required to fill in all fields");
		event.preventDefault();
		event.stopPropagation();
		return false;
        } else if(password != password2) {
                alert("The new password you have re-entered is different from the one you entered");
                event.preventDefault();
		event.stopPropagation();
		return false;
        } else {
                alert("Your password has been changed successfully;");
                return true;
        }
}