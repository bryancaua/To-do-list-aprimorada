const divForm = document.querySelector('.new-list-modal');
const botaoMostrarFormLista = document.querySelector('.botao__criar_lista');
const publicarLista = document.querySelector('.new__list_form');
const nomeLista = document.getElementById('list__name');
const ulListas = document.getElementById('ul__listas');
const mensagemVazia = document.querySelector('.mensagem__vazia');
const telaListas = document.querySelector('.tela__listas');
const telaToDos = document.querySelector('.tela__to_dos');
const tituloToDo = document.querySelector('.titulo__lista_todos');
const divFormTodo = document.querySelector('.new-todo-modal');
const botaoMostrarFormToDo = document.querySelector('.botao__criar_to_do');

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
        const listaClicada = listas.find(l => l.id === lista.id);
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
const publicarToDo = document.querySelector('.new__todo_form');
const nomeToDo = document.getElementById('todo__name');
const ulToDo = document.querySelector('.ul__to_do');


let todos = JSON.parse (localStorage.getItem('to-do')) || [];

function criarToDo(todo) {
    
    const liToDo = document.createElement('li');
    liToDo.classList.add('li__to_do');

    const botaoToDo = document.createElement('button');
    botaoToDo.classList.add('botao__to_do');

    const divLiToDo = document.createElement('div');
    divLiToDo.classList.add('div__li_to_do');

    const checkboxToDo = document.createElement('input');
    checkboxToDo.classList.add('checkbox__to_do');
    checkboxToDo.type = 'checkbox';
    checkboxToDo.checked = todo.concluido;
    checkboxToDo.addEventListener('change', () => {
        todo.concluido = checkboxToDo.checked;
        paragrafoToDo.style.textDecoration = checkboxToDo.checked ? 'line-through' : 'none';
        atualizarLista();
    });

    const paragrafoToDo = document.createElement('p');
    paragrafoToDo.classList.add('p__li_to_do');
    paragrafoToDo.textContent = todo.descricao;
    if (todo.concluido) {
        paragrafoToDo.style.textDecoration = 'line-through';
    }

    const imgLixeiraToDo = document.createElement('img');
    imgLixeiraToDo.classList.add('to__do_lixeira');
    imgLixeiraToDo.setAttribute('src',  './assets/Trash.svg');
    

        divLiToDo.appendChild(checkboxToDo);
        divLiToDo.appendChild(paragrafoToDo);
        botaoToDo.appendChild(divLiToDo);
        botaoToDo.appendChild(imgLixeiraToDo);
        liToDo.appendChild(botaoToDo);

        return liToDo;
}

function renderizarToDo(todo) {
    const elementoToDo = criarToDo(todo);
    ulToDo.append(elementoToDo);
}

publicarToDo.addEventListener('submit', (event) => {
    event.preventDefault();

    const todo = {
        id: Date.now(),
        descricao: nomeToDo.value,
        concluido: false 
    }

    if(todo.descricao == "") {
        alert("Por favor insira um nome de lista válido");
    } else {
        listaAtiva.todos.push(todo);
        renderizarToDo(todo);
        atualizarLista();
        mostrarMensagemVazia();
    }
})

botaoMostrarFormToDo.addEventListener('click', () => {
    divFormTodo.classList.toggle('hidden');
})

setaVoltar.addEventListener('click', () => {
    telaListas.classList.remove('hidden');
    telaToDos.classList.add('hidden');
})

function trocarTelaToDo(lista) {
    listaAtiva = lista;

    telaListas.classList.add('hidden');
    telaToDos.classList.remove('hidden');
    tituloToDo.textContent = lista.descricao;

    ulToDo.innerHTML = "";
    listaAtiva.todos.forEach(renderizarToDo);
}

mostrarMensagemVazia();


