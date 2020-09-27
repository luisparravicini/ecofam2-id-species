
class BirdsMatcher
{
	constructor() {		
		this.name = 'Aves';

		this.feetSelectorId = '#matcher-birds-feet';
		this.wingSelectorId = '#matcher-birds-wing';
		this.beakSelectorId = '#matcher-birds-beak';
		this.beakColorSelectorIdBase = '#matcher-birds-beak-color-';

		this.selectedWingSelector = 'selected-bird-wing';
		this.selectedFeetSelector = 'selected-bird-feet';
		this.selectedBeakColorSelector = 'selected-bird-beak-color';
		this.selectedBirdBeakSelector = 'selected-bird-beak';

		this.matcherDiv = $('#matcher-birds');
		this.feetDiv = $(this.feetSelectorId);
		this.wingDiv = $(this.wingSelectorId);
		this.beakDiv = $(this.beakSelectorId);
		this.beakColor2Div = $(this.beakColorSelectorIdBase + '2');
		this.beakColor4Div = $(this.beakColorSelectorIdBase + '4');
		this.beakColorNone = $(this.beakColorSelectorIdBase + 'other');
		this.generalDiv = $('#matcher-birds-general');

		this.selectedValues = {
			feet: null,
			beak: null,
			beakColor2: null,
			beakColor4: null,
			wing: null,
		};

		this._initSpecies();
		this._initCandidates();
	}

	_initSpecies() {
		this.species = birdSpecies;
	}

	enters() {
		this.matcherDiv.show();
		this._showSection(this.generalDiv);
	}

	exits() {
		this.matcherDiv.hide();
	}

	_findFutureEnabledStates(valueKey, selectorId) {
		let oldValue = this.selectedValues[valueKey];
		let self = this;
		let enabledStates = [];
		$(selectorId + ' button.answer').each(function() {
			let value = $(this).data('answer');
			if (value == '') value = null;
			
			self.selectedValues[valueKey] = value;
			self._filterCandidates();

			let willHaveCandidates = (self.candidates.candidates.length > 0);
			enabledStates.push(willHaveCandidates);
		});

		this.selectedValues[valueKey] = oldValue;
		this._filterCandidates();

		return enabledStates;
	}

	_getWingInfoOptions() {
		let valueKey = 'wing';
		let selectorId = this.wingSelectorId;
		let enabledStates = this._findFutureEnabledStates(valueKey, selectorId);
		return enabledStates;
	}

	askWingInfo(resolve) {
		let valueKey = 'wing';
		let enabledStates = this._getWingInfoOptions();

		this._setupImageSection(
			this.wingDiv,
			this.selectedWingSelector,
			'alas',
			valueKey,
			null,
			enabledStates
		);
	}

	_getFeetInfoOptions() {
		let valueKey = 'feet';
		let selectorId = this.feetSelectorId;
		let enabledStates = this._findFutureEnabledStates(valueKey, selectorId);
		return enabledStates;
	}

	askFeetInfo(resolve) {
		let valueKey = 'feet';
		let enabledStates = this._getFeetInfoOptions();

		this._setupImageSection(
			this.feetDiv,
			this.selectedFeetSelector,
			'pata',
			valueKey,
			null,
			enabledStates
		);
	}

	_getBeakInfoOptions() {
		let valueKey = 'beak';
		let selectorId = this.beakSelectorId;
		let enabledStates = this._findFutureEnabledStates(valueKey, selectorId);
		return enabledStates;
	}

	askBeakInfo(resolve) {
		let valueKey = 'beak';
		let oldValue = this.selectedValues[valueKey];
		let enabledStates = this._getBeakInfoOptions();

		this._setupImageSection(
			this.beakDiv,
			this.selectedBirdBeakSelector,
			'pico',
			valueKey,
			(_, value) => {
				if (value != oldValue)
					$('#' + this.selectedBeakColorSelector).empty();
			},
			enabledStates
		);
	}

	_getBeakColorInfoOptions() {
		let beak = this.selectedValues.beak;
		let allowBeakSelection = true;
		let enabledStates = null;

		let node = null;
		if (beak == 2) {
			node = this.beakColor2Div;
		} else if (beak == 4) {
			node = this.beakColor4Div;
		} else {
			node = this.beakColorNone;
			allowBeakSelection = false;
		}

		if (allowBeakSelection) {
			let keySufix = beak.toString();
			let elems = data['color_pico_' + keySufix].data;

			let valueKey = 'beakColor' + keySufix;
			let selectorId = this.beakColorSelectorIdBase + beak;
			enabledStates = this._findFutureEnabledStates(valueKey, selectorId);
		} else
			enabledStates = [];

		return enabledStates;
	}

	askBeakColorInfo(resolve) {
		let beak = this.selectedValues.beak;
		let allowBeakSelection = true;
		let elems = null;
		let valueKey = null;
		let enabledStates = null;

		let node = null;
		if (beak == 2) {
			node = this.beakColor2Div;
		} else if (beak == 4) {
			node = this.beakColor4Div;
		} else {
			node = this.beakColorNone;
			allowBeakSelection = false;
		}

		if (allowBeakSelection) {
			let keySufix = beak.toString();
			elems = data['color_pico_' + keySufix].data;

			valueKey = 'beakColor' + keySufix;
			enabledStates = this._getBeakColorInfoOptions();
		}

		this._setupSection(
			node,
			this.selectedBeakColorSelector,
			valueKey,
			(selected, value) => {
				selected.append($('<p>').text(elems[value - 1][0]));
			},
			enabledStates,
			// TODO: esto es un parche
			() => {
				 this.selectedValues['beakColor2'] = null;
				 this.selectedValues['beakColor4'] = null;
			}
		);
	}

	_setupImageSection(sectionElem, selectedAnswerElemId, imagePrefix, valueKey, onSelectedValue, enabledStates) {
		this._setupSection(sectionElem,
			selectedAnswerElemId,
			valueKey, function(node, value) {
				node.append(`<img src="images/${imagePrefix}-${value}.png"/>`);
				if (onSelectedValue != null)
					onSelectedValue(node, value);
			},
			enabledStates);
	}

	_setupSection(sectionElem, selectedAnswerElemId, valueKey, onSelected, enabledStates, onOther) {
		let buttons = sectionElem.find('button.answer');
		if (enabledStates) {
			// asumo que son los mismos botones, y en el mismo orden :|
			enabledStates.forEach((value, index) => {
					$(buttons[index]).prop('disabled', !value);
			});
		}
		$(buttons).unbind().on('click', event => {
			const elem = $(event.target);
			let value = elem.data('answer');
			if (value == '') value = null;

			var selected = $('#' + selectedAnswerElemId).empty();
			if (value != null)
				onSelected(selected, value);

			if (onOther) onOther();

			this.selectedValues[valueKey] = value;
			this._filterCandidates();
			this._setupButtons();
			this._showSection(this.generalDiv);
		});

		this._showSection(sectionElem);
	}

	_showSection(section) {
		[ this.wingDiv,
			this.feetDiv,
			this.generalDiv,
			this.beakDiv,
			this.beakColor2Div,
			this.beakColor4Div,
			this.beakColorNone,
		].forEach(x => {
			x.toggle( section == x );
		})
	}

	_filterCandidates() {
		// el poder 'cancelar' un filtro hace que tenga que recalcular todo
		this._initCandidates();

		let keys = [
			{ dataKey: 'patas', value: this.selectedValues.feet },
			{ dataKey: 'picos', value: this.selectedValues.beak },
			{ dataKey: 'color_pico_2', value: this.selectedValues.beakColor2 },
			{ dataKey: 'color_pico_4', value: this.selectedValues.beakColor4 },
			{ dataKey: 'alas', value: this.selectedValues.wing },
		];
		keys.forEach(x => {
			let indexes = this._getSpeciesIndexes(x.value, x.dataKey);
			this._filterSpecies(indexes);
		});

		this.candidates.show();
	}

	_filterSpecies(indexes) {
		if (indexes == null)
			return;

		let c = this.candidates.candidates;
		let i = c.length - 1;
		while (i >= 0 && c.length > 0) {
			if (!indexes.includes(c[i]))
				c.splice(i, 1);
			i -= 1;
		}
	}

	_getSpeciesIndexes(value, dataKey) {
		let result = null;

		if (value != null) {
			let curData = data[dataKey];
			let items = curData.data[value - 1];
			let i = 1;
			result = [];
			while (i < items.length) {
				if (items[i]) {
					let spName = this.species[i - 1];
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

	_clearSelections() {
			[
				this.selectedWingSelector,
				this.selectedFeetSelector,
				this.selectedBeakColorSelector,
				this.selectedBirdBeakSelector,
			].forEach(x => {
				$('#' + x).empty();
			});
	}

	_setupButtons() {
		let button = null;
		let hasOptions = false;

		button = $('#btn-birds-wing');
		hasOptions = (this._getWingInfoOptions().length > 0);
		button.prop('disabled', !hasOptions);
		if (hasOptions) {
			button.unbind().on('click', x => {
				this.askWingInfo(this.resolve);
			});
		}

		button = $('#btn-birds-foot');
		hasOptions = (this._getFeetInfoOptions().length > 0);
		button.prop('disabled', !hasOptions);
		if (hasOptions) {
			button.unbind().on('click', x => {
				this.askFeetInfo(this.resolve);
			});
		}

		button = $('#btn-birds-beak');
		hasOptions = (this._getBeakInfoOptions().length > 0);
		button.prop('disabled', !hasOptions);
		if (hasOptions) {
			button.unbind().on('click', x => {
				this.askBeakInfo(this.resolve);
			});
		}

		button = $('#btn-birds-feather');
		hasOptions = (this._getBeakColorInfoOptions().length > 0);
		button.prop('disabled', !hasOptions);
		if (hasOptions) {
			button.unbind().on('click', x => {
				this.askBeakColorInfo(this.resolve);
			});
		}
	}

	start() {
		this._initCandidates();

		return new Promise((resolve, reject) => {
			this.resolve = resolve;

			this.candidates.show();
			this._clearSelections();
			this._setupButtons();
		});
	}
}
