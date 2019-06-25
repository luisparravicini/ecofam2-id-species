
class BirdsMatcher
{
	constructor() {		
		this.name = 'Aves';

		this.matcherDiv = $('#matcher-birds');
		this.species = ["Elefante marino del sur", "Lobo marino de un pelo", "Lobo marino de 2 pelos", "Ballena franca austral", "Ballena jorobada", "Cachalote", "Franciscana", "Marsopa espinosa", "Marsopa de anteojos", "Delfin comun", "Delfín nariz de botella", "Delfin oscuro", "Orca", "Falsa orca"];
		this.candidates = new Candidates(this.species, $('#birds-candidate-species'));
	}

	enters() {
		this.matcherDiv.show();
	}

	exits() {
		this.matcherDiv.hide();
	}

	askFootInfo() {

	}

	start() {
		this.candidates.init();

		return new Promise((resolve, reject) => {
			this.candidates.show();

			$('#btn-birds-foot').one('click', x => {
				this.askFootInfo(resolve);
			});
			$('#btn-birds-beak').one('click', x => {
				this.askBeakInfo(resolve);
			});
			$('#btn-birds-feather').one('click', x => {
				this.askFeatherInfo(resolve);
			});
		});
	}
}
