
class BirdsMatcher
{
	constructor() {		
		this.name = 'Aves';

		this.matcherDiv = $('#matcher-birds');
		this.feetDiv = $('#matcher-birds-feet');
		this.beakDiv = $('#matcher-birds-beak');
		this.generalDiv = $('#matcher-birds-general');

		this.selectedValues = {
			feet: null,
			beak: null,
			wings: null,
		};

		this.initSpecies();
		this.candidates = new Candidates(this.species, this.matcherDiv.find('.candidate-species'));
	}

	initSpecies() {
		this.species = [];
		['color_pico', 'patas', 'picos'].forEach((k) => {
			let names = data[k].species;
			names.forEach(name => {
				if (!this.species.includes(name))
					this.species.push(name);
			});
		});
	}

	enters() {
		this.matcherDiv.show();
		this._showSection(this.generalDiv);
	}

	exits() {
		this.matcherDiv.hide();
	}

	askFeetInfo(resolve) {
		this._setupSection(
			this.feetDiv,
			'selected-bird-feet',
			'pata',
			'feet'
		);
	}

	askBeakInfo(resolve) {
		this._setupSection(
			this.beakDiv,
			'selected-bird-beak',
			'pico',
			'beak'
		);
	}

	_setupSection(sectionElem, selectedAnswerElemId, imagePrefix, valueKey) {
		sectionElem.find('button.answer').on('click', event => {
			const elem = $(event.target);
			const value = elem.data('answer');

			var selected = $('#' + selectedAnswerElemId).empty();
			if (value != '')
				selected.append(`<img src="images/${imagePrefix}-${value}.png"/>`);

			this.selectedValues[valueKey] = value;
			this._filterCandidates();

			this._showSection(this.generalDiv);
		});

		this._showSection(sectionElem);
	}

	_showSection(section) {
		[ this.feetDiv,
			this.generalDiv,
			this.beakDiv
		].forEach(x => {
			x.toggle( section == x );
		})
	}

	_filterCandidates() {
		this.candidates.show();
	}

	start() {
		this.candidates.init();

		return new Promise((resolve, reject) => {
			this.candidates.show();

			$('#btn-birds-foot').on('click', x => {
				this.askFeetInfo(resolve);
			});
			$('#btn-birds-beak').on('click', x => {
				this.askBeakInfo(resolve);
			});
			$('#btn-birds-feather').on('click', x => {
				this.askBeakColorInfo(resolve);
			});

		});
	}
}
