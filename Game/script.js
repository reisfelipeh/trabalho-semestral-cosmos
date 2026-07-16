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
/*OBS: Mudei tudo oq o professor fez pois nao lembrava o raciocio usado,
 ent apliquei meus conhecimentos adiquiridos atraves videos e IAs (Não fiz o codigo na IA, porem estudei por ela 
(é bom estuda por IA pois vc pode fazer ela explicar do jeito que vc quiser))*/

//SE QUISER, PODE IR FAZENDO A PARTE DA ESTILIZAÇÃO DAS CARTAS (O BAGULHO DE FAZER VIRAR BONITINHO)