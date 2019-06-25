
class BirdsMatcher
{
	constructor() {
		this.matcherDiv = $('#matcher-birds');
		this.candidates = null;
		
		this.name = 'Aves';
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
		return new Promise((resolve, reject) => {
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
