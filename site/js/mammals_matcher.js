
class MammalsMatcher {

	constructor() {
		this.name = 'Mamíferos';

		this.matcherDiv = $('#matcher-mammals');

		this.species = mammalSpecies;
		this.data = data['mamiferos_marinos'].data;

		this.candidates = new Candidates(this.species, this.matcherDiv.find('.candidate-species'));
		this.questionsAsked = null;
	}

	enters() {
		this.matcherDiv.show();
	}

	exits() {
		this.matcherDiv.hide();
	}

	// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}

	findNextQuestion() {
		// if (questionsAsked.length == 0)
		// 	return 0;

		let q = []
		this.data.forEach((row, rowIndex) => {
			let alreadyAsked = (this.questionsAsked.indexOf(rowIndex) > -1);

			if (alreadyAsked)
				return false;

			let yesCount = this.candidates.candidates.reduce((accum, candidateId) => {
				return accum + (row[candidateId+1] == true ? 1 : 0);
			}, 0);

			// sirven las preguntas donde con la respuesta si/no
			// se puede particionar candidates en dos grupos
			// no vacios
			let includeQuestion = (yesCount != 0 && yesCount != this.candidates.length());
console.log("includeQuestion?", includeQuestion);
			if (includeQuestion) {
	console.log("q:" + row[0] + " -> " + yesCount + "/" + this.candidates.length());
				q.push(rowIndex);
			}
		});

		//TODO buscar la "mejor" pregunta, ahora devuelvo una random
		return (q.length > 0 ? q[this.getRandomInt(0, q.length)] : null);
	}

	answerQuestion(questionIndex, answeredYes) {
		this.questionsAsked.push(questionIndex);

		if (answeredYes == null) return;

		this.data[questionIndex].forEach((value, index) => {
			if (index > 0) {
				if (answeredYes && !value || !answeredYes && value) {
					let candidateIndex = this.candidates.candidates.indexOf(index - 1);
					if (candidateIndex > -1) {
						this.candidates.candidates.splice(candidateIndex, 1);
					}
				}
			}
		});
	}

	askQuestion() {
		return new Promise((resolve, reject) => {
			let node = $('#question').empty();
			let index = this.findNextQuestion();
			if (index == null) {
				node.append('<p>No hay más preguntas</p>');

				resolve({ noMoreQuestions: true });
			}

			node.append('<p>¿' + this.data[index][0] + '?</p>');
			node.append('<button class="btn btn-primary" id="answer-yes">Sí</button> ');
			node.append('<button class="btn btn-primary" id="answer-no">No</button> ');
			node.append('<button class="btn btn-primary" id="answer-skip">No se</button>');

			$('#answer-yes').click(() => { resolve({ questionIndex: index, answeredYes: true }); });
			$('#answer-no').click(() => { resolve({ questionIndex: index, answeredYes: false }); });
			$('#answer-skip').click(() => { resolve({ questionIndex: index, answeredYes: null }); });
		});
	}

	askNextQuestion(resolve) {
		this.askQuestion().then((data) => {
			if (data.noMoreQuestions) {
				resolve(null);
				return;
			}

	console.log("answer: " + data.answeredYes);
			this.answerQuestion(data.questionIndex, data.answeredYes);
			this.candidates.show();
	console.log("candidates: " + this.candidates.length());
	console.log("-----------------------");

			this.askNextQuestion(resolve);
		});
	}

	start() {
		this.candidates.init();

		return new Promise((resolve, reject) => {
			this.questionsAsked = [];
			this.candidates.show();

			this.askNextQuestion(resolve);
		});
	}

}
