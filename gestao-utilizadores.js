document.addEventListener("DOMContentLoaded", carregarUtilizadores);

const utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];
const utilizadorLogado = JSON.parse(localStorage.getItem("utilizadorLogado"));

// 🚫 Bloqueio: só administradores podem acessar
if (utilizadores.length === 0) {
  alert("Nenhum utilizador encontrado. Crie o primeiro Administrador.");
} else if (!utilizadorLogado || utilizadorLogado.perfil !== "Administrador") {
  alert("Acesso negado! Apenas Administradores podem gerir utilizadores.");
  window.location.href = "index.html";
}

// Cadastro
document.getElementById("formUtilizador").addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const perfil = document.getElementById("perfil").value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  let utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];
  const editandoEmail = localStorage.getItem("editandoEmail");

  if (!editandoEmail) {
    // Novo cadastro
    if (utilizadores.some(u => u.email === email)) {
      alert("Este email já está cadastrado!");
      return;
    }
    utilizadores.push({ nome, email, senha, perfil });
    alert("Utilizador cadastrado com sucesso!");
  } else {
    alert("Está em modo edição. Use o botão Editar para atualizar.");
    return;
  }

  localStorage.setItem("utilizadores", JSON.stringify(utilizadores));
  carregarUtilizadores();
  e.target.reset();
});

function carregarUtilizadores() {
  const lista = document.getElementById("listaUtilizadores");
  lista.innerHTML = "";

  const utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];

  utilizadores.forEach((u, index) => {
    const row = document.createElement("tr");

    // Coluna de ações: só mostra Remover (exceto admin@1)
    row.innerHTML = `
      <td>${u.nome}</td>
      <td>${u.email}</td>
      <td>${u.perfil}</td>
      <td>
        ${u.email !== "admin@1" ? `<button onclick="confirmarRemocao(${index})">Remover</button>` : ""}
      </td>
    `;

    // Linha inteira clicável para edição
    row.style.cursor = "pointer";
    row.addEventListener("click", () => preencherFormulario(index));

    lista.appendChild(row);
  });
}

// Preenche formulário ao clicar na linha
function preencherFormulario(index) {
  const utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];
  const user = utilizadores[index];

  if (!user) return;

  document.getElementById("nome").value = user.nome;
  document.getElementById("email").value = user.email;
  document.getElementById("senha").value = user.senha;
  document.getElementById("confirmarSenha").value = user.senha;
  document.getElementById("perfil").value = user.perfil;

  localStorage.setItem("editandoEmail", user.email);

  // Só aqui aparecem os botões Editar e Cancelar
  document.getElementById("btnEditar").style.display = "inline-block";
  document.getElementById("btnCancelar").style.display = "inline-block";
}

document.getElementById("btnEditar").addEventListener("click", () => {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const perfil = document.getElementById("perfil").value;

  let utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];
  const editandoEmail = localStorage.getItem("editandoEmail");

  utilizadores = utilizadores.map(u => {
    if (u.email === editandoEmail) {
      return { nome, email, senha, perfil };
    }
    return u;
  });

  localStorage.setItem("utilizadores", JSON.stringify(utilizadores));
  localStorage.removeItem("editandoEmail");

  alert("Utilizador atualizado com sucesso!");
  carregarUtilizadores();

  // Reset formulário e botões
  document.getElementById("formUtilizador").reset();
  document.getElementById("btnEditar").style.display = "none";
  document.getElementById("btnCancelar").style.display = "none";
});

// Botão cancelar
document.getElementById("btnCancelar").addEventListener("click", () => {
  document.getElementById("formUtilizador").reset();
  localStorage.removeItem("editandoEmail");

  // Esconde Editar e Cancelar
  document.getElementById("btnEditar").style.display = "none";
  document.getElementById("btnCancelar").style.display = "none";
});

// Confirmação antes de remover
function confirmarRemocao(index) {
  const utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];
  const user = utilizadores[index];

  // 🚫 Bloqueio: não permitir remover admin@1
  if (user.email === "admin@1") {
    alert("O utilizador padrão 'admin@1' não pode ser removido.");
    return;
  }

  const confirmar = confirm(`Tem certeza que deseja remover o utilizador "${user.nome}"?`);
  if (confirmar) {
    removerUtilizador(index);
  }
}

function removerUtilizador(index) {
  const utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];
  utilizadores.splice(index, 1);
  localStorage.setItem("utilizadores", JSON.stringify(utilizadores));
  carregarUtilizadores();
}




