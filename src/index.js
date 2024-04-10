import express from "express";
import morgan from "morgan";
import { PORT } from "./config.js";
import path from "path";
import nodemailer from "nodemailer";
import multer from "multer";
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
const upload = multer();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none());
app.use(express.static(path.resolve("src/public")));
app.use(cors());


// API Mercado Pago/ criar pagamento
const client = new MercadoPagoConfig({ accessToken: 'TEST-770457519520513-040717-e6af035cdb5a2637dd2a7f86461a1243-297216647' });

app.post('/create_preference', async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          unit_price: Number(req.body.unit_price),
          quantity: Number(req.body.quantity),
        },
      ],
      back_urls: {
        success: "https://youtube.com/@lucas_dav1",
        failure: "https://youtube.com/@lucas_dav1",
        pending: "https://youtube.com/@lucas_dav1",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: body });
    res.json({ id: result.id });
  } catch (error) {
    res.status(500).json({ message: "alguma coisa deu errado" });
  }
});


// API Melhor Envio/ calculo de frete
app.post("https://test-iota-black-60.vercel.app//api/frete", async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiI3MWQ2NzI3OWNlNTc5MGQ4MGU1NzViZjU5NmVmOWNmZDkwNTYxYzYzN2FmZDM3MzExZGYwMjY3ZjJhN2U5YTJiNjdkOGUyMDI1MGFiYmUzNSIsImlhdCI6MTcxMjA5NzQ5NS40NTY5NTcsIm5iZiI6MTcxMjA5NzQ5NS40NTY5NiwiZXhwIjoxNzQzNjMzNDk1LjQzOTYwOCwic3ViIjoiOWJiMmYyZDctMjg5NC00MjA1LWJlNjYtOWI5NTFkOGM1MDFlIiwic2NvcGVzIjpbInNoaXBwaW5nLWNhbGN1bGF0ZSJdfQ.bLX8OK7DJ5LsukYh7UGcPTHmQPF7JhUffhiCzr0fnPAT5gfh1iI35uwaOQfk5PYJzyJuMQSQkKS0k0Lejwai-xULVIIVEFFBlxSY6pUAuHP79FRgyzDjiIKY3u1yEgy4OrENNxycfkVg5kBwTEV0UyPXkKXvzTBv6OE0AyawN9PpZZkj6FNgKf-zZ-osUM-vY8r28GhpO6vTLSkuddbY_VUCeYWKX571pieRVx_upxrwihEfhVWMTWiCLBy4VZlMBEoOmpG58TE6MJbdjGgmAJEFJPLZP-YEVvFvL0K2TLmW61j832CL7BJDyDaSKX_lxhKiOS6vQeftZMzMEQFtKnFd7ADKKlgxb1rW_FA-MrXCH9BCrEEEn-SSOBFLfnuEx34ZgtBgADkJ6LI5qqmyQID2FTBa84CqXuOwMCMVpfLAiEd6qNKr-TRXtgcd0frohHA6j5qhkuWVwh5f-mrUv5YY0KSGNHnpXgL-1bQqTEgFk90LgnCXcKg4S66H2ZGhq1Ye8FflN4B34o_X52-0mfHxJPbZGOFUVgC6eyTVzbh_EWgew4lv8LWgZseQHXkIAzlaE9u4RFGc1mYhbk_zz3lbQ88Uz2H8vCFaEducu2s-P4SqNN5BPO6wa8SRekPTucRz-BIbSN4SW5BQ02lJlkTsDkYAj2vRgpQOXamrDt0',
      'User-Agent': 'Aplicação lucasdavi99@hotmail.com'
    },
    body: JSON.stringify(req.body),
  };

  // Faça a chamada para a API usando fetch
  try {
    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', options);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao chamar a API ' });
  }
});

// Configuração do transporter do Nodemailer para usar com uma conta Outlook
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: "lucasdavi99@hotmail.com",
    pass: "tgbugfvywsfriymg"
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

// Rota para enviar e-mails com método POST
app.post("https://test-iota-black-60.vercel.app/send-email", (req, res) => {
  console.log("Rota /send-email acessada");
  const {
    fullName,
    cpf,
    email,
    phone,
    cep,
    city,
    state,
    country,
    street,
    houseNumber,
    addressObservation,
    referencePoint,
    deckType,
    deckSize,
    woodType,
    finishType,
    ValorProduto,
    ValorProdutoFinal,
    frete,
    address
  } = req.body;

  // Constrói uma string com os detalhes adicionais do pedido
  let detalhesAdicionais = `Detalhes adicionais do pedido:
  - Nome Completo: ${fullName}
  - CPF: ${cpf}
  - E-mail: ${email}
  - Telefone: ${phone}
  - CEP: ${cep}
  - Cidade: ${city}
  - Estado: ${state}
  - País: ${country}
  - Endereço: ${street}, Nº ${houseNumber}
  - Observação de Endereço: ${addressObservation}
  - Ponto de Referência: ${referencePoint}
  - Primeira medida: ${deckType}
  - Segunda medida: ${deckSize}
  - Área (m²): ${woodType}
  - Peso: ${finishType}
  - Valor do produto: ${ValorProduto}
  - Valor final do produto: ${ValorProdutoFinal}
  - Valor do frete: ${frete}
  - Endereço completo: ${address}`;

  // E-mail para o cliente
  const customerMailOptions = {
    from: "lucasdavi99@hotmail.com",
    to: email,
    subject: "Confirmação de Recebimento de Pedido",
    text: `Olá ${fullName},\n\nRecebemos seu pedido de orçamento. Entraremos em contato em breve.\n\n${detalhesAdicionais}`,
  };

  // E-mail para a empresa
  const companyMailOptions = {
    from: "lucasdavi99@hotmail.com",
    to: "olevera92@gmail.com",
    subject: `Pedido de Orçamento de ${fullName}`,
    text: `Você recebeu um novo pedido de orçamento.\n\n${detalhesAdicionais}`,
  };

  // Enviar e-mail para o cliente
  transporter.sendMail(customerMailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Ocorreu um erro ao enviar o e-mail ao cliente.");
    } else {
      // Enviar e-mail para a empresa somente se o e-mail do cliente foi enviado com sucesso
      transporter.sendMail(companyMailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Ocorreu um erro ao enviar o e-mail para a empresa.");
        } else {
          return res.send("E-mail enviado com sucesso para o cliente e para a empresa.");
        }
      });
    }
  });
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server on port ${PORT}`);
});
