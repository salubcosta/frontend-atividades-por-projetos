/*
  --------------------------------------------------------------------------------------
  Lista de [Categorias, Projetos e Registros em memória] e URL Padrão do Backend
  --------------------------------------------------------------------------------------
*/
let lista = [];
const URL_API = "http://127.0.0.1:5000/";

/*
  --------------------------------------------------------------------------------------
  Função para navegar entre as seções
  --------------------------------------------------------------------------------------
*/
function navegar(id) {
    document.querySelectorAll('.btn-operacoes').forEach(s => s.classList.remove('ativo'));
    document.getElementById(id).classList.add('ativo');

    const mapa = { cat: "categorias", pro: "projetos", ati: "registros" };
    if (mapa[id]) carregarSecao(mapa[id]);
}

function carregarSecao(secao) {
    document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativa-secao'));
    document.getElementById("secao-" + secao).classList.add("ativa-secao");
    carregar_dados(secao, secao === "registros" ? null : undefined);
}

/*
  --------------------------------------------------------------------------------------
  Funções para carregar dados da API
  --------------------------------------------------------------------------------------
*/
const carregar_dados = async (target, key_projeto = undefined) => {
    limpar_feedback();

    if (key_projeto !== undefined && key_projeto !== null) {
        key_projeto = document.getElementById(key_projeto).value;
        if (!key_projeto) {
            feedback("Selecione um projeto.", "alerta");
            return;
        }
    }

    const url = key_projeto
        ? `${URL_API}${target}/projeto/${key_projeto}`
        : `${URL_API}${target}`;

    if (target === "registros" && key_projeto == null) {
        carregar_combo_projetos();
        return;
    }

    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            lista = data;
            if (target === "categorias") popular_categoria();
            else if (target === "projetos") popular_projetos();
            else if (target === "registros") popular_registros();
        })
        .catch(error => {
            feedback(`Servidor não está respondendo. Erro: ${error}`, "alerta", null, 10000);
        });
};

const carregar_combo_projetos = () => {
    const url = `${URL_API}projetos/`;
    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            lista = data;
            const elemento = document.getElementById("lista-registros");
            const projetos = document.getElementById("selecione-projeto");

            if (!lista || lista.projetos.length === 0) {
                elemento.hidden = false;
                elemento.innerHTML = "Não há nenhum projeto cadastrado.";
                projetos.hidden = true
            } else {
                projetos.innerHTML = `
                <div class="form-grupo">
                    <label class="form-label" for="select-projeto">Projetos</label>
                    <select class="form-input" id="select-projeto">
                        <option value="">Selecione...</option>
                        ${data.projetos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="td-acoes" style="margin-top:15px">
                    <button class="btn-salvar" onclick="carregar_dados('registros','select-projeto')">Ver registros</button>
                </div>
                `;
                projetos.hidden = false;
            }
        })
        .catch(error => {
            feedback(`Servidor não está respondendo. Erro: ${error}`, "alerta", null, 10000);
        });

    document.getElementById("lista-registros").hidden = true;
    document.getElementById("adicionar-editar-registro").hidden = true;
};

/*
  --------------------------------------------------------------------------------------
  Funções para popular tabelas
  --------------------------------------------------------------------------------------
*/
const popular_categoria = () => {
    const elemento = document.getElementById("lista-categorias");

    if (!lista || lista.categorias.length === 0) {
        elemento.innerHTML = "Nenhuma categoria encontrada.";
    } else {
        elemento.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${lista.categorias.map(categoria => `
                    <tr>
                        <td>${categoria.id}</td>
                        <td>${categoria.nome}</td>
                        <td>
                            <div class="td-acoes">
                                <button class="btn-editar" onclick="gerar_form_para_put('categorias', ${categoria.id})">Editar</button>
                                <button class="btn-excluir" onclick="excluir('categorias', this, ${categoria.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `;
    }
    document.getElementById("lista-categorias").hidden = false;
    document.getElementById("adicionar-editar-categoria").hidden = true;
};

const popular_projetos = () => {
    const elemento = document.getElementById("lista-projetos");

    if (!lista || lista.projetos.length === 0) {
        elemento.innerHTML = "Nenhum projeto encontrado.";
    } else {
        elemento.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${lista.projetos.map(projeto => `
                    <tr>
                        <td>${projeto.id}</td>
                        <td>${projeto.nome}</td>
                        <td>${projeto.categoria.nome}</td>
                        <td>
                            <div class="td-acoes">
                                <button class="btn-editar" onclick="gerar_form_para_put('projetos', ${projeto.id})">Editar</button>
                                <button class="btn-excluir" onclick="excluir('projetos', this, ${projeto.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
    }
    document.getElementById("lista-projetos").hidden = false;
    document.getElementById("adicionar-editar-projeto").hidden = true;
};

const popular_registros = () => {
    const elemento = document.getElementById("lista-registros");

    if (!lista || lista.registros.length === 0) {
        elemento.innerHTML = "<br>Nenhum registro encontrado para esse projeto.";
    } else {
        elemento.innerHTML = `
        <table style="margin-top:15px">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${lista.registros.map(registro => `
                    <tr>
                        <td>${formatar_data(registro.data)}</td>
                        <td>${registro.descricao}</td>
                        <td>
                            <div class="td-acoes">
                                <button class="btn-editar" onclick="gerar_form_para_put('registros', ${registro.id})">Editar</button>
                                <button class="btn-excluir" onclick="excluir('registros', this, ${registro.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
    }
    document.getElementById("lista-registros").hidden = false;
    document.getElementById("adicionar-editar-registro").hidden = true;
};

/*
  --------------------------------------------------------------------------------------
  Função para formatar data
  --------------------------------------------------------------------------------------
*/
const formatar_data = (str) => {
    if (!str) return '-';
    try {
        const data = new Date(str);
        data.setHours(data.getHours() + 3); // UTC → Brasília
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch { return str; }
};

/*
  --------------------------------------------------------------------------------------
  Função para renderizar formulários e listas
  --------------------------------------------------------------------------------------
*/
const renderizar = (target) => {
    limpar_feedback();
    switch (target) {
        case "form-categoria":
            gerar_form_para_post("categorias");
            document.getElementById("lista-categorias").hidden = true;
            document.getElementById("adicionar-editar-categoria").hidden = false;
            break;
        case "lista-categorias":
            carregar_dados("categorias");
            document.getElementById("lista-categorias").hidden = false;
            document.getElementById("adicionar-editar-categoria").hidden = true;
            break;
        case "form-projeto":
            gerar_form_para_post("projetos");
            document.getElementById("lista-projetos").hidden = true;
            document.getElementById("adicionar-editar-projeto").hidden = false;
            break;
        case "lista-projetos":
            carregar_dados("projetos");
            document.getElementById("lista-projetos").hidden = false;
            document.getElementById("adicionar-editar-projeto").hidden = true;
            break;
        case "lista-registros":
            carregar_dados("registros");
            document.getElementById("adicionar-editar-registro").hidden = true;
            break;
        case "form-registros":
            gerar_form_para_post("registros");
            document.getElementById("selecione-projeto").hidden = true;
            document.getElementById("lista-registros").hidden = true;
            document.getElementById("adicionar-editar-registro").hidden = false;
            break;
    }
};

/*
  --------------------------------------------------------------------------------------
  Função para gerar formulário de cadastro - POST
  --------------------------------------------------------------------------------------
*/
const gerar_form_para_post = (target) => {
    if (target === "categorias") {
        const elemento = document.getElementById("adicionar-editar-categoria");
        elemento.innerHTML = `
        <section class="form-adicionar-editar">
            <div class="form-grupo">
                <label class="form-label" for="nome_categoria">Nome</label>
                <input type="text" class="form-input" name="nome_categoria" id="nome_categoria" placeholder="Informe a categoria">
            </div>
            <div class="form-acoes">
                <button class="btn-cancelar" onclick="renderizar('lista-categorias')">Cancelar</button>
                <button class="btn-salvar" onclick="salvar_nova_categoria()">Salvar</button>
            </div>
        </section>
        `;
    }
    if (target === "projetos") {
        const url = `${URL_API}categorias`;
        fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const elemento = document.getElementById("adicionar-editar-projeto");
                elemento.innerHTML = `
                <section class="form-adicionar-editar">
                    <div class="form-grupo">
                        <label class="form-label" for="nome_projeto">Nome</label>
                        <input class="form-input" id="nome_projeto" placeholder="Ex: Curso de Python" />
                    </div>
                    <div class="form-grupo">
                        <label class="form-label" for="descricao">Descrição</label>
                        <textarea class="form-input" id="descricao" placeholder="Descreva o projeto..."></textarea>
                    </div>
                    <div class="form-grupo">
                        <label class="form-label" for="categoria">Categoria</label>
                        <select class="form-input" id="categoria">
                            <option value="">Selecione...</option>
                            ${data.categorias.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-acoes">
                        <button class="btn-cancelar" onclick="renderizar('lista-projetos')">Cancelar</button>
                        <button class="btn-salvar" onclick="salvar_novo_projeto()">Salvar</button>
                    </div>
                </section>
                `;
            })
            .catch(error => {
                feedback(`Backend não está respondendo... Erro: ${error}`, "alerta", null, 10000);
            });
    }
    if (target === "registros") {
        const url = `${URL_API}projetos/`;
        fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                lista = data;
                const elemento = document.getElementById("adicionar-editar-registro");
                elemento.innerHTML = `
                <section class="form-adicionar-editar">
                    <div class="form-grupo">
                        <label class="form-label" for="projeto">Projetos</label>
                        <select class="form-input" id="projeto">
                            <option value="">Selecione...</option>
                            ${data.projetos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-grupo">
                        <label class="form-label" for="descricao_registro">Descrição</label>
                        <textarea class="form-input" rows="3" name="descricao_registro" id="descricao_registro"></textarea>
                    </div>
                    <div class="form-acoes">
                        <button class="btn-cancelar" onclick="renderizar('lista-registros')">Cancelar</button>
                        <button class="btn-salvar" onclick="salvar_novo_registro()">Salvar</button>
                    </div>
                </section>
                `;
            })
            .catch(error => {
                feedback(`Backend não está respondendo... Erro: ${error}`, "alerta", null, 10000);
            });
    }
};

/*
  --------------------------------------------------------------------------------------
  Função para gerar formulário de edição - PUT
  --------------------------------------------------------------------------------------
*/
const gerar_form_para_put = (target, id) => {
    if (target === "categorias") {
        const cat = lista.categorias.find(c => c.id === id);
        const elemento = document.getElementById("adicionar-editar-categoria");
        elemento.innerHTML = `
        <section class="form-adicionar-editar">
            <div class="form-grupo">
                <label class="form-label" for="id_categoria">ID</label>
                <input type="text" class="form-input" name="id_categoria" id="id_categoria" readonly value="${cat.id}">
            </div>
            <div class="form-grupo">
                <label class="form-label" for="nome_categoria">Nome</label>
                <input type="text" class="form-input" name="nome_categoria" id="nome_categoria" value="${cat.nome}">
            </div>
            <div class="form-acoes">
                <button class="btn-cancelar" onclick="renderizar('lista-categorias')">Cancelar</button>
                <button class="btn-salvar" onclick="editar_categoria()">Salvar</button>
            </div>
        </section>
        `;
        document.getElementById("lista-categorias").hidden = true;
        document.getElementById("adicionar-editar-categoria").hidden = false;
    }
    if (target === "projetos") {
        const url = `${URL_API}categorias`;
        fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const pro = lista.projetos.find(p => p.id === id);
                const elemento = document.getElementById("adicionar-editar-projeto");
                elemento.innerHTML = `
                <section class="form-adicionar-editar">
                    <div class="form-grupo">
                        <label class="form-label" for="id_projeto">ID</label>
                        <input type="text" class="form-input" name="id_projeto" id="id_projeto" readonly value="${pro.id}">
                    </div>
                    <div class="form-grupo">
                        <label class="form-label" for="nome_projeto">Nome</label>
                        <input class="form-input" id="nome_projeto" value="${pro.nome}" />
                    </div>
                    <div class="form-grupo">
                        <label class="form-label" for="descricao">Descrição</label>
                        <textarea class="form-input" id="descricao">${pro.descricao}</textarea>
                    </div>
                    <div class="form-grupo">
                        <label class="form-label" for="categoria">Categoria</label>
                        <select class="form-input" id="categoria">
                            <option value="">Selecione...</option>
                            ${data.categorias.map(c => `<option value="${c.id}" ${c.id === pro.categoria.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-acoes">
                        <button class="btn-cancelar" onclick="renderizar('lista-projetos')">Cancelar</button>
                        <button class="btn-salvar" onclick="editar_projeto()">Salvar</button>
                    </div>
                </section>
                `;
            });
        document.getElementById("lista-projetos").hidden = true;
        document.getElementById("adicionar-editar-projeto").hidden = false;
    }
    if (target === "registros") {
        const projetos = document.getElementById("selecione-projeto");
        projetos.hidden = true;

        const registro = lista.registros.find(r => r.id === id);
        const elemento = document.getElementById("adicionar-editar-registro");
        elemento.innerHTML = `
        <section class="form-adicionar-editar">
            <div class="form-grupo">
                <label class="form-label" for="projeto">Projeto</label>
                <input type="text" class="form-input" name="projeto" id="projeto" readonly value="${registro.projeto.nome}">
            </div>
            <hr style="margin-top:15px;border: 1px solid #ccc;">
            <div class="form-grupo">
                <label class="form-label" for="id_registro">ID</label>
                <input type="text" class="form-input" name="id_registro" id="id_registro" readonly value="${registro.id}">
            </div>
            <div class="form-grupo">
                <label class="form-label" for="descricao_registro">Descrição</label>
                <textarea rows="3" class="form-input" name="descricao_registro" id="descricao_registro">${registro.descricao}</textarea>
            </div>
            <div class="form-acoes">
                <button class="btn-cancelar" onclick="renderizar('lista-registros')">Cancelar</button>
                <button class="btn-salvar" onclick="editar_registro()">Salvar</button>
            </div>
        </section>
        `;
        document.getElementById("lista-registros").hidden = true;
        document.getElementById("adicionar-editar-registro").hidden = false;
    }
};

/*
  --------------------------------------------------------------------------------------
  Funções para salvar e editar CATEGORIAS no BD via requisições POST e PUT
  --------------------------------------------------------------------------------------
*/
const salvar_nova_categoria = () => {
    const nome = document.getElementById("nome_categoria").value.trim();
    if (!nome) { feedback("* Informe o nome da categoria", "alerta"); return; }

    const url = `${URL_API}categorias/`;
    const form = new FormData();
    form.append("nome", nome);

    fetch(url, { method: 'POST', body: form })
        .then(response => response.json())
        .then(() => {
            feedback("Registrado.", "sucesso");
            setTimeout(() => navegar("cat"), 1500);
        })
        .catch(erro => feedback("Erro: " + erro, "alerta"));
};

const editar_categoria = () => {
    const id = document.getElementById("id_categoria").value.trim();
    const nome = document.getElementById("nome_categoria").value.trim();

    if (!nome) { feedback("* Informe o nome da categoria", "alerta"); return; }
    if (!id) { feedback("* ID da categoria é necessário", "alerta"); return; }

    const url = `${URL_API}categorias/${id}`;
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
    })
        .then(response => response.json())
        .then(() => feedback("Atualizado.", "sucesso", "recarregar_cat"))
        .catch(erro => feedback("Erro: " + erro, "alerta"));
};

/*
  --------------------------------------------------------------------------------------
  Funções para salvar e editar PROJETOS no BD via requisições POST e PUT
  --------------------------------------------------------------------------------------
*/
const salvar_novo_projeto = () => {
    const nome = document.getElementById("nome_projeto").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const categoria_id = document.getElementById("categoria").value.trim();

    if (!nome) { feedback("* Informe o nome do projeto", "alerta"); return; }
    if (!descricao) { feedback("* Informe a descrição", "alerta"); return; }
    if (!categoria_id) { feedback("* Selecione a categoria", "alerta"); return; }

    const url = `${URL_API}projetos/`;
    const form = new FormData();
    form.append("nome", nome);
    form.append("descricao", descricao);
    form.append("categoria_id", categoria_id);

    fetch(url, { method: 'POST', body: form })
        .then(response => response.json())
        .then(() => {
            feedback("Registrado.", "sucesso");
            setTimeout(() => navegar("pro"), 1500);
        })
        .catch(erro => feedback("Erro: " + erro, "alerta"));
};

const editar_projeto = () => {
    const id = document.getElementById("id_projeto").value.trim();
    const nome = document.getElementById("nome_projeto").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const categoria_id = parseInt(document.getElementById("categoria").value.trim(), 10);

    if (!nome) { feedback("* Informe o nome do projeto", "alerta"); return; }
    if (!descricao) { feedback("* Informe a descrição", "alerta"); return; }
    if (!categoria_id) { feedback("* Selecione a categoria", "alerta"); return; }

    const url = `${URL_API}projetos/${id}`;
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, categoria_id })
    })
        .then(response => response.json())
        .then(() => feedback("Atualizado.", "sucesso", "recarregar_pro"))
        .catch(erro => feedback("Erro: " + erro, "alerta"));
};


/*
  --------------------------------------------------------------------------------------
  Funções para salvar e editar REGISTRO/ATIVIDADES no BD via requisições POST e PUT
  --------------------------------------------------------------------------------------
*/
const salvar_novo_registro = () => {
    const projeto_id = document.getElementById("projeto").value.trim();
    const descricao = document.getElementById("descricao_registro").value.trim();

    if (!projeto_id) { feedback("* Selecione algum projeto", "alerta"); return; }
    if (!descricao) { feedback("* Informe a descrição", "alerta"); return; }

    const url = `${URL_API}registros/`;
    const form = new FormData();
    form.append("descricao", descricao);
    form.append("projeto_id", projeto_id);

    fetch(url, { method: 'POST', body: form })
        .then(response => response.json())
        .then(() => {
            feedback("Registrado.", "sucesso");
            setTimeout(() => navegar("ati"), 1500);
        })
        .catch(erro => feedback("Erro: " + erro, "alerta"));
};

const editar_registro = () => {
    const id = document.getElementById("id_registro").value.trim();
    const descricao = document.getElementById("descricao_registro").value.trim();

    if (!id) { feedback("* É necessário ter o ID da atividade/registro", "alerta", null, 4000); return; }
    if (!descricao) { feedback("* Informe a descrição", "alerta"); return; }

    const url = `${URL_API}registros/${id}`;
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, descricao })
    })
        .then(response => response.json())
        .then(() => feedback("Atualizado.", "sucesso", "recarregar_ati"))
        .catch(erro => feedback("Erro: " + erro, "alerta"));
};

/*
  --------------------------------------------------------------------------------------
  Funções genéricas p/ exclusão c/ confirmação - Será disparado requisição via DELETE
  --------------------------------------------------------------------------------------
*/
const excluir = (entidade, botao, id) => {
    // Reseta todos os botões de exclusão antes de iniciar nova confirmação
    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.innerText = "Excluir";
        btn.dataset.confirmando = "false";
    });
    document.querySelectorAll(".btn-cancelar-exclusao").forEach(btn => {
        btn.hidden = true;
    });

    botao.innerText = "Excluir❔";
    botao.dataset.confirmando = "true";

    let btn_cancelar = botao.parentElement.querySelector(".btn-cancelar-exclusao");
    if (!btn_cancelar) {
        btn_cancelar = document.createElement("button");
        btn_cancelar.innerText = "Cancelar";
        btn_cancelar.classList.add("btn-cancelar-exclusao");
        botao.parentElement.appendChild(btn_cancelar);
    } else {
        btn_cancelar.hidden = false;
    }

    btn_cancelar.onclick = () => cancelar_exclusao();

    botao.onclick = () => {
        if (botao.dataset.confirmando === "true") {
            deletar(entidade, id);
        } else {
            excluir(entidade, botao, id);
        }
    };
};

const deletar = (entidade, id) => {
    const mapa_recarregar = {
        categorias: "recarregar_cat",
        projetos: "recarregar_pro",
        registros: "recarregar_ati"
    };
    const url = `${URL_API}${entidade}/${id}`;
    const recarregar = mapa_recarregar[entidade];

    fetch(url, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.erro)
                feedback(data.erro, "alerta", recarregar, 4500);
            else
                feedback(`${data.mensagem}.`, "sucesso", recarregar);
        })
        .catch(erro => feedback(erro, "alerta", recarregar, 4500));
};

const cancelar_exclusao = (target = null) => {
    if (target) {
        navegar(target);
        return;
    }
    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.innerText = "Excluir";
        btn.dataset.confirmando = "false";
    });
    document.querySelectorAll(".btn-cancelar-exclusao").forEach(btn => btn.remove());
};

/*
  --------------------------------------------------------------------------------------
  Funções de feedback da interação do usuário com o frontend
  --------------------------------------------------------------------------------------
*/
const limpar_feedback = () => {
    document.getElementById("feedback").innerText = "";
};

const feedback = (msg, tipo, recarregar = null, tempo = null) => {
    const elemento = document.getElementById("feedback");
    if (!elemento) return;

    elemento.innerText = msg;
    elemento.style.color = tipo === "sucesso" ? "green" : "red";

    tempo = tempo || (tipo === "sucesso" ? 1500 : 2000);

    setTimeout(() => {
        elemento.innerText = "";
        if (recarregar === "recarregar_cat") navegar("cat");
        if (recarregar === "recarregar_pro") navegar("pro");
        if (recarregar === "recarregar_ati") navegar("ati");
    }, tempo);
};
