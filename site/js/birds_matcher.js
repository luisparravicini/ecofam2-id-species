
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
		this.selectedBeakColorId = 'selected-bird-beak-color';

		this.selectedValues = {
			feet: null,
			beak: null,
			beakColor2: null,
			beakColor4: null,
			wings: null,
		};

		this._initSpecies();
		this._initCandidates();
	}

	_initSpecies() {
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
			'feet',
			null
		);
	}

	askBeakInfo(resolve) {
		let oldValue = this.selectedValues.beak;
		this._setupImageSection(
			this.beakDiv,
			'selected-bird-beak',
			'pico',
			'beak',
			(_, value) => {
				if (value != oldValue)
					$('#' + this.selectedBeakColorId).empty();
			}
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
			this.selectedBeakColorId,
			'beakColor' + keySufix,
			(selected, value) => {
				selected.append($('<p>').text(elems[value][0]));
			}
		);
	}

	_setupImageSection(sectionElem, selectedAnswerElemId, imagePrefix, valueKey, onSelectedValue) {
		this._setupSection(sectionElem,
			selectedAnswerElemId,
			valueKey, function(node, value) {
				node.append(`<img src="images/${imagePrefix}-${value}.png"/>`);
				if (onSelectedValue != null)
					onSelectedValue(node, value);
			});
	}

	_setupSection(sectionElem, selectedAnswerElemId, valueKey, onSelected) {
		sectionElem.find('button.answer').unbind().on('click', event => {
			const elem = $(event.target);
			let value = elem.data('answer');
			if (value == '') value = null;

			var selected = $('#' + selectedAnswerElemId).empty();
			if (value != null)
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
		// el poder 'cancelar' un filtro hace que tenga que recalcular todo
		this._initCandidates();
		
		console.log(this.selectedValues);

		let keys = [
			{ dataKey: 'patas', value: this.selectedValues.feet },
			{ dataKey: 'picos', value: this.selectedValues.beak },
			{ dataKey: 'color_pico_2', value: this.selectedValues.beakColor2 },
			{ dataKey: 'color_pico_4', value: this.selectedValues.beakColor4 },
		];
		keys.forEach(x => {
			let indexes = this._getSpeciesIndexes(x.value, x.dataKey);
			this._filterSpecies(indexes);
		});

		this.candidates.show();
	}

	_filterSpecies(indexes) {
		if (indexes != null) {
			let c = this.candidates.candidates;
			let i = c.length - 1;
			while (i >= 0 && c.length > 0) {
				if (!indexes.includes(c[i]))
					c.splice(i, 1);
				i -= 1;
			}
		}
	}

	_getSpeciesIndexes(value, dataKey) {
		let result = null;

		if (value != null) {
			let curData = data[dataKey];
			let items = curData.data[value - 1];
			let i = 0;
			result = [];
			while (i < items.length) {
				if (items[i]) {
					let spName = curData.species[i];
					let speciesIndex = this.candidates.species.indexOf(spName);
					if (speciesIndex == -1)
						console.log(`Species: '${spName}' not found`);

					result.push(speciesIndex);
				}
				i += 1;
			}
		}

		return result;
	}

	_initCandidates() {
		this.candidates = new Candidates(this.species, this.matcherDiv.find('.candidate-species'));
		this.candidates.init();
	}

	start() {
		this._initCandidates();

		return new Promise((resolve, reject) => {
			this.candidates.show();

			$('#btn-birds-foot').unbind().on('click', x => {
				this.askFeetInfo(resolve);
			});
			$('#btn-birds-beak').unbind().on('click', x => {
				this.askBeakInfo(resolve);
			});
			$('#btn-birds-feather').unbind().on('click', x => {
				this.askBeakColorInfo(resolve);
			});

		});
	}
}
