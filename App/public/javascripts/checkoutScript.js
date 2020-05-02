function check(event) {
	// Get Values
	var payment  = document.getElementById('payment').value;
	var delivery  = document.getElementById('delivery').value;
	var delivery2 = document.getElementById('delivery2').value

	// Simple Check
	if(payment != "Cash" && payment != "Credit Card") {
		alert("Wrong option for payment method");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	
	// Simple Check
	if(delivery.length == 0) {
		alert("Missing delivery location");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	
}