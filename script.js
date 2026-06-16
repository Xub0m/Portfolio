const container = document.getElementById('sliderContainer');
const track = document.getElementById('sliderTrack');

// CLONAGEM AUTOMÁTICA DO SLIDER
const originalBlock = track.querySelector('.projects-block');
const cloneBlock = originalBlock.cloneNode(true);
cloneBlock.setAttribute('aria-hidden', 'true');
track.appendChild(cloneBlock);

let isDragging = false;
let isHovered = false; 
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let speed = -1;
let animationFrameId;
let dragDistance = 0;

function getBlockWidth() {
    return track.children[0].offsetWidth;
}

function updateSliderPosition() {
    if (!isDragging && !isHovered) {
        currentTranslate += speed;

        const limit = -getBlockWidth();
        if (currentTranslate <= limit) {
            currentTranslate = 0;
        }
        if (currentTranslate > 0) {
            currentTranslate = limit;
        }

        track.style.transform = `translateX(${currentTranslate}px)`;
    }
    animationFrameId = requestAnimationFrame(updateSliderPosition);
}

function startDrag(e) {
    isDragging = true;
    dragDistance = 0;
    container.classList.add('dragging');
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    prevTranslate = currentTranslate;
    cancelAnimationFrame(animationFrameId);
}

function drag(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const deltaX = currentX - startX;
    dragDistance = Math.abs(deltaX);

    currentTranslate = prevTranslate + deltaX;

    const limit = -getBlockWidth();
    if (currentTranslate <= limit) {
        currentTranslate += getBlockWidth();
        startX = currentX - (currentTranslate - prevTranslate);
    }
    if (currentTranslate > 0) {
        currentTranslate -= getBlockWidth();
        startX = currentX - (currentTranslate - prevTranslate);
    }

    track.style.transform = `translateX(${currentTranslate}px)`;
}

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('dragging');
    animationFrameId = requestAnimationFrame(updateSliderPosition);
}

// Evita abrir o link se o usuário apenas arrastou o slider
track.addEventListener('click', (e) => {
    if (dragDistance > 10) {
        e.preventDefault();
    }
});

// Congelar no Hover
container.addEventListener('mouseenter', () => {
    isHovered = true;
});

container.addEventListener('mouseleave', () => {
    isHovered = false;
});

container.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', drag);
window.addEventListener('mouseup', endDrag);

container.addEventListener('touchstart', startDrag);
window.addEventListener('touchmove', drag);
window.addEventListener('touchend', endDrag);

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