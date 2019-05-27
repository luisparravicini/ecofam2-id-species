
function startId() {
	let id = new MammalId();
	id.start();
}


$(document).ready(() => {
	$('#btn-reset').click(startId);
	startId();
});

