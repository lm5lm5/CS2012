function check(event) {
	// Get Values
	var Description  = document.getElementById('descriptionpromo').value;
	var discount  = document.getElementById('discount').value;
	var startdate  = document.getElementById('startdate').value;
	var enddate  = document.getElementById('enddate').value;

	function endAfterStart(start,end){
		return new Date(start.split('/').reverse().join('/')) <
				new Date(end.split('/').reverse().join('/'));
	  }
	//   alert(endAfterStart(startdate,enddate)); //=> true
	// Simple Check

	if(Description.length == 0 || discount.length == 0 || startdate.length == 0 || enddate.length == 0) {
		alert("pls fill up all missing box");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

	if(!endAfterStart(startdate,enddate)) {
		alert("enddate cannot be earlier date");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}