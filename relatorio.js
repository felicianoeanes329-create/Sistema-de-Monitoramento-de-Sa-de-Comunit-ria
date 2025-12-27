function gerarRelatorio() {
  const estatisticas = document.getElementById("estatisticas");
  let registros = JSON.parse(localStorage.getItem("registros")) || [];

// Preenche datas iniciais e finais
if (registros.length > 0) {
  const datas = registros.map(r => new Date(r.data)).sort((a, b) => a - b);
  const primeira = datas[0].toISOString().split("T")[0];
  const ultima = datas[datas.length - 1].toISOString().split("T")[0];

  const campoInicio = document.getElementById("dataInicio");
  const campoFim = document.getElementById("dataFim");

  if (!campoInicio.value) campoInicio.value = primeira;
  if (!campoFim.value) campoFim.value = ultima;
}


  // Filtro por intervalo de datas
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;

  if (inicio || fim) {
    registros = registros.filter(r => {
      const dataReg = new Date(r.data);
      const dataInicio = inicio ? new Date(inicio) : null;
      const dataFim = fim ? new Date(fim) : null;

      return (!dataInicio || dataReg >= dataInicio) &&
             (!dataFim || dataReg <= dataFim);
    });
  }

  if (registros.length === 0) {
    estatisticas.innerHTML = "<p>Nenhum dado disponível para relatório.</p>";
    return;
  }

  const total = registros.length;
  const semRisco = registros.filter(r => r.risco === "Verde").length;
  const moderados = registros.filter(r => r.risco === "Amarelo").length;
  const urgentes = registros.filter(r => r.risco === "Vermelho").length;

  const masculino = registros.filter(r => r.sexo === "Masculino").length;
  const feminino = registros.filter(r => r.sexo === "Feminino").length;

  const mediaIdade = (registros.reduce((acc, r) => acc + Number(r.idade), 0) / total).toFixed(1);

  const faixas = { criancas:0, jovens:0, adultos:0, idosos:0 };
  registros.forEach(r => {
    const idade = Number(r.idade);
    if (idade <= 12) faixas.criancas++;
    else if (idade <= 25) faixas.jovens++;
    else if (idade <= 59) faixas.adultos++;
    else faixas.idosos++;
  });

  const freq = {};
  registros.forEach(r => {
    r.sintomas.forEach(s => {
      if (!freq[s]) freq[s] = { count: 0, idades: [], sexos: { masculino:0, feminino:0 } };
      freq[s].count++;
      freq[s].idades.push(Number(r.idade));
      if (r.sexo === "Masculino") freq[s].sexos.masculino++;
      if (r.sexo === "Feminino") freq[s].sexos.feminino++;
    });
  });

  const sintomasOrdenados = Object.entries(freq).sort((a, b) => b[1].count - a[1].count);
  const topSintomas = sintomasOrdenados.slice(0, 5);

  const listaHorizontal = topSintomas.map(([s]) => s).join(", ");
  const detalhes = topSintomas.map(([s, data]) => {
    const mediaSintoma = (data.idades.reduce((acc, idade) => acc + idade, 0) / data.idades.length).toFixed(1);
    return `<p style="margin-left:20px; margin-top:10px;">• <strong>${s}</strong>: ${data.count} pessoas, Média de idade: ${mediaSintoma} anos, Masculino: ${data.sexos.masculino}, Feminino: ${data.sexos.feminino}</p>`;
  }).join("");

  estatisticas.innerHTML = `
    <p><strong>Total de registos:</strong> ${total}</p>
    <p><strong>Sem risco 🟢:</strong> ${semRisco}</p>
    <p><strong>Moderados 🟠:</strong> ${moderados}</p>
    <p><strong>Urgentes 🔴:</strong> ${urgentes}</p>
    <p><strong>Distribuição por sexo:</strong> Masculino ${masculino}, Feminino ${feminino}</p>
    <p><strong>Média de idade geral:</strong> ${mediaIdade} anos</p>
    <p><strong>Faixas etárias:</strong> Crianças ${faixas.criancas}, Jovens ${faixas.jovens}, Adultos ${faixas.adultos}, Idosos ${faixas.idosos}</p>
    <p><strong>Sintomas frequentes:</strong> ${listaHorizontal}</p>
    <p><strong>Detalhes:</strong></p>
    <div>${detalhes}</div>
  `;
}

// Exportar PDF
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Relatório de Sintomas", 10, 10);

  const estatisticas = document.getElementById("estatisticas").innerText;

  // Limpa emojis e símbolos especiais
  const textoLimpo = estatisticas
    .replace(/[\u{1F600}-\u{1F6FF}]/gu, '') // remove emojis
    .replace(/[^\x00-\x7F]/g, '') // remove caracteres não ASCII
    .split("\n");

  let y = 20;
  textoLimpo.forEach(linha => {
    doc.text(linha.trim(), 10, y);
    y += 10;
    if (y > 280) { doc.addPage(); y = 20; }
  });

  doc.save("relatorio.pdf");
}


// Inicialização
document.addEventListener("DOMContentLoaded", gerarRelatorio);





