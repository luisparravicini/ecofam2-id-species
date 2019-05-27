
let identifier = new SpeciesIdentifier();

function startId() {
	identifier.start();
}


$(document).ready(() => {
	$('#btn-reset').click(startId);
	startId();
});

