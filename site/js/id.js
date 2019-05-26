let species = ["Elefante marino del sur", "Lobo marino de un pelo", "Lobo marino de 2 pelos", "Ballena franca austral", "Ballena jorobada", "Cachalote", "Franciscana", "Marsopa espinosa", "Marsopa de anteojos", "Delfin comun", "Delfín nariz de botella", "Delfin oscuro", "Orca", "Falsa orca"];
let data = [
["Aletas posteriores", true, true, true, false, false, false, false, false, false, false, false, false, false, false],
["Menos de 2,3 m de largo", false, false, true, false, false, false, true, true, true, false, false, true, false, false],
["Con barbas", false, false, false, true, true, false, false, false, false, false, false, false, false, false],
["Más de 3 m de largo", true, false, false, true, true, true, false, false, false, false, true, false, true, true],
["Cuerpo totalmente negro", false, false, false, false, false, false, false, true, false, false, false, false, false, true],
["Cuerpo blanco y negro", false, false, false, false, false, false, false, false, true, false, false, false, true, false],
["Aleta dorsal presente", false, false, false, false, true, true, true, true, true, true, true, true, true, true],
["Hocico muy fino, color uniforme", false, false, false, false, false, false, true, false, false, false, false, false, false, false],
];

let candidates;
let questionsAsked;


// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function showCandidates() {
	let node = $('#candidate-species').empty();
	node.append('<p class="hdr">Posibles especies</p>');
	node.append('<p>' + candidates.map(x => species[x]).join(', ') + '</p>');
}

function findNextQuestion() {
	// if (questionsAsked.length == 0)
	// 	return 0;

	let q = []
	data.forEach((row, rowIndex) => {
		let alreadyAsked = (questionsAsked.indexOf(rowIndex) > -1);

		if (alreadyAsked)
			return false;

		let yesCount = candidates.reduce((accum, candidateId) => {
			return accum + (row[candidateId+1] == true ? 1 : 0);
		}, 0);

		// sirven las preguntas donde con la respuesta si/no
		// se puede particionar candidates en dos grupos
		// no vacios
		let includeQuestion = (yesCount != 0 && yesCount != candidates.length);
		if (includeQuestion) {
console.log("q:" + row[0] + " -> " + yesCount + "/" + candidates.length);
			q.push(rowIndex);
		}
	});

	//TODO buscar la "mejor" pregunta, ahora devuelvo una random
	return (q.length > 0 ? q[getRandomInt(0, q.length)] : null);
}

function answerQuestion(questionIndex, answeredYes) {
	questionsAsked.push(questionIndex);

	if (answeredYes == null) return;

	data[questionIndex].forEach((value, index) => {
		if (index > 0) {
			if (answeredYes && !value || !answeredYes && value) {
				let candidateIndex = candidates.indexOf(index - 1);
				if (candidateIndex > -1) {
					candidates.splice(candidateIndex, 1);
				}
			}
		}
	});
}

function askQuestion() {
	return new Promise((resolve, reject) => {
		let node = $('#question').empty();
		let index = findNextQuestion();
		if (index == null) {
			node.append('<p>No hay más preguntas</p>');

			resolve({ noMoreQuestions: true });
		}

		node.append('<p>¿' + data[index][0] + '?</p>');
		node.append('<button class="btn btn-primary" id="answer-yes">Sí</button> ');
		node.append('<button class="btn btn-primary" id="answer-no">No</button> ');
		node.append('<button class="btn btn-primary" id="answer-skip">No se</button>');

		$('#answer-yes').click(() => { resolve({ questionIndex: index, answeredYes: true }); });
		$('#answer-no').click(() => { resolve({ questionIndex: index, answeredYes: false }); });
		$('#answer-skip').click(() => { resolve({ questionIndex: index, answeredYes: null }); });
	});
}

function askNextQuestion() {
	askQuestion().then((data) => {
		if (data.noMoreQuestions) return;

console.log("answer: " + data.answeredYes);
		answerQuestion(data.questionIndex, data.answeredYes);
		showCandidates();
console.log("candidates: " + candidates.length);
console.log("-----------------------");

		askNextQuestion();
	});
}

function startId() {
	questionsAsked = [];
	candidates = [];
	for (let i = 0; i < species.length; i++)
		candidates.push(i);
	showCandidates();

	askNextQuestion();
}


$(document).ready(() => {
	$('#btn-reset').click(startId);
	startId();
});

