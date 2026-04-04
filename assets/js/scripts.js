/*
  --------------------------------------------------------------------------------------
  Lista de [Categorias, Projetos e Registros em memória] e URL Padrão do Backend
  --------------------------------------------------------------------------------------
*/
let lista = [];
const URL_API =  "http://127.0.0.1:5000/";

/*
  --------------------------------------------------------------------------------------
  Função para navegar entre as seções
  --------------------------------------------------------------------------------------
*/
function navegar(id){
    document.querySelectorAll('.btn-operacoes').forEach(s => s.classList.remove('ativo'))
    document.getElementById(id).classList.add('ativo')
    
    if (id == "cat") carregarSecao("categorias");
    else if (id == "pro") carregarSecao("projetos");
    else if (id == "ati") carregarSecao("registros");
}

function carregarSecao(secao){
    document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativa-secao'))
    document.getElementById("secao-"+secao).classList.add("ativa-secao")
    if (secao == "categorias") carregar_dados(secao);
    else if (secao == "projetos") carregar_dados(secao);
    else if (secao == "registros") carregar_dados(secao, null);
}

/*
  --------------------------------------------------------------------------------------
  Função para carregar lista categorias e projetos /categorias [GET]
  --------------------------------------------------------------------------------------
*/

const carregar_dados = async (target, key_projeto = null) => {
    limpar_feedback()
    if(key_projeto){
        key_projeto = document.getElementById(key_projeto).value;
        if(!key_projeto){
            feedback("Selecione um projeto.", "alerta");
            return;
        }
    }
    let url = (key_projeto == null) ? `${URL_API}${target}`: `${URL_API}${target}/projeto/${key_projeto}`;
    
    if(target == "registros" && key_projeto == null){
        // Carregar combo com os projetos
        carregar_combo_projetos()
    } else {
        // Carregamento de dados
        fetch(url, {method: 'get'})
        .then((response) => response.json())
        .then((data) =>{
            lista = data
            if (target == "categorias") popular_categoria();
            else if (target == "projetos") popular_projetos();
            else if (target == "registros") popular_registros();
        }).catch(error => {
            feedback(`Servidor não está respondendo. Erro: ${error}`,"alerta", null, 10000)
        })
    }
}

const carregar_combo_projetos =  () => {
    let url = `${URL_API}projetos/`
    fetch(url, {method: 'get'})
        .then((response) => response.json())
        .then((data) =>{
            lista = data

            if(!lista || lista.projetos.length == 0){
                elemento = document.getElementById("lista-registros");
                elemento.hidden = false;
                elemento.innerHTML = "Não há nenhum projeto cadastro.";
                return;
            }

            projetos = document.getElementById("selecione-projeto")
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
            `     
            projetos.hidden = false;    
        }).catch(error => {
            feedback(`Backend não está respondendo... Erro: ${error}`,"alerta", null, 10000)
        });

        document.getElementById("lista-registros").hidden = true;
        document.getElementById("adicionar-editar-registro").hidden = true;
}

const popular_categoria = () => {
    elemento = document.getElementById("lista-categorias")

    if(!lista || lista.categorias.length == 0){
        elemento.innerHTML = "Nenhuma categoria encontrada."
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
                ${lista.categorias.map(categoria =>`
                    <tr>
                        <td>${categoria.id}</td>
                        <td>${categoria.nome}</td>
                        <td>
                            <div class="td-acoes">
                                <button class="btn-editar" onclick="gerar_form_para_put('categorias', ${categoria.id})">Editar</button>
                                <button class="btn-excluir" onclick="excluir_categoria(this, ${categoria.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `
    }
    document.getElementById("lista-categorias").hidden = false
    document.getElementById("adicionar-editar-categoria").hidden = true
}

const popular_projetos = () => {
    elemento = document.getElementById("lista-projetos")

    if(!lista || lista.projetos.length == 0){
        elemento.innerHTML = "Nenhuma projeto encontrado."
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
                ${lista.projetos.map(projeto =>`
                    <tr>
                        <td>${projeto.id}</td>
                        <td>${projeto.nome}</td>
                        <td>${projeto.categoria.nome}</td>
                        <td>
                            <div class="td-acoes">
                                <button class="btn-editar" onclick="gerar_form_para_put('projetos', ${projeto.id})">Editar</button>
                                <button class="btn-excluir" onclick="excluir_projeto(this, ${projeto.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`
    }
    document.getElementById("lista-projetos").hidden = false
    document.getElementById("adicionar-editar-projeto").hidden = true
}

const popular_registros = () => {
    elemento = document.getElementById("lista-registros")
    
    if(!lista || lista.registros.length == 0){
        elemento.innerHTML = "<br>Nenhuma registro encontrado para esse projeto."
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
                ${lista.registros.map(registro =>`
                    <tr>
                        <td>${formatar_data(registro.data)}</td>
                        <td>${registro.descricao}</td>
                        <td>
                            <div class="td-acoes">
                                <button class="btn-editar" onclick="gerar_form_para_put('registros', ${registro.id})">Editar</button>
                                <button class="btn-excluir" onclick="excluir_registro(this, ${registro.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`
    }
    document.getElementById("lista-registros").hidden = false;
    document.getElementById("adicionar-editar-registro").hidden = true;

}

const formatar_data = (str) => {
    if(!str) return '-';
    try {
        const data = new Date(str);
        data.setHours(data.getHours() + 3); // UTC - Brasília
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch { return str; }
}

const renderizar = (target) => {
    limpar_feedback()
    if (target == "form-categoria") {
        gerar_form_para_post("categorias")
        document.getElementById("lista-categorias").hidden = true
        document.getElementById("adicionar-editar-categoria").hidden = false
    }
    if (target == "lista-categorias") {
        carregar_dados("categorias")
        document.getElementById("lista-categorias").hidden = false
        document.getElementById("adicionar-editar-categoria").hidden = true
    }
    if (target == "form-projeto") {
        gerar_form_para_post("projetos")
        document.getElementById("lista-projetos").hidden = true
        document.getElementById("adicionar-editar-projeto").hidden = false
    }
    if (target == "lista-projetos") {
        carregar_dados("projetos")
        document.getElementById("lista-projetos").hidden = false
        document.getElementById("adicionar-editar-projeto").hidden = true
    }
    if (target == "lista-registros") {
        carregar_dados("registros")
        document.getElementById("adicionar-editar-registro").hidden = true
    }
    if (target == "form-registros") {
        gerar_form_para_post("registros");
        document.getElementById("selecione-projeto").hidden = true
        document.getElementById("lista-registros").hidden = true
        document.getElementById("adicionar-editar-registro").hidden = false
    }
}

const gerar_form_para_post = (target) => {

    if (target == "categorias"){
        elemento = document.getElementById("adicionar-editar-categoria")
        elemento.innerHTML = 
        `
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
        `
    }
    if (target == "projetos"){
        let url = `${URL_API}categorias`;
        fetch(url, {method: 'get'})
        .then((response) => response.json())
        .then((data) =>{
            console.log(data.categorias)
        
            elemento = document.getElementById("adicionar-editar-projeto")
            elemento.innerHTML = 
            `
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
            `
        })
    }
    if (target == "registros") {
        let url = `${URL_API}projetos/`
       
        fetch(url, {method: 'get'})
        .then((response) => response.json())
        .then((data) =>{
            lista = data
            console.log(data)
            elemento = document.getElementById("adicionar-editar-registro")
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
                    <label class="form-label" for="descricao_registro">Descricao</label>
                    <textarea class="form-input" rows="3" name="descricao_registro" id="descricao_registro"></textarea>
                </div>
                <div class="form-acoes">
                    <button class="btn-cancelar" onclick="renderizar('lista-registros')">Cancelar</button>
                    <button class="btn-salvar" onclick="salvar_novo_registro()">Salvar</button>
                </div>
                
            </section>
            `;      
                
        }).catch(error => {
            feedback(`Backend não está respondendo... Erro: ${error}`,"alerta", null, 10000)
        });
        
        
    }
}
const gerar_form_para_put = (target, id) => {

    if (target == "categorias"){
        const cat = lista.categorias.find(c => c.id == id)
        elemento = document.getElementById("adicionar-editar-categoria")
        elemento.innerHTML = 
        `
        <section class="form-adicionar-editar">
            <div class="form-grupo">
                <label class="form-label" for="id_categoria">ID</label>
                <input type="text" class="form-input" name="id_categoria" id="id_categoria" readonly value="${cat.id}"">
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
        `
        document.getElementById("lista-categorias").hidden = true
        document.getElementById("adicionar-editar-categoria").hidden = false
    }
    if (target == "projetos"){
        _lista_categorias = []
        let url = `${URL_API}categorias`;
        fetch(url, {method: 'get'})
        .then((response) => response.json())
        .then((data) =>{
            const pro = lista.projetos.find(p => p.id == id)

            elemento = document.getElementById("adicionar-editar-projeto")
            elemento.innerHTML = 
            `
            <section class="form-adicionar-editar">
                <div class="form-grupo">
                    <label class="form-label" for="id_projeto">ID</label>
                    <input type="text" class="form-input" name="id_projeto" id="id_projeto" readonly value="${pro.id}"">
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
            `
        })
        
        document.getElementById("lista-projetos").hidden = true
        document.getElementById("adicionar-editar-projeto").hidden = false
    }
    if (target == "registros"){
        
        projetos = document.getElementById("selecione-projeto");
        
        projetos.hidden = true;

        const registro = lista.registros.find(r => r.id == id)

        elemento = document.getElementById("adicionar-editar-registro")
        elemento.innerHTML = 
        `
        <section class="form-adicionar-editar">
        <div class="form-grupo">
            <label class="form-label" for="projeto">Projeto</label>
            <input type="text" class="form-input" name="projeto" id="projeto" readonly value="${registro.projeto.nome}"">
        </div>
        <hr style="margin-top:15px;border: 1px solid #ccc;">
        <div class="form-grupo">
            <label class="form-label" for="id_registro">ID</label>
            <input type="text" class="form-input" name="id_registro" id="id_registro" readonly value="${registro.id}"">
        </div>
        <div class="form-grupo">
            <label class="form-label" for="descricao_registro">Descricao</label>
            <textarea rows="3" class="form-input" name="descricao_registro" id="descricao_registro">${registro.descricao}</textarea>
        </div>
        <div class="form-acoes">
            <button class="btn-cancelar" onclick="renderizar('lista-registros')">Cancelar</button>
            <button class="btn-salvar" onclick="editar_registro()">Salvar</button>
        </div>
            
        </section>
        `
        document.getElementById("lista-registros").hidden = true
        document.getElementById("adicionar-editar-registro").hidden = false
    }
}

const salvar_nova_categoria = () => {
    const nome = document.getElementById("nome_categoria").value.trim()
    console.log("categoria:"+nome)
    if(!nome || nome.length == 0) { feedback("* Informe nome da categoria", "alerta"); return;}

    let url = URL_API+"categorias/";
    const form = new FormData();
    form.append("nome", nome);

    fetch(url, {
        method: 'post',
        body: form
    })
    .then((response) => response.json())
    .then((data) =>{
        feedback("Registrado.", "sucesso")
        setTimeout(() => {
            navegar("cat")
        }, 1500);
    }).catch((erro)=> {
        feedback("Erro: " + erro, "alerta")
    });
}

const editar_categoria = () => {
    const id = document.getElementById("id_categoria").value.trim()
    const nome = document.getElementById("nome_categoria").value.trim()
    
    if(!nome || nome.length == 0) { feedback("* Informe nome da categoria", "alerta"); return;}
    if(!id) { feedback("* Id a categoria é neessário", "alerta"); return;}

    let url = URL_API+"categorias/"+id;
    method = 'put'
    const opts = { method, headers: {'Content-Type': 'application/json'}}
    
    opts.body = JSON.stringify({nome})

    fetch(url, opts)
    .then((response) => response.json())
    .then((data) =>{
        feedback("Atualizado.", "sucesso", "recarregar_cat")
    }).catch((erro)=> {
        feedback("Erro: " + erro, "alerta")
    });
};

const limpar_feedback = () => {
    document.getElementById("feedback").innerText = ""
}

const feedback = (msg, tipo, recarregar = null, tempo = null) => {
    const elemento = document.getElementById("feedback");

    if (!elemento) return;

    elemento.innerText = msg;
    elemento.style.color = tipo === "sucesso" ? "green" : "red";

    tempo = tempo || (tipo === "sucesso" ? 1500 : 2000);
    
    setTimeout(() => {
        elemento.innerText = "";

        if (recarregar === "recarregar_cat") {
            navegar("cat");
        }
        if (recarregar === "recarregar_pro") {
            navegar("pro");
        }
        if (recarregar === "recarregar_ati") {
            navegar("ati");
        }
    }, tempo);
};

const excluir_categoria = (botao, id) => {
    
    elementos_excluir = document.getElementsByClassName("btn-excluir")
    for(let i = 0; i < elementos_excluir.length; i++){
        elementos_excluir[i].innerText = "Excluir"
        elementos_excluir[i].dataset.confirmando = "false";
    }
    elementos_cancelar = document.getElementsByClassName("btn-cancelar-exclusao")
    for(let i = 0; i < elementos_cancelar.length; i++){
        elementos_cancelar[i].hidden = true
    }
    
    botao.innerText = "Excluir❔"
    botao.dataset.confirmando = "true";

    let btn_cancelar = botao.parentElement.querySelector(".btn-cancelar-exclusao");

    if(!btn_cancelar){
        btn_cancelar = document.createElement("button");
        btn_cancelar.innerText = "Cancelar";
        btn_cancelar.classList.add("btn-cancelar-exclusao");

        botao.parentElement.appendChild(btn_cancelar)
    } else {
        btn_cancelar.hidden = false
    }

    btn_cancelar.onclick = () => cancelar_exclusao()

    botao.onclick = () => {
        if (botao.dataset.confirmando === "true") {
            deletar_categoria(id);
        } else {
            excluir_categoria(botao, id);
        }
    }
    
}

const cancelar_exclusao = (target = null) => {
    if (target) {
        navegar(target); 
        return;
    }

    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.innerText = "Excluir";
        btn.dataset.confirmando = "false";
    });

    document.querySelectorAll(".btn-cancelar-exclusao").forEach(btn => {
        btn.remove();
    });
}

const deletar_categoria = (id) => {
    let url = URL_API+"categorias/" + id;
    
    fetch(url, {
        method: 'delete',
    })
    .then((response) => response.json())
    .then((data) =>{
        console.log(data);
        if(data.erro)
            feedback(data.erro, "alerta", "recarregar_cat", 4500);
        else
            feedback(`${data.mensagem}.`, "sucesso", "recarregar_cat");
    }).catch((erro)=> {
        feedback(erro, "alerta", "recarregar_cat", 4500);
    });
}

// PROJETO #####################

const salvar_novo_projeto = () => {
    const nome = document.getElementById("nome_projeto").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const categoria_id = document.getElementById("categoria").value.trim();
    console.log("nome:"+nome);
    console.log("descricao:"+descricao);
    console.log("categoria_id:"+categoria_id);
    
    if(!nome || nome.length == 0) { feedback("* Informe nome do projeto", "alerta"); return;}
    if(!descricao || descricao.length == 0) { feedback("* Informe a descrição", "alerta"); return;}
    if(!categoria_id || categoria_id.length == 0) { feedback("* Selecione a categoria", "alerta"); return;}
    

    let url = URL_API+"projetos/";
    const form = new FormData();
    form.append("nome", nome);
    form.append("descricao", descricao);
    form.append("categoria_id", categoria_id);

    fetch(url, {
        method: 'post',
        body: form
    })
    .then((response) => response.json())
    .then((data) =>{
        feedback("Registrado.", "sucesso")
        setTimeout(() => {
            navegar("pro")
        }, 1500);
    }).catch((erro)=> {
        feedback("Erro: " + erro, "alerta")
    });
};

const editar_projeto = () => {
    const id = document.getElementById("id_projeto").value.trim();
    const nome = document.getElementById("nome_projeto").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const categoria_id = document.getElementById("categoria").value.trim();
    console.log("nome:"+nome);
    console.log("descricao:"+descricao);
    console.log("categoria_id:"+categoria_id);
    
    if(!nome || nome.length == 0) { feedback("* Informe nome do projeto", "alerta"); return;}
    if(!descricao || descricao.length == 0) { feedback("* Informe a descrição", "alerta"); return;}
    if(!categoria_id || categoria_id.length == 0) { feedback("* Selecione a categoria", "alerta"); return;}
    
    let url = URL_API+"projetos/"+id;
    method = 'put'
    const opts = { method, headers: {'Content-Type': 'application/json'}}
    
    opts.body = JSON.stringify({nome, descricao, categoria_id})

    fetch(url, opts)
    .then((response) => response.json())
    .then((data) =>{
        feedback("Atualizado.", "sucesso", "recarregar_pro")
    }).catch((erro)=> {
        feedback("Erro: " + erro, "alerta")
    });
};


const excluir_projeto = (botao, id) => {
    
    elementos_excluir = document.getElementsByClassName("btn-excluir")
    for(let i = 0; i < elementos_excluir.length; i++){
        elementos_excluir[i].innerText = "Excluir"
        elementos_excluir[i].dataset.confirmando = "false";
    }
    elementos_cancelar = document.getElementsByClassName("btn-cancelar-exclusao")
    for(let i = 0; i < elementos_cancelar.length; i++){
        elementos_cancelar[i].hidden = true
    }
    
    botao.innerText = "Excluir❔"
    botao.dataset.confirmando = "true";

    let btn_cancelar = botao.parentElement.querySelector(".btn-cancelar-exclusao");

    if(!btn_cancelar){
        btn_cancelar = document.createElement("button");
        btn_cancelar.innerText = "Cancelar";
        btn_cancelar.classList.add("btn-cancelar-exclusao");

        botao.parentElement.appendChild(btn_cancelar)
    } else {
        btn_cancelar.hidden = false
    }

    btn_cancelar.onclick = () => cancelar_exclusao()

    botao.onclick = () => {
        if (botao.dataset.confirmando === "true") {
            deletar_projeto(id)
        } else {
            excluir_projeto(botao, id)
        }
    }
};

const deletar_projeto = (id) => {
    let url = URL_API+"projetos/" + id;
    
    fetch(url, {
        method: 'delete',
    })
    .then((response) => response.json())
    .then((data) =>{
        if(data.erro)
            feedback(data.erro, "alerta")
        else
            feedback(`${data.mensagem}.`, "sucesso")
        setTimeout(() => {
            navegar("pro")
        }, 1500);
    }).catch((erro)=> {
    });
};

// REGISTRO / ATIVIDADES ############

const salvar_novo_registro = () => {
    const projeto_id = document.getElementById("projeto").value.trim();
    const descricao = document.getElementById("descricao_registro").value.trim();
    
    console.log("projeto_id: "+projeto_id);
    console.log("descricao_registro: "+descricao);
    
    if(!projeto_id || projeto_id.length == 0) { feedback("* Selecione algum projeto", "alerta"); return;}
    if(!descricao || descricao.length == 0) { feedback("* Informe a descrição", "alerta"); return;}
    
    let url = URL_API+"registros/";
    const form = new FormData();
    form.append("descricao", descricao);
    form.append("projeto_id", projeto_id);

    fetch(url, {
        method: 'post',
        body: form
    })
    .then((response) => response.json())
    .then((data) =>{
        feedback("Registrado.", "sucesso")
        setTimeout(() => {
            navegar("ati")
        }, 1500);
    }).catch((erro)=> {
        feedback("Erro: " + erro, "alerta")
    });
};

const editar_registro = () => {
    const id = document.getElementById("id_registro").value.trim();
    const descricao = document.getElementById("descricao_registro").value.trim();
    console.log("id:"+id);
    console.log("descricao_registro:"+descricao);
        
    if(!id || id.length == 0) { feedback("* É necessário ter o ID da atividade/registro", "alerta", null, 4000); return;}
    if(!descricao || descricao.length == 0) { feedback("* Informe a descrição", "alerta"); return;}
        
    let url = URL_API+"registros/"+id;
    method = 'put'
    const opts = { method, headers: {'Content-Type': 'application/json'}}
    
    opts.body = JSON.stringify({id, descricao})

    fetch(url, opts)
    .then((response) => response.json())
    .then((data) =>{
        feedback("Atualizado.", "sucesso", "recarregar_ati")
    }).catch((erro)=> {
        feedback("Erro: " + erro, "alerta")
    });
};

const excluir_registro= (botao, id) => {
    
    elementos_excluir = document.getElementsByClassName("btn-excluir")
    for(let i = 0; i < elementos_excluir.length; i++){
        elementos_excluir[i].innerText = "Excluir"
        elementos_excluir[i].dataset.confirmando = "false";
    }
    elementos_cancelar = document.getElementsByClassName("btn-cancelar-exclusao")
    for(let i = 0; i < elementos_cancelar.length; i++){
        elementos_cancelar[i].hidden = true
    }
    
    botao.innerText = "Excluir❔"
    botao.dataset.confirmando = "true";

    let btn_cancelar = botao.parentElement.querySelector(".btn-cancelar-exclusao");

    if(!btn_cancelar){
        btn_cancelar = document.createElement("button");
        btn_cancelar.innerText = "Cancelar";
        btn_cancelar.classList.add("btn-cancelar-exclusao");

        botao.parentElement.appendChild(btn_cancelar)
    } else {
        btn_cancelar.hidden = false
    }

    btn_cancelar.onclick = () => cancelar_exclusao()

    botao.onclick = () => {
        if (botao.dataset.confirmando === "true") {
            deletar_registro(id)
        } else {
            excluir_registro(botao, id)
        }
    }
};

const deletar_registro = (id) => {
    let url = URL_API+"registros/" + id;
    
    fetch(url, {
        method: 'delete',
    })
    .then((response) => response.json())
    .then((data) =>{
        if(data.erro)
            feedback(data.erro, "alerta", null, 4500);
        else
            feedback(`${data.mensagem}.`, "sucesso", "recarregar_ati", 4500);
    }).catch((erro)=> {
        feedback(erro, "alerta", null, 4500)
    });
};