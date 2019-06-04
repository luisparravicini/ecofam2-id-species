
class SpeciesIdentifier {

	constructor() {
		this.currentMatcher = null;
		this.breadcrumb = $('#breadcrumb');
	}

	start() {
		this.reset();
		this.update();
	}

	update() {
		let navItem = $('<li class="nav-item">');
		navItem.append(`<a class="nav-link" href="#">${this.currentMatcher.name}</a>`);
		this.breadcrumb.append(navItem);

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
		this.breadcrumb.empty();

		if (this.currentMatcher != null)
			this.currentMatcher.exits();
		this.currentMatcher = new InitialMatcher();
	}
}
