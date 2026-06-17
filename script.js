/* ==========================================================================
   XUBOM — PORTFOLIO — Interações
   ========================================================================== */

/* --- VOXEL FIELD (ambiente em toda a página, fixed) --- */
(function spawnVoxels() {
    const field = document.getElementById('voxelField');
    if (!field) return;

    const COUNT = 40;
    for (let i = 0; i < COUNT; i++) {
        const v = document.createElement('div');
        v.className = 'voxel';
        const left = Math.random() * 100;
        const size = 4 + Math.random() * 6;
        const duration = 14 + Math.random() * 16;
        const delay = Math.random() * -30;

        v.style.left = left + 'vw';
        v.style.width = size + 'px';
        v.style.height = size + 'px';
        v.style.animationDuration = duration + 's';
        v.style.animationDelay = delay + 's';
        field.appendChild(v);
    }
})();

/* --- SCROLL REVEAL --- */
(function initRevealObserver() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
})();

/* --- SLIDER DE PROJETOS: auto-scroll contínuo + drag com inércia + wheel --- */
const container = document.getElementById('sliderContainer');
const track = document.getElementById('sliderTrack');

const originalBlock = track.querySelector('.projects-block');
const cloneBlock = originalBlock.cloneNode(true);
cloneBlock.setAttribute('aria-hidden', 'true');
track.appendChild(cloneBlock);

let isHovered = false;
let isDragging = false;
let currentTranslate = 0;
let autoSpeed = -1;       // velocidade do movimento automático contínuo
let dragVelocity = 0;     // velocidade acumulada durante o arrasto, usada na inércia
let lastPointerX = 0;
let lastPointerTime = 0;
let animationFrameId;

function getBlockWidth() {
    return track.children[0].offsetWidth;
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

function applyTransform() {
    track.style.transform = `translateX(${currentTranslate}px)`;
}

function updateSliderPosition() {
    if (!isHovered && !isDragging) {
        if (Math.abs(dragVelocity) > 0.05) {
            // Desacelera a inércia do arrasto até ela se anular
            currentTranslate += dragVelocity;
            dragVelocity *= 0.94;
        } else {
            dragVelocity = 0;
            currentTranslate += autoSpeed;
        }
        ajustarLimites();
        applyTransform();
    }
    animationFrameId = requestAnimationFrame(updateSliderPosition);
}

container.addEventListener('wheel', (e) => {
    e.preventDefault();
    dragVelocity = 0;
    currentTranslate -= e.deltaY * 0.8;
    ajustarLimites();
    applyTransform();
}, { passive: false });

container.addEventListener('mouseenter', () => { isHovered = true; });
container.addEventListener('mouseleave', () => { isHovered = false; });

/* Drag to scroll (mouse + touch) com inércia ao soltar */
function pointerDown(clientX) {
    isDragging = true;
    isHovered = true;
    dragVelocity = 0;
    lastPointerX = clientX;
    lastPointerTime = performance.now();
    container.classList.add('dragging');
}

function pointerMove(clientX) {
    if (!isDragging) return;
    const now = performance.now();
    const dx = clientX - lastPointerX;
    const dt = Math.max(now - lastPointerTime, 1);

    currentTranslate += dx;
    dragVelocity = dx / dt * 16; // normaliza para "px por frame" aproximado
    ajustarLimites();
    applyTransform();

    lastPointerX = clientX;
    lastPointerTime = now;
}

function pointerUp() {
    if (!isDragging) return;
    isDragging = false;
    isHovered = false;
    container.classList.remove('dragging');
}

container.addEventListener('mousedown', (e) => pointerDown(e.clientX));
window.addEventListener('mousemove', (e) => pointerMove(e.clientX));
window.addEventListener('mouseup', pointerUp);

container.addEventListener('touchstart', (e) => pointerDown(e.touches[0].clientX), { passive: true });
container.addEventListener('touchmove', (e) => pointerMove(e.touches[0].clientX), { passive: true });
container.addEventListener('touchend', pointerUp);

animationFrameId = requestAnimationFrame(updateSliderPosition);


/* --- GOOGLE TRANSLATE --- */
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

/* --- CURSOR PERSONALIZADO --- */
const dot = document.getElementById('customCursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    }
});

function animateCursor() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    if (follower) {
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
    }

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Pequeno "tap" visual no clique, reforçando o feedback tátil do cursor
window.addEventListener('mousedown', () => {
    dot.classList.add('click');
    follower.classList.add('click');
});
window.addEventListener('mouseup', () => {
    dot.classList.remove('click');
    follower.classList.remove('click');
});

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