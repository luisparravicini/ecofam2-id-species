
class InitialMatcher
{
	constructor() {
		this.matcherDiv = $('#matcher-initial');
		this.name = 'Inicio';
	}

	enters() {
		this.matcherDiv.show();
	}

	exits() {
		this.matcherDiv.hide();
	}

	start() {
		return new Promise((resolve, reject) => {
			$('#btn-initial-tortuga').one('click', x => {
				resolve(new TurtlesMatcher());
			});
			$('#btn-initial-ave').one('click', x => {
				resolve(null);
			});
			$('#btn-initial-otro').one('click', x => {
				resolve(new MammalsMatcher());
			});
		});
	}
}
