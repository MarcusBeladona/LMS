var nomeUser; //nome de usuário
var currentGrupoId; //grupo ativo no momento

//Fecha o modal de usuário
function modalToggle() {
	document.querySelector(".modalOverlay").classList.toggle("hide");
}

//Pega o nome de usuário
function setName() {
	nomeUser = document.querySelector(".inputUsuario").value;
	document.querySelector("header h2").innerHTML = nomeUser;
	modalToggle();
	getGrupos();
}

//Pega a lista de grupos do server
function getGrupos() {
	axios({
		method: "GET",
		url: "https://server-json-lms.herokuapp.com/grupos/",
	})
		.then((response) => {
			document.querySelector(".grupos").innerHTML = ""; //limpa a aba de grupos
			let grupos = response.data;
			for (let grupo of grupos) {
				createGrupo(grupo.nome, grupo.id);
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

//Monta a lista de grupos no HTML
function createGrupo(nomeGrupo, id) {
	let article = document.createElement("article");
	article.classList.add("grupo");
	article.setAttribute("title", id);
	article.setAttribute("onclick", "getMensagens(" + id + ")");

	let img = document.createElement("img");
	img.src = "icon.svg";

	let b = document.createElement("b");
	b.innerHTML = nomeGrupo;

	let img2 = document.createElement("img");
	img2.src = "menu.svg";
	img2.setAttribute("onclick", "purgeGrupo(" + id + ")");

	article.appendChild(img);
	article.appendChild(b);
	article.appendChild(img2);

	document.querySelector(".grupos").appendChild(article);
}

//Posta um novo grupo no server
function postGrupo() {
	let i = document.querySelector(".inputAddGrupos").value;

	axios({
		method: "POST",
		url: "https://server-json-lms.herokuapp.com/grupos/",
		data: {
			nome: i,
		},
	})
		.then((response) => {
			getGrupos();
		})
		.catch((error) => {
			console.log(error);
		});
}

//Deleta um grupo do server
function purgeGrupo(id) {
	axios({
		method: "DELETE",
		url: "https://server-json-lms.herokuapp.com/grupos/" + id,
	})
		.then((response) => {
			console.log("Purged " + id + ".");
			getGrupos();
		})
		.catch((error) => {
			console.log(error);
		});
}

//Pega a lista de mensagens de um grupo do server
function getMensagens(id) {
	currentGrupoId = id;
	axios({
		method: "GET",
		url:
			"https://server-json-lms.herokuapp.com/grupos/" + id + "/mensagens",
	})
		.then((response) => {
			document.querySelector(".chat").innerHTML = "";
			let mensagens = response.data;
			for (let mensagem of mensagens) {
				createMensagens(mensagem.nome, mensagem.corpo, mensagem.id);
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

//Monta a lista de mensagens de um grupo no HTML
function createMensagens(nomeMsg, corpoMsg, id) {
	let article = document.createElement("article");
	article.classList.add("mensagem");
	article.setAttribute("title", id);

	let h3 = document.createElement("h3");
	h3.innerHTML = nomeMsg;

	let img = document.createElement("img");
	img.src = "menu.svg";
	img.setAttribute("onclick", "purgeMensagem(" + id + ")");

	let div = document.createElement("div");
	div.appendChild(h3);
	div.appendChild(img);

	let p = document.createElement("p");
	p.innerHTML = corpoMsg;

	article.appendChild(div);
	article.appendChild(p);

	document.querySelector(".chat").appendChild(article);
}

//Posta uma nova mensagem num grupo no server
function postMensagem() {
	let corpoMsg = document.querySelector(".inputAddChat").value;

	axios({
		method: "POST",
		url: "https://server-json-lms.herokuapp.com/mensagens/",
		data: {
			nome: nomeUser,
			corpo: corpoMsg,
			grupoId: currentGrupoId,
		},
	})
		.then((response) => {
			getMensagens(currentGrupoId);
		})
		.catch((error) => {
			console.log(error);
		});
}

//Deleta uma mensagem de um grupo do server
function purgeMensagem(id) {
	axios({
		method: "DELETE",
		url: "https://server-json-lms.herokuapp.com/mensagens/" + id,
	})
		.then((response) => {
			console.log("Purged " + id + ".");
			getMensagens(currentGrupoId);
		})
		.catch((error) => {
			console.log(error);
		});
}
