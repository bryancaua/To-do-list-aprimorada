const divForm = document.querySelector('.new-list-modal');
const botaoMostrarFormLista = document.querySelector('.botao__criar_lista');
const publicarLista = document.querySelector('.new__list_form');
const nomeLista = document.getElementById('list__name');
const ulListas = document.getElementById('ul__listas');
const mensagemVazia = document.querySelector('.mensagem__vazia');
const telaListas = document.querySelector('.tela__listas');
const telaToDos = document.querySelector('.tela__to_dos');
const tituloToDo = document.querySelector('.titulo__lista_todos');

let listas = JSON.parse (localStorage.getItem('listas')) || [];

let listaAtiva = null;

function atualizarLista() {
    localStorage.setItem('listas', JSON.stringify (listas));
}

function mostrarMensagemVazia() {
    mensagemVazia.classList.toggle('hidden', listas.length > 0);
}

function criarLista(lista) {
    const liListas = document.createElement('li');
    liListas.classList.add('lista__item');

    const botaoLixeira = document.createElement('button');
    botaoLixeira.classList.add('lista__botao_lixeira');
    const lixeira = document.createElement('img');
    lixeira.classList.add('lista__lixeira');
    lixeira.setAttribute('src', './assets/Trash.svg');

    lixeira.addEventListener('click', () => {
        listas = listas.filter(li => li.id !== lista.id);
        atualizarLista();
        liListas.remove(); 
        mostrarMensagemVazia();   
    })

    const liConteudo = document.createElement('button');
    liConteudo.classList.add('li__conteudo');
    const divLiConteudo = document.createElement('div');
    divLiConteudo.classList.add('div__li_conteudo');

    const paragrafoLista = document.createElement('p');
    paragrafoLista.textContent = lista.descricao;
    paragrafoLista.classList.add('p__nome_lista');
    const iconeSeta = document.createElement('img');
    iconeSeta.classList.add('icone__seta');
    iconeSeta.setAttribute('src', './assets/CaretRight.svg');

    botaoLixeira.append(lixeira);
    liListas.append(botaoLixeira);
    divLiConteudo.append(paragrafoLista);
    divLiConteudo.append(iconeSeta);
    liConteudo.append(divLiConteudo);
    liListas.append(liConteudo);

    iconeSeta.addEventListener('click', () => {
        console.log('clique no liConteudo disparou!');
        const listaClicada = listas.find(l => l.id === lista.id);
        console.log('listaClicada:', listaClicada);
        tituloToDo.textContent = lista.descricao;
        trocarTelaToDo(listaClicada);
    })

    return liListas;
}

botaoMostrarFormLista.addEventListener('click', () => {
    divForm.classList.toggle('hidden');
})

publicarLista.addEventListener('submit', (event) => {
    event.preventDefault();

    const lista = {
        id: Date.now(),
        descricao: nomeLista.value,
        todos: []
    }

    if(lista.descricao == "") {
        alert("Por favor insira um nome de lista válido");
    }
    else {
        listas.push(lista);
        renderizarLista(lista);
        atualizarLista();
        mostrarMensagemVazia(); 
    }
})

listas.forEach(renderizarLista);

function renderizarLista(lista) {
    const elementoLista = criarLista(lista);
     ulListas.append(elementoLista);
}

mostrarMensagemVazia();

// to-do

const setaVoltar = document.querySelector('.img__voltar');

setaVoltar.addEventListener('click', () => {
    telaListas.classList.remove('hidden');
    telaToDos.classList.add('hidden');
})

function trocarTelaToDo(lista) {
    listaAtiva = lista;

    telaListas.classList.add('hidden');
    telaToDos.classList.remove('hidden');

    console.log(listaAtiva);
}


