// Definições iniciais e manipulação dos botões de navegação do formulário
const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum--;
    updateFormSteps();
    updateProgressbar();
  });
});

function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("form-step-active") &&
      formStep.classList.remove("form-step-active");
  });

  formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
    if (idx < formStepsNum + 1) {
      progressStep.classList.add("progress-step-active");
    } else {
      progressStep.classList.remove("progress-step-active");
    }
  });

  const progressActive = document.querySelectorAll(".progress-step-active");
  progress.style.width =
    ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// Manipulação dos inputs para adicionar/remover a classe 'active'
const inputs = document.querySelectorAll(".input-group input");

inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.previousElementSibling.classList.add("active");
  });

  input.addEventListener("blur", () => {
    if (!input.value) {
      input.previousElementSibling.classList.remove("active");
    }
  });
});

// Fechamento do formulário
document.querySelector(".icon-close").addEventListener("click", function () {
  let wrapper = document.querySelector(".form");
  wrapper.classList.add("dismiss-effect");
  wrapper.addEventListener(
    "animationend",
    function () {
      window.location.href = "/";
    },
    { once: true }
  );
});

// Validação e preenchimento automático do endereço via CEP
document.getElementById("cep").addEventListener("blur", function (e) {
  var cep = e.target.value.replace(/\D/g, "");
  if (cep != "" && /^[0-9]{8}$/.test(cep)) {
    document.getElementById("city").value = "carregando...";
    document.getElementById("state").value = "carregando...";
    document.getElementById("street").value = "carregando...";
    document.getElementById("country").value = "Brasil"; // Adicionado diretamente, supondo que o uso é específico para o Brasil

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if (!("erro" in data)) {
          document.getElementById("city").value = data.localidade;
          document.getElementById("state").value = data.uf;
          document.getElementById("street").value = data.logradouro;
          // O país já está definido como Brasil, então não precisa atualizar
        } else {
          alert("CEP não encontrado.");
          limpa_formulario_cep();
        }
      })
      .catch(function (error) {
        alert("Erro ao buscar o CEP.");
        limpa_formulario_cep();
      });
  } else {
    alert("Formato de CEP inválido.");
    limpa_formulario_cep();
  }
});

function limpa_formulario_cep() {
  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
  document.getElementById("street").value = "";
}

$(document).ready(function () {
  $("#cpf").mask("000.000.000-00");
  $("#phone").mask("(00) 00000-0000");
  $("#cep").mask("00000-000");
});

// Assumindo que o ID do campo de rua é "street",
// o ID do campo de número da casa é "houseNumber",
// e o ID do campo de endereço completo é "address"

// Adiciona um ouvinte de evento 'input' ao campo de rua
document
  .getElementById("street")
  .addEventListener("input", updateEnderecoCompleto);

// Adiciona um ouvinte de evento 'input' ao campo de número da casa
document
  .getElementById("houseNumber")
  .addEventListener("input", updateEnderecoCompleto);

// Função para atualizar o campo de endereço completo
function updateEnderecoCompleto() {
  // Obtém os valores atuais dos campos de rua e número da casa
  const rua = document.getElementById("street").value;
  const numero = document.getElementById("houseNumber").value;

  // Combina os valores de rua e número com uma vírgula e espaço entre eles
  const enderecoCompleto = `${rua}, ${numero}`;

  // Define o valor combinado como o valor do campo de endereço completo
  document.getElementById("address").value = enderecoCompleto;
}

document.querySelector(".form").addEventListener("submit", async function (event) {
  event.preventDefault();

  if (
    formStepsNum < formSteps.length - 1 ||
    !validarEtapaAtual(formStepsNum)
  ) {
    alert(
      "Por favor, complete todas as etapas do formulário e preencha todos os campos obrigatórios."
    );
  } else {
    console.log("Todos os campos foram preenchidos. Procedendo...");

    // Extrai os dados do formulário
    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Salva os dados no LocalStorage
    localStorage.setItem("checkoutData", JSON.stringify(formObject));

    try {
      const respostaEmail = await fetch("/send-email", {
        method: "POST",
        body: formData, // Usa FormData diretamente
      });

      if (respostaEmail.ok) {
        console.log("E-mail enviado com sucesso.");
        alert("E-mail com seu Orçamento foi enviado.");

        // Redireciona para a tela de checkout
        window.location.href = "/checkout.html";
      } else {
        console.error("Erro ao enviar e-mail");
      }
    } catch (erro) {
      console.error("Erro:", erro);
    }
  }
});

function validarEtapaAtual(etapaAtual) {
  // A implementação da sua função de validação vem aqui
  return true; // Isto é apenas um placeholder. Implemente sua lógica de validação.
}
document.addEventListener("DOMContentLoaded", function () {
  function updateAreaCalculation() {
    const length = parseFloat(document.getElementById("deckType").value) || 0;
    const width = parseFloat(document.getElementById("deckSize").value) || 0;
    const area = length * width;

    const areaInput = document.getElementById("woodType");
    areaInput.value = area.toFixed(2) + " m²"; // Atualiza o valor
  }

  document
    .getElementById("woodType")
    .addEventListener("keydown", function (event) {
      event.preventDefault();
    });

  document
    .getElementById("deckType")
    .addEventListener("input", updateAreaCalculation);
  document
    .getElementById("deckSize")
    .addEventListener("input", updateAreaCalculation);
});

document.addEventListener("DOMContentLoaded", function () {
  function updateWeightCalculation() {
    const length = parseFloat(document.getElementById("deckType").value) || 0;
    const width = parseFloat(document.getElementById("deckSize").value) || 0;

    const weight = length * width * 13.8;

    const weightInput = document.getElementById("finishType");
    weightInput.value = weight.toFixed(2) + " kg";
  }

  document
    .getElementById("deckType")
    .addEventListener("input", updateWeightCalculation);
  document
    .getElementById("deckSize")
    .addEventListener("input", updateWeightCalculation);

  document
    .getElementById("finishType")
    .addEventListener("keydown", function (event) {
      event.preventDefault();
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Define o valor por metro quadrado como um valor fixo no campo de valor do produto
  const pricePerSquareMeter = 340;
  document.getElementById(
    "ValorProduto"
  ).value = `R$ ${pricePerSquareMeter} por m²`;

  function updateFinalProductValue() {
    const length = parseFloat(document.getElementById("deckType").value) || 0;
    const width = parseFloat(document.getElementById("deckSize").value) || 0;

    const area = length * width;

    const finalProductValue = area * pricePerSquareMeter;

    document.getElementById("ValorProdutoFinal").value =
      "R$ " + finalProductValue.toFixed(2);
  }

  // Adiciona o evento para calcular o valor final do produto quando os valores de comprimento e largura mudarem
  document
    .getElementById("deckType")
    .addEventListener("input", updateFinalProductValue);
  document
    .getElementById("deckSize")
    .addEventListener("input", updateFinalProductValue);

  // Impede digitação no campo do valor final do produto
  document
    .getElementById("ValorProdutoFinal")
    .addEventListener("keydown", function (event) {
      event.preventDefault(); // Evita a entrada de texto pelo usuário
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Função para formatar o input para um padrão decimal
  function formatDecimalInput(event) {
    let value = event.target.value;

    // Remove caracteres não numéricos
    value = value.replace(/[^\d]/g, "");

    // Insere um ponto decimal depois do primeiro dígito para números com dois dígitos ou mais
    if (value.length > 1) {
      value = value.substring(0, 1) + "." + value.substring(1);
    }

    // Atualiza o valor do input
    event.target.value = value;
  }

  // Aplica a função aos inputs de comprimento e largura
  const lengthInput = document.getElementById("deckType");
  const widthInput = document.getElementById("deckSize");

  lengthInput.addEventListener("input", formatDecimalInput);
  widthInput.addEventListener("input", formatDecimalInput);
});

// Coloque a função calcularFrete aqui
async function calcularFrete() {
  var cep = document.getElementById('cep').value;
  cep = cep.replace('-', '');
  var deckType = document.getElementById('deckType').value;
  var deckSize = document.getElementById('deckSize').value;
  var finishType = document.getElementById('finishType').value;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: { postal_code: '11740000' },
      to: { postal_code: cep },
      package: { height: 4, width: deckType, length: deckSize, weight: finishType },
      services: "1"
    })
  };

  try {
    const response = await fetch('http://localhost:3000/api/frete', options);
    const data = await response.json();
    return data.price;
  } catch (err) {
    console.error(err);
  }
}

// Impede digitação no campo do valor do frete
  document.getElementById('frete').addEventListener('keydown', function(event) {
      event.preventDefault(); // Evita a entrada de texto pelo usuário
  });

// Função para atualizar o valor do frete automaticamente
document.addEventListener("DOMContentLoaded", function () {
  function updateFreteAutomatically() {
    const deckType = document.getElementById('deckType').value;
    const deckSize = document.getElementById('deckSize').value;

    // Verifica se o CEP e os campos necessários estão preenchidos antes de calcular o frete
    if (deckType && deckSize) {
      calcularFrete().then(valorFrete => {
        document.getElementById('frete').value = valorFrete;
      }).catch(error => {
        console.error("Erro ao calcular o frete:", error);
      });
    }
  }

  // Adiciona o evento de input para atualizar o frete quando os valores mudarem
  document.getElementById('deckType').addEventListener('input', updateFreteAutomatically);
  document.getElementById('deckSize').addEventListener('input', updateFreteAutomatically);
});
