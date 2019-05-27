
class SpeciesIdentifier {

	constructor() {
		this.currentMatcher = null;
	}

	start() {
		this.currentMatcher = new InitialMatcher();
		this.currentMatcher.start();

	}
}
