function check(event) {
	// Get Values
	var fname  = document.getElementById('fname').value;
	var dailylimit  = document.getElementById('dailylimit').value;
	var isavailable  = document.getElementById('isavailable').value;
	var category  = document.getElementById('category').value;
	var price  = document.getElementById('price').value;

	if(fname.length == 0 || dailylimit.length == 0 || isavailable.length == 0 || category.length == 0 || price.length == 0) {
		alert("You are required to fill in all fields");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

}