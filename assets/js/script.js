const imgs = document.querySelectorAll('.img-select a');

const imgBtns = [...imgs];

let imgId = 1;

//slide top
const images =[
    { 'id': '1', 'url': './assets/img/banner/img1.jpg'},
    { 'id': '2', 'url': './assets/img/banner/img2.webp'},
    { 'id': '3', 'url': './assets/img/banner/img3.jpg'},
    { 'id': '4', 'url': './assets/img/banner/img4.png'},
];

const conteinerItems = document.querySelector("#conteiner-items");

const loadImages = (images) =>{
    images.forEach(image =>{
         conteinerItems.innerHTML += `
         <div class='item'>
         <img src='${image.url}'>
         </div>
         `;
    });
};

loadImages(images, conteinerItems);

let items = document.querySelectorAll(".item");

const previous = () =>{
    const lastItem = items[items.length -1];
    conteinerItems.insertBefore(lastItem, items[0]);
    items = document.querySelectorAll(".item");
};

const next = () =>{
    conteinerItems.appendChild(items[0]);
    items = document.querySelectorAll(".item");
};

document.querySelector("#previous").addEventListener("click", previous);
document.querySelector("#next").addEventListener("click", next);

let autoplayInterval;

const startAutoplay = () =>{
    autoplayInterval = setInterval(() =>{
        next();
    }, 5000);
};

const stopAutoplay = () =>{
    clearInterval(autoplayInterval);
};

startAutoplay();

const interactiveElements = [conteinerItems, ... document.querySelectorAll('.conteiner-shadow, .item, .item img')];

interactiveElements.forEach(Element => {
    Element.addEventListener("mouseenter", stopAutoplay);
    Element.addEventListener("mouseleave", startAutoplay);
});

conteinerItems.addEventListener("mouseenter", stopAutoplay);
conteinerItems.addEventListener("mouseleave", startAutoplay);

// fim do slid top

// slide equipe

// Seleciona o contêiner principal do carrossel
const wrapper = document.querySelector(".wrapper");

// Seleciona o elemento do carrossel
const carousel = document.querySelector(".carousel");

// Obtém a largura do primeiro card no carrossel
const firstCardWidth = carousel.querySelector(".card").offsetWidth;

// Seleciona todos os botões de seta (ícones) dentro do wrapper
const arrowBtns = document.querySelectorAll(".wrapper i");

// Converte a lista de filhos do carrossel em um array
const carouselChildrens = [...carousel.children];

// Variáveis de estado
let isDragging = false, // Indica se o carrossel está sendo arrastado
    isAutoPlay = true, // Indica se a reprodução automática está ativa
    startX, // Posição inicial do cursor no eixo X ao arrastar
    startScrollLeft, // Posição inicial de rolagem do carrossel ao arrastar
    timeoutId; // ID do timeout para a reprodução automática
 
// Calcula quantos cards cabem na largura visível do carrossel
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insere cópias dos últimos cards no início do carrossel para criar um efeito de rolagem infinita
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insere cópias dos primeiros cards no final do carrossel para criar um efeito de rolagem infinita
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Ajusta a posição de rolagem do carrossel para ocultar os cards duplicados no início
carousel.classList.add("no-transition"); // Desativa transições temporariamente
carousel.scrollLeft = carousel.offsetWidth; // Rola para a posição inicial correta
carousel.classList.remove("no-transition"); // Reativa as transições

// Adiciona ouvintes de evento para os botões de seta (esquerda e direita)
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Rola o carrossel para a esquerda ou direita com base no ID do botão
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

// Função chamada quando o usuário começa a arrastar o carrossel
const dragStart = (e) => {
    isDragging = true; // Ativa o estado de arrastar
    carousel.classList.add("dragging"); // Adiciona uma classe para estilos durante o arrasto
    startX = e.pageX; // Armazena a posição inicial do cursor no eixo X
    startScrollLeft = carousel.scrollLeft; // Armazena a posição inicial de rolagem
};

// Função chamada enquanto o usuário arrasta o carrossel
const dragging = (e) => {
    if (!isDragging) return; // Se não estiver arrastando, sai da função
    // Atualiza a posição de rolagem com base no movimento do cursor
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

// Função chamada quando o usuário para de arrastar o carrossel
const dragStop = () => {
    isDragging = false; // Desativa o estado de arrastar
    carousel.classList.remove("dragging"); // Remove a classe de arrasto
};

// Função para criar um efeito de rolagem infinita
const infiniteScroll = () => {
    // Se o carrossel estiver no início, rola para o final
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition"); // Desativa transições
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth); // Rola para o final
        carousel.classList.remove("no-transition"); // Reativa transições
    }
    // Se o carrossel estiver no final, rola para o início
    else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition"); // Desativa transições
        carousel.scrollLeft = carousel.offsetWidth; // Rola para o início
        carousel.classList.remove("no-transition"); // Reativa transições
    }

    // Limpa o timeout existente e inicia a reprodução automática se o mouse não estiver sobre o carrossel
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
};

// Função para reprodução automática do carrossel
const autoPlay = () => {
    // Se a largura da tela for menor que 800px ou a reprodução automática estiver desativada, sai da função
    if (window.innerWidth < 800 || !isAutoPlay) return;
    // Rola o carrossel automaticamente a cada 2500ms (2.5 segundos)
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
};

// Inicia a reprodução automática ao carregar a página
autoPlay();

// Adiciona ouvintes de evento para o carrossel
carousel.addEventListener("mousedown", dragStart); // Inicia o arrasto ao clicar
carousel.addEventListener("mousemove", dragging); // Atualiza a posição de rolagem ao arrastar
document.addEventListener("mouseup", dragStop); // Para o arrasto ao soltar o botão do mouse
carousel.addEventListener("scroll", infiniteScroll); // Gerencia a rolagem infinita

// Pausa a reprodução automática quando o mouse entra no carrossel
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));

// Retoma a reprodução automática quando o mouse sai do carrossel
wrapper.addEventListener("mouseleave", autoPlay);
     
//fim slide equipe