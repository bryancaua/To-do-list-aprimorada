const divForm = document.querySelector('.new-list-modal');
const botaoMostrarFormLista = document.querySelector('.botao__criar_lista');
const publicarLista = document.querySelector('.new__list_form');
const nomeLista = document.getElementById('list__name');
const ulListas = document.getElementById('ul__listas');
const inputNomeToDo = document.getElementById('todo__name');
const mensagemVaziaListas = document.querySelector('.tela__listas .mensagem__vazia');
const mensagemVaziaTodos = document.querySelector('.tela__to_dos .mensagem__vazia');
const telaListas = document.querySelector('.tela__listas');
const telaToDos = document.querySelector('.tela__to_dos');
const tituloToDo = document.querySelector('.titulo__lista_todos');
const divFormTodo = document.querySelector('.new-todo-modal');
const botaoMostrarFormToDo = document.querySelector('.botao__criar_to_do');
const controleConcluidas = document.getElementById('footer__listas');
const SomRiscando = new Audio('./audio/Som de lápis.wav');
const ulListasConcluidas = document.getElementById('ul__listas_concluidas');
const btnVisualizarConcluidas = document.querySelector('.visualizar__listas_concluidas');
const spanVisualizarConcluidas = document.querySelector('.visualizar__listas_concluidas span');
const iconToggle = document.querySelector('.toggle__icon');

let listas = JSON.parse (localStorage.getItem('listas')) || [];

let listaAtiva = null;

function atualizarLista() {
    localStorage.setItem('listas', JSON.stringify (listas));
}

function mostrarMensagemVaziaListas() {
    const ativas = listas.filter(l => l.conclusao === false);
    mensagemVaziaListas.classList.toggle('hidden', ativas.length > 0);
}

function mostrarMensagemVazia(elemento, array) {
    elemento.classList.toggle('hidden', array.length > 0);
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
        verificarListasConcluidas(); 
        mostrarMensagemVaziaListas();  
    })

    const liConteudo = document.createElement('button');
    liConteudo.classList.add('li__conteudo');
    const divLiConteudo = document.createElement('div');
    divLiConteudo.classList.add('div__li_conteudo');

    const paragrafoLista = document.createElement('p');
    paragrafoLista.textContent = lista.descricao;
    paragrafoLista.classList.add('p__nome_lista');

    const checkCompletaLista = document.createElement('button');
    checkCompletaLista.textContent = '✔';
    checkCompletaLista.classList.add('btn__concluir_lista');

    checkCompletaLista.addEventListener('click', () => {
        lista.conclusao = !lista.conclusao;
        atualizarLista();
        liListas.classList.toggle('concluida', lista.conclusao);

        verificarListasConcluidas(); // mostra/oculta footer conforme existirem concluídas
        atualizarUlListas(); // re-renderiza as listas ativas na ul principal

        if (mostrandoConcluidas) {
            atualizarListasConcluidas(); // se a seção de concluídas estiver aberta, re-renderiza
        }
    })

    const iconeSeta = document.createElement('img');
    iconeSeta.classList.add('icone__seta');
    iconeSeta.setAttribute('src', './assets/CaretRight.svg');

    const divIconesCheckSeta = document.createElement('div')
    divIconesCheckSeta.classList.add('div__icones_lista');

    botaoLixeira.append(lixeira);
    liListas.append(botaoLixeira);
    divLiConteudo.append(paragrafoLista);
    divIconesCheckSeta.append(checkCompletaLista);
    divIconesCheckSeta.append(iconeSeta);
    divLiConteudo.append(divIconesCheckSeta);
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
        conclusao: false,
        todos: []
    }

    if(lista.descricao == "") {
        alert("Por favor insira um nome de lista válido");
    }
    else {
        nomeLista.value = "";
        listas.push(lista);
        renderizarLista(lista);
        atualizarLista();
        mostrarMensagemVaziaListas();
    }
})

listas.filter(l => l.conclusao === false).forEach(renderizarLista);
verificarListasConcluidas();

function renderizarLista(lista) {
    const elementoLista = criarLista(lista);
     ulListas.append(elementoLista);
}

function verificarListasConcluidas() {
    const existeConcluida = listas.some(l => l.conclusao === true);
    controleConcluidas.classList.toggle('hidden', !existeConcluida);
}

let mostrandoConcluidas = false;

btnVisualizarConcluidas.addEventListener('click', () => {
    mostrandoConcluidas = !mostrandoConcluidas;

    if (mostrandoConcluidas) {
        atualizarListasConcluidas();
        ulListasConcluidas.classList.remove('hidden');
        spanVisualizarConcluidas.textContent = 'Ocultar listas concluídas';
        iconToggle.style.transform = 'rotate(180deg)';
        mensagemVaziaListas.classList.add('hidden'); 
    } else {
        ulListasConcluidas.innerHTML = '';
        ulListasConcluidas.classList.add('hidden');
        spanVisualizarConcluidas.textContent = 'Visualizar listas concluídas';
        iconToggle.style.transform = 'rotate(0deg)'; 
        mostrarMensagemVaziaListas();
    }
});

function atualizarListasConcluidas() {
    ulListasConcluidas.innerHTML = '';

    const concluidas = listas.filter(l => l.conclusao === true);

    // se não houver mais nenhuma, fecha a seção automaticamente
    if (concluidas.length === 0) {
        mostrandoConcluidas = false;
        ulListasConcluidas.classList.add('hidden');
        spanVisualizarConcluidas.textContent = 'Visualizar listas concluídas';
        iconToggle.style.transform = 'rotate(0deg)';
        return;
    }

    concluidas.forEach(lista => {
        const elementoLista = criarLista(lista);
        ulListasConcluidas.append(elementoLista);
    });
}

function atualizarUlListas () {
    ulListas.innerHTML = '';
    listas
        .filter(l => l.conclusao === false)
        .forEach(l => ulListas.append(criarLista(l)));

    mostrarMensagemVaziaListas();
}

mostrarMensagemVaziaListas();

// TO-DO

const setaVoltar = document.querySelector('.img__voltar');
const publicarToDo = document.querySelector('.new__todo_form');
const nomeToDo = document.getElementById('todo__name');
const ulToDo = document.querySelector('.ul__to_do');
const prioridadeToDo = document.getElementById('todo__prioridade');
const footer = document.querySelector('.footer');


let todos = JSON.parse (localStorage.getItem('to-do')) || [];

function criarToDo(todo) {
    
    const liToDo = document.createElement('li');
    liToDo.classList.add('li__to_do');
    liToDo.classList.add(`todo--${todo.prioridade}`);

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
        if (checkboxToDo.checked) {
            SomRiscando.play();
        }
        paragrafoToDo.style.textDecoration = checkboxToDo.checked ? 'line-through' : 'none';
        atualizarLista();
    });

    const paragrafoToDo = document.createElement('p');
    paragrafoToDo.classList.add('p__li_to_do');
    paragrafoToDo.textContent = todo.descricao;
    if (todo.concluido) {
        paragrafoToDo.style.textDecoration = 'line-through';
    }

    // botão de 3 pontos
    const btnOpcoes = document.createElement('button');
    btnOpcoes.classList.add('btn__opcoes_todo');
    btnOpcoes.textContent = '⋮';

    // dropdown com as opções
    const menuOpcoes = document.createElement('div');
    menuOpcoes.classList.add('menu__opcoes_todo', 'hidden');

    // botão altera prioridade
    const btnAlterarPrioridade = document.createElement('button');
    btnAlterarPrioridade.classList.add('menu__opcao');
    btnAlterarPrioridade.textContent = 'Alterar prioridade';
    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', './assets/edit.svg');
    editIcon.classList.add('edit__icon');
    btnAlterarPrioridade.append(editIcon);
    // sub menu de prioridade
    const menuPrioridade = document.createElement('div');
    menuPrioridade.classList.add('menu__prioridade_todo', 'hidden');

    const prioridades = ['alta', 'normal', 'baixa'];

    prioridades.forEach(p => {
        const btnAlterarPrioridade = document.createElement('button');
        btnAlterarPrioridade.classList.add('menu__opcao', `opcao--${p}`);
        btnAlterarPrioridade.textContent = p.charAt(0).toUpperCase() + p.slice(1);

        btnAlterarPrioridade.addEventListener('click', () => {
            todo.prioridade = p;
            atualizarLista();
            menuPrioridade.classList.add('hidden');
            menuOpcoes.classList.add('hidden');
            renderizarToDoOrdenado();
        });

        menuPrioridade.appendChild(btnAlterarPrioridade);
    });

    btnAlterarPrioridade.addEventListener('click', () => {
        menuPrioridade.classList.toggle('hidden');
    });

    // botão cria sub to-do
    const btnSubTodo = document.createElement('button');
    btnSubTodo.classList.add('menu__opcao');
    btnSubTodo.textContent = 'Criar sub to-do';
    const plusIcon = document.createElement('img');
    plusIcon.setAttribute('src', './assets/plus-circle.svg');
    plusIcon.classList.add('plus-circle__icon');
    btnSubTodo.append(plusIcon);

    menuOpcoes.append(btnAlterarPrioridade, btnSubTodo);

    // abre/fecha o menu
    btnOpcoes.addEventListener('click', (e) => {
        e.stopPropagation(); // evita que o clique propague e feche imediatamente
        menuOpcoes.classList.toggle('hidden');
    });

    // fecha o menu ao clicar fora
    document.addEventListener('click', () => {
        menuOpcoes.classList.add('hidden');
    });

    const imgLixeiraToDo = document.createElement('img');
    imgLixeiraToDo.classList.add('to__do_lixeira');
    imgLixeiraToDo.setAttribute('src',  './assets/Trash.svg');
    imgLixeiraToDo.addEventListener('click', () => {
       listaAtiva.todos = listaAtiva.todos.filter(td => td.id !== todo.id);
        atualizarLista();
        mostrarMensagemVazia(mensagemVaziaTodos, listaAtiva.todos);
        liToDo.remove();
    })
    
    divLiToDo.appendChild(checkboxToDo);
    divLiToDo.appendChild(paragrafoToDo);
    botaoToDo.appendChild(divLiToDo);
    botaoToDo.appendChild(imgLixeiraToDo);
    botaoToDo.appendChild(btnOpcoes);
    liToDo.appendChild(botaoToDo);
    liToDo.appendChild(menuOpcoes);
    liToDo.appendChild(menuPrioridade);

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
        concluido: false,
        prioridade: prioridadeToDo.value,
        ordem: listaAtiva.todos.length
    }

    if(todo.descricao == "") {
        alert("Por favor insira um nome de lista válido");
    } else {
        inputNomeToDo.value = "";
        listaAtiva.todos.push(todo);
        atualizarLista();
        renderizarToDoOrdenado();
        mostrarMensagemVazia(mensagemVaziaTodos, listaAtiva.todos);
    }
})

botaoMostrarFormToDo.addEventListener('click', () => {
    divFormTodo.classList.toggle('hidden');
})

setaVoltar.addEventListener('click', () => {
    telaListas.classList.remove('hidden');
    telaToDos.classList.add('hidden');
    verificarListasConcluidas();
})

function renderizarToDoOrdenado () {
    ulToDo.innerHTML = "";

    listaAtiva.todos
        .sort((a, b) => {
            const pesoPrioridade = { alta: 3, normal: 2, baixa: 1 };
            return pesoPrioridade[b.prioridade] - pesoPrioridade[a.prioridade];
        })
    .forEach(renderizarToDo);
}

function trocarTelaToDo(lista) {
    listaAtiva = lista;

    footer.classList.add('hidden');
    telaListas.classList.add('hidden');
    telaToDos.classList.remove('hidden');
    ulListasConcluidas.classList.add('hidden');
    
    tituloToDo.textContent = lista.descricao;
    renderizarToDoOrdenado();

    mostrarMensagemVazia(mensagemVaziaTodos, listaAtiva.todos);
}

Sortable.create(ulToDo, {
    Animation: 150,
    onEnd: (evento) => {
        const { oldIndex, newIndex} = evento;

        const [itemMovido] = listaAtiva.todos.splice(oldIndex, 1); //Uso do colchetes no itemMovido apenas para desestruturação.. Remove 1 to-do da posição oldIndex de listaAtiva.todos e guarda esse to-do na variável itemMovido.
        listaAtiva.todos.splice(newIndex, 0, itemMovido);

        const posicaoDestino = newIndex;
        const todoNoDestino = listaAtiva.todos[posicaoDestino + 1] || listaAtiva.todos[posicaoDestino - 1];

        if (todoNoDestino && itemMovido.prioridade !== todoNoDestino.prioridade) {
            listaAtiva.todos.splice(newIndex, 1);
            const posicaoCorreta = listaAtiva.todos.findIndex(t => t.prioridade !== itemMovido.prioridade);
            listaAtiva.todos.splice(posicaoCorreta, 0, itemMovido);
        }

        atualizarLista();
        renderizarToDoOrdenado();
    }
});










