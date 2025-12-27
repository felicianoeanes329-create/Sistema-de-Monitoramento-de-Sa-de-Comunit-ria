document.addEventListener("DOMContentLoaded", () => {
  // Verificação de login
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  if (!auth.logged) {
    location.href = "login.html"; 
    return; 
  }

  const lista = document.getElementById("lista-alertas");
  const contador = document.getElementById("contador");
  const registros = JSON.parse(localStorage.getItem("registros")) || [];

  const alertas = registros.filter(r => r.risco === "Vermelho" || r.risco === "Amarelo");

  if (alertas.length === 0) {
    lista.innerHTML = `<div class="card"><p>Nenhum alerta no momento.</p></div>`;
    contador.textContent = "Total: 0 | Urgente 🔴: 0 | Moderado 🟠: 0";
    return;
  }

  // Contador de casos
  const urgentes = alertas.filter(r => r.risco === "Vermelho").length;
  const moderados = alertas.filter(r => r.risco === "Amarelo").length;
  contador.textContent = `Total: ${alertas.length} | Urgente 🔴: ${urgentes} | Moderado 🟠: ${moderados}`;

  // Exibir cada alerta (último no topo)
  alertas.forEach((r) => {
    const card = document.createElement("div");
    card.className = "card";

    // Definir prioridade com base no risco
    let prioridade = "";
    let simbolo = "";
    if (r.risco === "Amarelo") {
      prioridade = "Moderado";
      simbolo = "🟠";
    }
    if (r.risco === "Vermelho") {
      prioridade = "Urgente";
      simbolo = "🔴";
    }

    card.innerHTML = `
      <div class="registro">
        <div><label>Nome</label><span>${r.paciente}</span></div>
        <div><label>Sexo</label><span>${r.sexo}</span></div>
        <div><label>Idade</label><span>${r.idade}</span></div>
        <div><label>Data</label><span>${r.data}</span></div>
      </div>
      <div class="registro">
        <div><label>Temperatura</label><span>${r.temperatura} °C</span></div>
        <div><label>Prioridade</label><span class="risco ${r.risco.toLowerCase()}">${prioridade} ${simbolo}</span></div>
      </div>
      <div class="sintomas"><label>Sintomas:</label><span>${r.sintomas.join(", ")}</span></div>
      <div class="observacoes"><label>Observações:</label><span>${r.observacoes || "-"}</span></div>
    `;
    lista.prepend(card);
  });
});
