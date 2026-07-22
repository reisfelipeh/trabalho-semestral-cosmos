//Variaveis
const NIVEIS = {
  1: { pares: 6, label: "Fácil" },
  2: { pares: 12, label: "Médio" },
  3: { pares: 18, label: "Difícil" }
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

const tabuleiro = document.getElementById("tabuleiro");
const mensagemVitoria = document.getElementById("mensagemVitoria");
const btnJogarNovamente = document.getElementById("btnJogarNovamente");
const botoesNivel = document.querySelectorAll(".btnNivel");

//Carregamento JSON
async function carregarCartas() {
  const resposta = await fetch("animais.json");
  if (!resposta.ok) throw new Error(`Erro ${resposta.status} ao carregar animais.json`);
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

//Modelo de Niveis
function Nivel(todasAsCartas, nivel) {
  const config = NIVEIS[nivel];

  const cartasImagem = todasAsCartas.filter(c => c.tipo === "imagem");
  const cartasTexto = todasAsCartas.filter(c => c.tipo === "texto");

  const idsUnicos = [...new Set(todasAsCartas.map(c => c.idAnimal))];
  const idsSelecionados = embaralhar(idsUnicos).slice(0, config.pares);

  const imagensSelecionadas = cartasImagem.filter(c => idsSelecionados.includes(c.idAnimal));
  const textosSelecionados = cartasTexto.filter(c => idsSelecionados.includes(c.idAnimal));

  const cartasDoNivel = embaralhar([...imagensSelecionadas, ...textosSelecionados]);
  return { cartasDoNivel, totalPares: config.pares };
}

//Verificaçao de Par
function verificarPar(cartaA, cartaB) {
  return cartaA.dataset.idanimal === cartaB.dataset.idanimal;
}

//Placar
function atualizarPlacar() {
  const el = document.getElementById("placar");
  if (el) el.textContent = `Pares: ${estado.paresEncontrados} / ${estado.totalPares}`;
}

//Cria o elemento de carta a partir dos dados vindos do JSON
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const createCard = (carta) => {
  const card = createElement("div", "card");
  const front = createElement("div", "face front");
  const back = createElement("div", "face back");

  card.dataset.idanimal = carta.idAnimal;
  card.dataset.idcarta = carta.idCarta;

  if (carta.tipo === "imagem") {
    back.style.backgroundImage = `url(${carta.imagem})`;
  } else {
    back.classList.add("textoCarta");
    back.textContent = carta.nome;
  }

  card.appendChild(front);
  card.appendChild(back);
  tabuleiro.appendChild(card);

  card.addEventListener("click", () => selecionarCarta(card));

  return card;
};

//Logica de seleçao e verificaçao de par
function selecionarCarta(card) {
  if (estado.bloqueado) return;
  if (card.classList.contains("revealCard")) return;
  if (card.classList.contains("encontrada")) return;
  if (estado.cartasSelecionadas.includes(card)) return;

  card.classList.add("revealCard");
  estado.cartasSelecionadas.push(card);

  if (estado.cartasSelecionadas.length === 2) {
    estado.bloqueado = true;
    const [cartaA, cartaB] = estado.cartasSelecionadas;

    if (verificarPar(cartaA, cartaB)) {
      cartaA.classList.add("encontrada");
      cartaB.classList.add("encontrada");
      estado.paresEncontrados++;
      atualizarPlacar();
      estado.cartasSelecionadas = [];
      estado.bloqueado = false;

      if (estado.paresEncontrados === estado.totalPares) {
        mostrarVitoria();
      }
    } else {
      setTimeout(() => {
        cartaA.classList.remove("revealCard");
        cartaB.classList.remove("revealCard");
        estado.cartasSelecionadas = [];
        estado.bloqueado = false;
      }, 900);
    }
  }
}

function mostrarVitoria() {
  mensagemVitoria.classList.remove("escondido");
}

//Inicia (ou reinicia) o jogo com o nivel escolhido
function iniciarJogo(nivel) {
  estado.nivelAtual = nivel;
  estado.cartasSelecionadas = [];
  estado.paresEncontrados = 0;
  estado.bloqueado = false;

  tabuleiro.innerHTML = "";
  mensagemVitoria.classList.add("escondido");

  const { cartasDoNivel, totalPares } = Nivel(todas_Cartas, nivel);
  estado.cartasNoTabuleiro = cartasDoNivel;
  estado.totalPares = totalPares;

  cartasDoNivel.forEach(createCard);
  atualizarPlacar();

  botoesNivel.forEach(btn => {
    btn.classList.toggle("ativo", Number(btn.dataset.nivel) === nivel);
  });
}

//Eventos dos botões de nível e "jogar novamente"
botoesNivel.forEach(btn => {
  btn.addEventListener("click", () => iniciarJogo(Number(btn.dataset.nivel)));
});

btnJogarNovamente.addEventListener("click", () => iniciarJogo(estado.nivelAtual));

//Inicializaçao
async function iniciar() {
  todas_Cartas = await carregarCartas();
  iniciarJogo(estado.nivelAtual);
}

iniciar();
