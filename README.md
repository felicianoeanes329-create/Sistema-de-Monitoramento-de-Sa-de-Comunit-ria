#  Sistema de Monitoramento de Saúde Comunitária

##  Descrição
O **Sistema de Monitoramento de Saúde Comunitária** é uma aplicação web voltada para apoiar comunidades na **gestão e acompanhamento da saúde coletiva**.  
Permite que utilizadores registrem sintomas, acompanhem históricos, recebam alertas e que administradores gerenciem utilizadores e relatórios.  
O sistema possui suporte a **tema claro/escuro**, autenticação e controle de permissões.

##  Funcionalidades
- **Autenticação segura**: apenas utilizadores logados têm acesso ao menu principal. 

- 👥 **Gestão de permissões**:
  - Usuários comuns → acesso limitado.  
  - Administradores → acesso total.  

- **Menus principais**:
  - Registrar sintomas  
  - Ver histórico geral  
  - Alertas  
  - Relatórios  
  - Gestão de Utilizadores (apenas administradores)  
  - Configurações  
  - Ajuda  
  
- **Tema claro/escuro**:
  - No modo escuro, a imagem de fundo é escurecida para melhor contraste com texto branco.  
- **Armazenamento local**:
  - Dados de login e preferências de tema são guardados em `localStorage`.

---

## Tecnologias utilizadas
- **HTML5** → estrutura das páginas.  
- **CSS3** → estilos, tema claro/escuro, contraste visual.  
- **JavaScript (ES6)** → autenticação, permissões, lógica de interface.  
- **LocalStorage** → persistência de dados no navegador.

---

##  Estrutura geral do trabalho:
📂 sistema-saude-comunitaria/
│
├── 📄 index.html               # Menu principal (home após login)
├── 📄 login.html               # Página de login
├── 📄 registrar-sintomas.html  # Registro de sintomas
├── 📄 historico-sintomas.html  # Histórico geral de sintomas
├── 📄 alertas.html             # Página de alertas
├── 📄 relatorio.html           # Relatórios de saúde
├── 📄 gestao-utilizadores.html # Gestão de utilizadores (apenas admins)
├── 📄 configuracoes.html       # Configurações do sistema (tema, etc.)
├── 📄 ajuda.html               # Página de ajuda/documentação
│
├── 📄 style.css                # Estilos unificados (tema claro/escuro)
├── 📄 README.md                # Documentação do projeto
│
├── 📂 assets/                  # Recursos estáticos
│   ├── 📄 imagem.png           # Imagem de fundo padrão
│   ├── 📄 imagem-dark.png      # Versão escura da imagem (opcional)
│   └── 📂 icons/               # Ícones e gráficos adicionais
│
├── 📂 js/                      # Scripts JS separados (opcional)
│   ├── 📄 auth.js              # Lógica de autenticação
│   ├── 📄 tema.js              # Alternância de tema claro/escuro
│   └── 📄 permissoes.js        # Regras de permissões
│
└── 📂 docs/                    # Documentação extra
    └── 📄 manual-usuario.md    # Manual de uso do sistema


---

##  Requisitos
- Navegador moderno (Chrome, Edge, Firefox).  
- Suporte a **LocalStorage** habilitado.  
- Arquivo `imagem.png` como fundo padrão.  


Segurança
O sistema valida login antes de permitir acesso ao menu principal.

Permissões são controladas por perfil (Usuario ou Administrador).

Dados sensíveis não são expostos no front-end.

Contribuições
Contribuições são bem-vindas!

## Autores:

Feliciano C. Eánes Ecunda

Francisco Cuvalela

José Chissiquili Fizeram

Pedro Etande Fizeram

## Divisão de Responsabilidades

##  Parte 1 — Estrutura e Interface (HTML + CSS)
Responsável: Feliciano C. Eánes Ecunda

Criação das páginas principais (index.html, login.html, etc.).

Definição do layout e menus.

Implementação do tema claro/escuro.

Estilos centralizados em style.css.

## Parte 2 — Lógica de Autenticação e Permissões (JavaScript)
Responsável: Francisco Cuvalela

Verificação de login via localStorage.

Redirecionamento automático para login.html se não autenticado.

Controle de permissões:

Usuário → menus restritos.

Administrador → acesso total.

## Parte 3 — Funcionalidades de Monitoramento
Responsável: José Chissiquili Fizeram

Registro de sintomas.

Histórico geral de sintomas.

Alertas de saúde.

Relatórios.

## Parte 4 — Gestão e Configurações
Responsável: Pedro Etande Fizeram

Gestão de utilizadores (apenas administradores).

Configurações do sistema (tema, preferências).

Página de ajuda/documentação.

## Parte 5 — Documentação e Organização
Responsável: Todos os membros

Estrutura do projeto organizada em pastas (assets, js, docs).
Criação do README.md para explicar o sistema.
Manual do utilizador em docs/manual-usuario.md.


## Login inicial

- O sistema verifica automaticamente se o utilizador está autenticado ao carregar qualquer página protegida (como o histórico).
- A informação de login é guardada no `localStorage` na chave **auth**.
- Estrutura esperada:
  ```json

## Usuário padrão:
email: admin@1
Senha: 1234
  
