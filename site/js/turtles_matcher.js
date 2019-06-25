
class TurtlesMatcher
{
	constructor() {
		this.name = 'Tortugas';
		this.matcherDiv = $('#matcher-turtles');
	}

	enters() {
		this.matcherDiv.show();
	}

	exits() {
		this.matcherDiv.hide();
	}

	start() {
		return new Promise((resolve, reject) => {
			resolve(null);
		});
	}
}
