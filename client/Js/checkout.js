document.addEventListener("DOMContentLoaded", function () {
  const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));

  console.log("Dados carregados do LocalStorage:", checkoutData);

  if (checkoutData) {
    document.getElementById('Fullname').value = checkoutData.fullName || '';
    document.getElementById('address').value = checkoutData.address || '';
    document.getElementById('city').value = checkoutData.city || '';
    document.getElementById('state').value = checkoutData.state || '';
    document.getElementById('zip').value = checkoutData.cep || '';
    document.getElementById('phone').value = checkoutData.phone || '';

    // Função para limpar o valor monetário e converter para um número
    function cleanAndConvertToNumber(value) {
      // Remove o símbolo de moeda e quaisquer espaços em branco
      let numericValue = value.replace('R$', '').trim();
      // Substitui vírgula por ponto, se necessário, e converte para número
      numericValue = numericValue.replace(',', '.');
      return parseFloat(numericValue);
    }

    const valorProdutoFinal = cleanAndConvertToNumber(checkoutData.ValorProdutoFinal || "0");
    const valorFrete = parseFloat(checkoutData.frete || "0");
    const valorTotal = valorProdutoFinal + valorFrete;
    // Extrai os valores de deckSize, deckType e woodType do checkoutData
    const deckSize = checkoutData.deckSize || "Não especificado";
    const deckType = checkoutData.deckType || "Não especificado";
    const woodType = checkoutData.woodType || "Não especificado";

    console.log('ValorProdutoFinal após conversão:', valorProdutoFinal);
    console.log('ValorFrete após conversão:', valorFrete);
    console.log('ValorTotal:', valorTotal);
    console.log('deckSize:', deckSize);
    console.log('deckType:', deckType);
    console.log('woodType:', woodType);

    updateOrderSummary(valorProdutoFinal, valorFrete, valorTotal);
  }
});

function updateOrderSummary(valorProdutoFinal, valorFrete, valorTotal) {
  document.getElementById('resumoValorProduto').textContent = `Valor do Produto: R$ ${valorProdutoFinal.toFixed(2)}`;
  document.getElementById('resumoValorFrete').textContent = `Valor do Frete: R$ ${valorFrete.toFixed(2)}`;
  document.getElementById('resumoValorTotal').textContent = `Total: R$ ${valorTotal.toFixed(2)}`;
}

// API Mercado Pago - Checkout

const mp = new MercadoPago('TEST-3ab8596b-93db-435f-b839-5339e23c04f3', {
  locale: 'pt-BR'
});

document.addEventListener("DOMContentLoaded", async function () {
  const valorTotal = parseFloat(document.getElementById('resumoValorTotal').textContent.replace('Total: R$ ', ''));

  try {
    const orderData = {
      title: "Deck de Madeira para Box de chuveiro",
      unit_price: valorTotal,
      quantity: 1
    }

    const response = await fetch("https://test-backend-six-omega.vercel.app/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });
    const preference = await response.json();
    console.log("Preference ID: ", preference.id); // Adicionado para depuração
    createCheckoutButton(preference.id);
  } catch (error) {
    console.log(error);
  }
});

const createCheckoutButton = (preferenceId) => {
  const bricksBuilder = mp.bricks();

  const renderComponent = async () => {
    try {
      await bricksBuilder.create("wallet", "wallet_container", {
        initialization: {
          preferenceId: preferenceId,
        },
      });
      console.log("Checkout button created"); // Adicionado para depuração
    } catch (error) {
      console.log("Error creating checkout button: ", error); // Adicionado para depuração
    }
  };
  renderComponent();
};