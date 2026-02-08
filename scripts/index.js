const botaoCriarFormLista = document.getElementById('botao__criar_lista');
const ulListas = document.getElementById('ul__listas');
const divForm = document.querySelector('.new-list-modal');
const publicarLista = document.querySelector('.new__list_form');
const inputFormLista = document.getElementById('list__name');

let listas = JSON.parse (localStorage.getItem('listas')) || [];

function atualizarLista() {
    localStorage.setItem('listas', JSON.stringify (listas));
}

function criarLista(lista) {
    const liListas = document.createElement('li');
    liListas.classList.add('lista__item');

    const botaoLixeira = document.createElement('button');
    botaoLixeira.classList.add('lista__botao_lixeira');
    const lixeira = document.createElement('img');
    lixeira.classList.add('lista__lixeira');
    lixeira.setAttribute('src', './assets/Trash.svg');

    botaoLixeira.addEventListener('click', () => {
        listas = listas.filter(tarefa => tarefa.id !== lista.id);
        atualizarLista();
        liListas.remove();
    })

    const liConteudo = document.createElement('button');
    liConteudo.classList.add('li__conteudo');
    const divLiConteudo = document.createElement('div');
    divLiConteudo.classList.add('div__li_conteudo');

    const paragrafoLista = document.createElement('p');
    paragrafoLista.textContent = lista.descricao;
    paragrafoLista.classList.add('p__nome_lista');

    const iconeSeta = document.createElement('img')
    iconeSeta.setAttribute('src', './assets/CaretRight.svg');

    botaoLixeira.append(lixeira);
    liListas.append(botaoLixeira);
    divLiConteudo.append(paragrafoLista);
    divLiConteudo.append(iconeSeta);
    liConteudo.append(divLiConteudo);
    liListas.append(liConteudo);

    return liListas;
}

botaoCriarFormLista.addEventListener('click', () => {
    divForm.classList.toggle('hidden');
})

publicarLista.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const lista = {
        id: Date.now(),
        descricao: inputFormLista.value
    }
    listas.push(lista);
    renderizarLista(lista);
    atualizarLista();
})

listas.forEach(renderizarLista);

function renderizarLista (lista) {
    const elementoLista = criarLista(lista);
    ulListas.append(elementoLista);
}

/*
    divListas.appendChild(inputListas);
    divListas.appendChild(imgSeta);
    botaoListas.appendChild(divListas);

    li.appendChild(botaoLixeiraListas);
    li.appendChild(botaoListas);
    ulListas.appendChild(li);
*/


