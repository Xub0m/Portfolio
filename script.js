const container = document.getElementById('sliderContainer');
const track = document.getElementById('sliderTrack');

// CLONAGEM AUTOMÁTICA DO SLIDER
const originalBlock = track.querySelector('.projects-block');
const cloneBlock = originalBlock.cloneNode(true);
cloneBlock.setAttribute('aria-hidden', 'true');
track.appendChild(cloneBlock);

let isHovered = false; 
let currentTranslate = 0;
let speed = -1; // Velocidade da movimentação automática contínua
let animationFrameId;

function getBlockWidth() {
    return track.children[0].offsetWidth;
}

function updateSliderPosition() {
    // Só move automaticamente se o mouse NÃO estiver em cima do slider
    if (!isHovered) {
        currentTranslate += speed;
        ajustarLimites();
        track.style.transform = `translateX(${currentTranslate}px)`;
    }
    animationFrameId = requestAnimationFrame(updateSliderPosition);
}

function ajustarLimites() {
    const limit = -getBlockWidth();
    if (currentTranslate <= limit) {
        currentTranslate += getBlockWidth();
    }
    if (currentTranslate > 0) {
        currentTranslate -= getBlockWidth();
    }
}

// NOVA LÓGICA: Movimentação horizontal através do Scroll (Rodinha do Mouse)
container.addEventListener('wheel', (e) => {
    // Evita que a página role para baixo enquanto rola o mouse dentro do slider
    e.preventDefault();

    // Altera a posição baseada na intensidade do scroll (e.deltaY)
    // Multiplicado por 0.8 para suavizar o movimento
    currentTranslate -= e.deltaY * 0.8;
    
    ajustarLimites();
    track.style.transform = `translateX(${currentTranslate}px)`;
}, { passive: false });

// Congelar animação automática no Hover
container.addEventListener('mouseenter', () => {
    isHovered = true;
});

container.addEventListener('mouseleave', () => {
    isHovered = false;
});

animationFrameId = requestAnimationFrame(updateSliderPosition);


// LÓGICA DO GOOGLE TRANSLATE
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'en,pt',
        autoDisplay: false
    }, 'google_translate_element');
}

let currentLang = 'PT';
function toggleLanguage() {
    const googleSelect = document.querySelector('.goog-te-combo');
    const btn = document.getElementById('btnTranslate');

    if (googleSelect) {
        if (currentLang === 'PT') {
            googleSelect.value = 'en';
            googleSelect.dispatchEvent(new Event('change'));
            btn.innerHTML = '🌐 PT';
            currentLang = 'EN';
        } else {
            googleSelect.value = 'pt';
            googleSelect.dispatchEvent(new Event('change'));
            btn.innerHTML = '🌐 EN';
            currentLang = 'PT';
        }
    }
}

// LÓGICA DO CURSOR PERSONALIZADO
const dot = document.getElementById('customCursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0; // Posição real do mouse
let followerX = 0, followerY = 0; // Posição suave do círculo de trás

// Atualiza a posição real do mouse e move o ponto central instantaneamente
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if(dot) {
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    }
});

// Função de animação contínua para criar o efeito "smooth" no seguidor
function animateCursor() {
    // O valor '0.15' controla a suavidade. Menor = mais lento/smooth. Maior = mais rápido.
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    if(follower) {
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
    }
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Adiciona efeitos de "Hover" ao passar em botões, links e elementos clicáveis
const clickables = document.querySelectorAll('a, button, .tag, .project-img-link, .team-icon-wrapper');

clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        dot.classList.add('hover');
        follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        dot.classList.remove('hover');
        follower.classList.remove('hover');
    });
});