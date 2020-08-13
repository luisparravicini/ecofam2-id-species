
class Candidates
{
	constructor(species, node) {
		this.species = species;
		this.candidates = null;
		this.node = node;
	}

	init() {
		this.candidates = [];
		for (let i = 0; i < this.species.length; i++)
			this.candidates.push(i);
	}

	show() {
		let node = this.node.empty();
		node.append('<p class="hdr">De acuerdo a tu selección la especie que observaste podría ser:</p>');
		node.append('<p>' + this.candidates.map(x => this.species[x]).join(', ') + '</p>');
	}

	length() {
		return this.candidates.length;
	}
}
