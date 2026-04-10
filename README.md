# Frontend - Atividades por Projetos

Frontend para gerenciamento de atividades organizadas por projetos e categorias. Consome a [API REST do backend](https://github.com/salubcosta/backend-atividades-por-projetos) via `fetch` e não depende de nenhum framework ou bundler — apenas HTML, CSS e JavaScript puro.

Este projeto está sendo desenvolvido como um MVP da Sprint 1 da Pós-graduação em Desenvolvimento Full Stack da PUC-Rio. 

---

## Tecnologias

- **HTML5** — estrutura semântica da aplicação
- **CSS3** — estilização customizada (sem frameworks)
- **JavaScript (ES6+)** — lógica de interação, chamadas à API e manipulação do DOM
- **Google Fonts** — fontes Poppins e Roboto

---

## Estrutura do Projeto

```
.
├── index.html              # Ponto de entrada da aplicação
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos globais
│   ├── js/
│   │   └── scripts.js      # Toda a lógica da aplicação
│   └── images/
│       └── favicon.ico
```

---

## Como Executar

### Pré-requisito

O backend precisa estar rodando em `http://127.0.0.1:5000/`. Consulte o README do backend para instruções de execução.

No entanto, é possível renderizar alguns recursos, basta abrir o arquivo index.html no browser.

### Opção 1 — Abrir direto no navegador

Basta abrir o arquivo `index.html` no navegador. Como a aplicação usa apenas arquivos estáticos, não é necessário servidor.

### Opção 2 — Servidor local simples (OPCIONAL)

```bash
# Python 3
python -m http.server 3000
```

Acesse `http://localhost:3000` no navegador.

---

## Funcionalidades

A interface é dividida em três seções, navegáveis pelos botões no topo:

### Categorias
- Listar todas as categorias
- Adicionar nova categoria
- Editar categoria existente
- Excluir categoria (com confirmação de dois cliques)

### Projetos
- Listar todos os projetos com sua categoria
- Adicionar novo projeto (vinculado a uma categoria)
- Editar projeto existente
- Excluir projeto (com confirmação de dois cliques)

> Ao excluir um projeto, todos os seus registros (atividades) são removidos automaticamente (comportamento definido no backend).

### Atividades (Registros)
- Selecionar um projeto para visualizar seus registros
- Adicionar novo registro de atividade
- Editar descrição de um registro
- Excluir registro (com confirmação de dois cliques)

---

## Integração com o Backend

A URL base da API está definida no topo de `scripts.js`:

```javascript
const URL_API = "http://127.0.0.1:5000/";
```

Para apontar para outro ambiente, basta alterar essa constante.

| Recurso    | Endpoints utilizados                                    |
|------------|---------------------------------------------------------|
| Categorias | `GET /categorias/`, `POST /categorias/`, `PUT /categorias/{id}`, `DELETE /categorias/{id}` |
| Projetos   | `GET /projetos/`, `POST /projetos/`, `PUT /projetos/{id}`, `DELETE /projetos/{id}` |
| Registros  | `GET /registros/projeto/{id}`, `POST /registros/`, `PUT /registros/{id}`, `DELETE /registros/{id}` |

---

## Organização do JavaScript (`scripts.js`)

O arquivo está organizado nas seguintes responsabilidades:

| Bloco | Funções |
|---|---|
| **Navegação** | `navegar()`, `carregarSecao()` |
| **Carregamento de dados** | `carregar_dados()`, `carregar_combo_projetos()` |
| **Renderização de listas** | `popular_categoria()`, `popular_projetos()`, `popular_registros()` |
| **Formulários (POST)** | `gerar_form_para_post()`, `salvar_nova_categoria()`, `salvar_novo_projeto()`, `salvar_novo_registro()` |
| **Formulários (PUT)** | `gerar_form_para_put()`, `editar_categoria()`, `editar_projeto()`, `editar_registro()` |
| **Exclusão** | `excluir()`, `deletar()`, `cancelar_exclusao()` |
| **Feedback** | `feedback()`, `limpar_feedback()` |
| **Utilitários** | `formatar_data()` |

---

## Decisões de Implementação

- **SPA manual** — a navegação entre seções é feita via CSS (`display: none / block`) sem recarregar a página.
- **Exclusão com dupla confirmação** — ao clicar em "Excluir" pela primeira vez, o botão muda para "Excluir❔" e aguarda a segunda confirmação, evitando exclusões acidentais.
- **Dados em memória** — a variável `lista` armazena o último conjunto de dados carregado da API, usado para preencher formulários de edição sem nova requisição.
- **Ajuste de fuso horário** — as datas retornadas pela API em UTC são ajustadas em +3h para exibição no horário de Brasília.
