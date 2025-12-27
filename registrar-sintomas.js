function calcularRisco(sintomas, temperatura) {
  const graves = ["Falta de ar", "Dor no peito"];
  const moderados = ["Tontura", "Dor de cabeça", "Tosse", "Cansaço extremo"];

  if (sintomas.some(s => graves.includes(s)) || temperatura >= 39) {
    return "Vermelho";
  }
  if (sintomas.some(s => moderados.includes(s)) || temperatura >= 37.5) {
    return "Amarelo";
  }
  return "Verde";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-Regsintomas");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Captura dos campos principais
    const paciente = document.getElementById("paciente").value.trim();
    const sexo = document.getElementById("sexo").value;
    const idade = document.getElementById("idade").value;
    const data = document.getElementById("data").value;
    const temperatura = parseFloat(document.getElementById("temperatura").value);

    // Sintomas
    const checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
    let sintomas = Array.from(checkboxes).map(cb => cb.value);

    const outro = document.getElementById("outroSintoma").value.trim();
    if (outro) sintomas.push(outro);

    // Observações
    const observacoes = document.getElementById("observacoes").value.trim();

    // Cálculo de risco
    const risco = calcularRisco(sintomas, temperatura);

    // Objeto de registo
    const registo = {
      paciente,
      sexo,
      idade,
      data,
      temperatura,
      sintomas,
      observacoes,
      risco
    };

    // Guardar no localStorage
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.push(registo);
    localStorage.setItem("registros", JSON.stringify(registros));

    alert("✅ Sintomas registados com sucesso!");
    form.reset();
  });
});

