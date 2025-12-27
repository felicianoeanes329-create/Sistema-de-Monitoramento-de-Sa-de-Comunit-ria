function mostrarToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.style.opacity = "1", 100);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// Idioma
document.getElementById("idioma").addEventListener("change", (e) => {
  localStorage.setItem("idioma", e.target.value);
  mostrarToast("Idioma alterado para: " + e.target.value);
});

// Tema Claro
document.getElementById("temaClaro").addEventListener("click", () => {
  document.body.classList.remove("escuro");
  document.body.classList.add("claro");
  localStorage.setItem("tema", "claro");
  mostrarToast("Tema alterado para Claro");
});

// Tema Escuro
document.getElementById("temaEscuro").addEventListener("click", () => {
  document.body.classList.remove("claro");
  document.body.classList.add("escuro");
  localStorage.setItem("tema", "escuro");
  mostrarToast("Tema alterado para Escuro");
});

// Notificações
document.getElementById("notificacoes").addEventListener("change", (e) => {
  localStorage.setItem("notificacoes", e.target.checked);
  mostrarToast("Notificações " + (e.target.checked ? "ativadas" : "desativadas"));
});

// Limpar dados
document.getElementById("limparDados").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja apagar todos os registos?")) {
    localStorage.removeItem("registros");
    mostrarToast("Todos os registos foram apagados.");
  }
});

// --- Mostrar intervalo de tempo ---
document.getElementById("exportar").addEventListener("click", (e) => {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  if (registros.length === 0) {
    alert("Não existem registos para exportar.");
    return;
  }

  // Esconde o botão principal
  document.getElementById("exportar").style.display = "none";

  document.getElementById("intervaloExportar").style.display = "flex";

  e.stopPropagation(); // impede fechar imediatamente
});

// --- Ocultar ao clicar fora ---
document.addEventListener("click", (e) => {
  const intervalo = document.getElementById("intervaloExportar");
  const exportarBtn = document.getElementById("exportar");

  if (intervalo.style.display === "flex" && !intervalo.contains(e.target)) {
    intervalo.style.display = "none";
    exportarBtn.style.display = "inline-block"; // volta ao estado inicial
  }
});


document.addEventListener("click", (e) => {
  const intervalo = document.getElementById("intervaloExportar");
  const exportarBtn = document.getElementById("exportar");

  if (intervalo.style.display === "flex" && !intervalo.contains(e.target)) {
    intervalo.style.display = "none";
    exportarBtn.style.display = "inline-block"; // volta a mostrar o botão principal
  }
});



// --- Exportar JSON com intervalo ---
function exportarJSON() {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;

  if (!inicio || !fim) {
    alert("Selecione a data inicial e final.");
    return;
  }

  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const filtrados = registros.filter(r => {
    const data = new Date(r.data);
    return data >= new Date(inicio) && data <= new Date(fim);
  });

  if (filtrados.length === 0) {
    alert("Nenhum registo encontrado neste intervalo.");
    return;
  }

  const blob = new Blob([JSON.stringify(filtrados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `registos_${inicio}_a_${fim}.json`;
  a.click();

  URL.revokeObjectURL(url);
  mostrarToast("Exportação JSON concluída.");
}

// --- Exportar PDF com intervalo ---
function exportarPDF() {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;

  if (!inicio || !fim) {
    alert("Selecione a data inicial e final.");
    return;
  }

  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const filtrados = registros.filter(r => {
    const data = new Date(r.data);
    return data >= new Date(inicio) && data <= new Date(fim);
  });

  if (filtrados.length === 0) {
    alert("Nenhum registo encontrado neste intervalo.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(`Registos de ${inicio} a ${fim}`, 10, 10);

  let y = 20;
  filtrados.forEach((reg, i) => {
    doc.text(`${i + 1}. Nome: ${reg.paciente} | Data: ${reg.data} | Risco: ${reg.risco}`, 10, y);
    y += 10;
    doc.text(`Sintomas: ${reg.sintomas && reg.sintomas.length > 0 ? reg.sintomas.join(", ") : "Não tem sintomas"}`, 10, y);
    y += 10;
  });

  doc.save(`registos_${inicio}_a_${fim}.pdf`);
  mostrarToast("Exportação PDF concluída.");
}



// Importar registos 
document.getElementById("importar").addEventListener("click", () => {
  const ficheiro = document.getElementById("ficheiroImportar").files[0];
  if (!ficheiro) return alert("Selecione um ficheiro JSON para importar.");

  const reader = new FileReader();
  reader.onload = (e) => {
    let novosRegistros;
    try {
      novosRegistros = JSON.parse(e.target.result) || [];
    } catch {
      return alert("Erro ao ler o ficheiro JSON.");
    }

    const registrosExistentes = JSON.parse(localStorage.getItem("registros")) || [];

    // Normaliza datas para garantir ordenação correta
    const normalizarData = (str) => {
      if (!str) return new Date(0);
      if (str.includes("/")) {
        const [d, m, a] = str.split("/");
        return new Date(`${a}-${m}-${d}`);
      }
      return new Date(str.trim());
    };

    // Junta, ordena e salva
    const todos = [...registrosExistentes, ...novosRegistros]
      .sort((a, b) => normalizarData(b.data) - normalizarData(a.data));

    localStorage.setItem("registros", JSON.stringify(todos));
    mostrarToast("Importação concluída com sucesso! ");
    console.log("Ordem após sort:", todos.map(r => r.data));

    // Renderiza histórico
    const container = document.getElementById("historico");
    container.innerHTML = "";
    todos.forEach((reg) => {
      container.innerHTML += `
        <div class="card">
          <p><strong>Nome:</strong> ${reg.paciente}</p>
          <p><strong>Sexo:</strong> ${reg.sexo}</p>
          <p><strong>Idade:</strong> ${reg.idade}</p>
          <p><strong>Data:</strong> ${reg.data}</p>
          <p><strong>Temperatura:</strong> ${reg.temperatura}</p>
          <p><strong>Risco:</strong> ${reg.risco}</p>
          <p><strong>Sintomas:</strong> ${reg.sintomas?.length ? reg.sintomas.join(", ") : "Não tem sintomas"}</p>
          <p><strong>Observações:</strong> ${reg.observacoes || "-"}</p>
        </div>`;
    });
  };

  reader.readAsText(ficheiro);
});


// Carregar preferências salvas
const tema = localStorage.getItem("tema");
if (tema) {
  document.body.classList.remove("claro", "escuro");
  document.body.classList.add(tema);
} else {
  document.body.classList.add("claro"); 
}

const idioma = localStorage.getItem("idioma");
if (idioma) document.getElementById("idioma").value = idioma;

const notificacoes = localStorage.getItem("notificacoes") === "true";
document.getElementById("notificacoes").checked = notificacoes;

document.getElementById("btnSair").addEventListener("click", () => {
  if (confirm("Deseja realmente sair da conta?")) {
    localStorage.removeItem("auth");
    localStorage.removeItem("utilizadorLogado"); 
    location.href = "login.html";
  }
});





