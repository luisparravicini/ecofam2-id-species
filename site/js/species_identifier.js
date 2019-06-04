
class SpeciesIdentifier {

	constructor() {
		this.currentMatcher = null;
	}

	start() {
		this.reset();
		this.update();
	}

	update() {
		this.currentMatcher.enters();

		this.currentMatcher.start().then(nextMatcher => {			
			if (nextMatcher != null) {
				this.currentMatcher.exits();
				this.currentMatcher = nextMatcher;
				this.update();
			}
		});
	}

	reset() {
		if (this.currentMatcher != null)
			this.currentMatcher.exits();
		this.currentMatcher = new InitialMatcher();
	}
}
