document.addEventListener("DOMContentLoaded", () => {
    let nivel = 1;
    var html = '';
    var container = document.getElementById('card-container');
    fetch('./animais.json')
        .then(resposta => resposta.json())
        .then(dados => {
            for (let i = 0; i < dados.cartas.length; i++) {
                var carta = dados.cartas[i];
                // html += `
                //     <div class="card">
                //         ${carta.imagem != null ? `<img src="../img/Leao.png">` : `<span class="animal-nome">${carta.nome}</span>`}
                //     </div>
                // `;
                html += `
                    <div class="card">
                        ${carta.imagem != null ? `<img src="${carta.imagem}">` : `<span class="animal-nome">${carta.nome}</span>`}
                    </div>
                `;
            }
            container.innerHTML = html;
        })
        .catch(erro => console.error('Erro ao ler o JSON:', erro));
});

