
class BirdsMatcher
{
	constructor() {		
		this.name = 'Aves';

		this.matcherDiv = $('#matcher-birds');
		this.feetDiv = $('#matcher-birds-feet');
		this.beakDiv = $('#matcher-birds-beak');
		this.beakColor2Div = $('#matcher-birds-beak-color-2');
		this.beakColor4Div = $('#matcher-birds-beak-color-4');
		this.generalDiv = $('#matcher-birds-general');

		this.selectedValues = {
			feet: null,
			beak: null,
			beakColor2: null,
			beakColor4: null,
			wings: null,
		};

		this.initSpecies();
		this.candidates = new Candidates(this.species, this.matcherDiv.find('.candidate-species'));
	}

	initSpecies() {
		this.species = [];
		['color_pico_4', 'color_pico_2', 'patas', 'picos'].forEach((k) => {
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
		this._setupImageSection(
			this.feetDiv,
			'selected-bird-feet',
			'pata',
			'feet'
		);
	}

	askBeakInfo(resolve) {
		this._setupImageSection(
			this.beakDiv,
			'selected-bird-beak',
			'pico',
			'beak'
		);
	}

	askBeakColorInfo(resolve) {
		let beak = this.selectedValues.beak;
		if (beak != 2 && beak != 4) {
			alert('Con la forma de pico seleccionada no se pueden mostrar colores de pico');
			return;
		}
		let keySufix = beak.toString();
		let node = (beak == 2 ? this.beakColor2Div : this.beakColor4Div);
		let elems = data['color_pico_' + keySufix].data;
		this._setupSection(
			node,
			'selected-bird-beak-color',
			'beakColor' + keySufix,
			function(selected, value) {
				selected.append($('<p>').text(elems[value][0]));
			}
		);
	}

	_setupImageSection(sectionElem, selectedAnswerElemId, imagePrefix, valueKey) {
		this._setupSection(sectionElem,
			selectedAnswerElemId,
			valueKey, function(node, value) {
				node.append(`<img src="images/${imagePrefix}-${value}.png"/>`);
			});


	}

	_setupSection(sectionElem, selectedAnswerElemId, valueKey, onSelected) {
		sectionElem.find('button.answer').on('click', event => {
			const elem = $(event.target);
			const value = elem.data('answer');

			var selected = $('#' + selectedAnswerElemId).empty();
			if (value != '')
				onSelected(selected, value);

			this.selectedValues[valueKey] = value;
			this._filterCandidates();

			this._showSection(this.generalDiv);
		});

		this._showSection(sectionElem);
	}

	_showSection(section) {
		[ this.feetDiv,
			this.generalDiv,
			this.beakDiv,
			this.beakColor2Div,
			this.beakColor4Div,
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
