document.addEventListener("DOMContentLoaded", function() {
  const homeElement = document.querySelector('.home');
  const textElement = document.querySelector('.content p');
  const btnElement = document.querySelector('.orçamento'); // Referência ao botão

  const backgrounds = [
    '/img/2.webp',
    '/img/10.webp',
    '/img/8.webp'
  ];
  
  const texts = [
    '<h3 style="font-size: 3rem; color: #f6f6f6; margin:10px 0;">Relaxe no Banheiro</h3> Descubra como transformar seu banheiro em um refúgio relaxante com nosso deck de banheiro. Experimente a sensação de luxo e conforto enquanto desfruta de um banho revigorante. Faça seu orçamento hoje e dê um toque de elegância ao seu espaço de banho.',
    '<h3 style="font-size: 3rem; color: #f6f6f6; margin:10px 0;">Renovação sem Complicações</h3> Renove o piso do seu box de chuveiro sem a necessidade de reformas demoradas. Com o nosso deck de banheiro, você pode ter um visual renovado instantaneamente, sem sujeira ou dores de cabeça. Descubra a praticidade e a beleza do nosso produto e solicite um orçamento agora mesmo.',
    '<h3 style="font-size: 3rem; color: #f6f6f6;  margin:10px 0;">Sustentabilidade</h3> Faça uma escolha ecologicamente consciente ao optar pelo nosso deck de banheiro. Feito com madeiras de reflorestamento e tratadas para resistir ao apodrecimento precoce, nosso deck oferece durabilidade e elegância sustentáveis. Transforme seu banheiro em um spa particular com nosso produto de qualidade. Solicite seu orçamento e contribua para a preservação ambiental.'
    
  ];

  const btnLinks = [
    '/orçamento.html',
    '/orçamento.html',
    '/orçamento.html',
  ];
  
  let current = 0;

  function changeBackgroundAndText() {
  
    homeElement.style.backgroundImage = `url('${backgrounds[current]}')`;
    textElement.style.opacity = '0';
    btnElement.style.opacity = '0'; 
    

    setTimeout(() => {
      textElement.innerHTML = texts[current];
      btnElement.href = btnLinks[current];
      textElement.style.opacity = '1';
      btnElement.style.opacity = '1'; 
    }, 500); 
   

    current = (current + 1) % backgrounds.length;
  }
  

  setInterval(changeBackgroundAndText, 5000);

  changeBackgroundAndText();
});
