//Variaveis
const NIVEIS = {
  1: { pares: 6, label: "Fácil"},
  2: { pares: 12, label: "Médio"},
  3: { pares: 18, label: "difícil"}
};

const estado = {
  nivelAtual:        1,
  cartasNoTabuleiro: [],
  cartasSelecionadas: [],
  paresEncontrados:  0,
  totalPares:        0,
  bloqueado:         false,
};

let todas_Cartas = [];

//Carregamento JSON 
async function carregarCartas() {
  const resposta = await fetch("animais.json");
  if (!resposta.ok) throw new Error(`Erro ${resposta.status} ao carregar cartas.json`);
  const dados = await resposta.json();
  return dados.cartas;
}

//Embaralhamento
function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
//Modelo de Nives
function Nivel(todasAsCartas, niveis) {
  const config = NIVEIS[niveis];
  
  const cartasImagem = todasAsCartas.filter(c => c.tipo === "imagem");
  const cartasTexto = todasAsCartas.filter(c => c.tipo === "texto");

  const idsUnicos = [...new Set(todasAsCartas.map(c => c.idAnimal))];
  const idsSelecionados = embaralhar(idsUnicos).slice(0, config.pares);

  const imagensSelecionadas = cartasImagem.filter(c => idsSelecionados.includes(c.idAnimal));
  const textosSelecionados = cartasTexto.filter(c => idsSelecionados.includes(c.idAnimal));

  const cartasDoNivel = embaralhar([... imagensSelecionadas, ... textosSelecionados]);
  return { cartasDoNivel, totalPares: config.pares}
}

//Verificaçao de Par
function verificarPar(cartaA, cartaB) {
  if (cartaA.idAnimal === cartaB.idAnimal) return true;
  else return false 
}
/*OBS: Mudei tudo oq o professor fez pois nao lembrava o raciocio usado,
 ent apliquei meus conhecimentos adiquiridos atraves videos e IAs (Não fiz o codigo na IA, porem estudei por ela 
(é bom estuda por IA pois vc pode fazer ela explicar do jeito que vc quiser))*/

//SE QUISER, PODE IR FAZENDO A PARTE DA ESTILIZAÇÃO DAS CARTAS (O BAGULHO DE FAZER VIRAR BONITINHO)

//cria o card
const cardContainer = document.querySelector('.cardContainer');

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}


const createCard = () =>{
  
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  card.appendChild(front);
  card.appendChild(back);
  cardContainer.appendChild(card);

  card.addEventListener('click', revealCard);

  return card;
}


//adiciona o revealcard no card
const revealCard = (event) => {
    event.currentTarget.classList.add("revealCard");
}

/* o card que ta sendo criado já está com uma imagem fixa e não buscando as informações do json, portanto tem que fazer ele buscar as
informaçoes do json para pegar a imagem correta e o texto correto esse card que eu criei foi somente para testar se estava virando corretamente */

 createCard()
