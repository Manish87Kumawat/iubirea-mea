/* ══════════════════════════════════════════════════
   ROMANTIC BIRTHDAY WEBSITE — script.js
   Features:
   ✦ Entry screen name validation
   ✦ Confetti animation on correct name
   ✦ Floating hearts (hero + entry)
   ✦ Scroll-reveal animations
   ✦ Heart burst on virtual hug
   ══════════════════════════════════════════════════ */

/* ──────────────────────────────────────
   UTILITY
────────────────────────────────────── */
const $ = id => document.getElementById(id);
const HEARTS = ['💕', '🌸', '💗', '❤️', '✨', '💍', '🌹', '💖'];

/* ──────────────────────────────────────
   1. ENTRY SCREEN
────────────────────────────────────── */
const entryScreen = $('entry-screen');
const mainSite = $('main-site');
const nameInput = $('name-input');
const enterBtn = $('enter-btn');
const entryError = $('entry-error');

/** Show elegant error message */
function showError(msg) {
    entryError.textContent = msg;
    entryError.classList.add('show');
    nameInput.classList.add('shake');
    nameInput.addEventListener('animationend', () => {
        nameInput.classList.remove('shake');
    }, { once: true });
}

/** Validate and unlock main website */
function handleEntry() {
    const val = nameInput.value.trim();

    if (!val) {
        showError('Aapka naam toh likhiye, hum intezaar kar rahe hain... 🌸');
        return;
    }

    if (val.toLowerCase() === 'lakshita') {
        // ✅ Correct — unlock website
        entryError.classList.remove('show');
        launchConfetti();

        setTimeout(() => {
            entryScreen.classList.add('fade-out');
            mainSite.classList.remove('hidden');
            // Trigger repaint then fade in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    mainSite.classList.add('visible');
                    initHeroHearts();
                    initScrollReveal();
                });
            });
        }, 600);
    } else {
        showError('Hmm... yeh naam kuch aur lag raha hai. Sahi naam likhiye 💗');
    }
}

enterBtn.addEventListener('click', handleEntry);
nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleEntry();
    // Clear error on typing
    entryError.classList.remove('show');
});

/* Entry background hearts */
(function spawnEntryHearts() {
    const container = document.querySelector('.entry-hearts');
    for (let i = 0; i < 18; i++) {
        const el = document.createElement('span');
        el.classList.add('entry-bg-heart');
        el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
        el.style.setProperty('--left', Math.random() * 100 + '%');
        el.style.setProperty('--dur', (6 + Math.random() * 8) + 's');
        el.style.setProperty('--delay', (Math.random() * 8) + 's');
        el.style.fontSize = (0.7 + Math.random() * 1.2) + 'rem';
        container.appendChild(el);
    }
})();

/* ──────────────────────────────────────
   2. CONFETTI ANIMATION
────────────────────────────────────── */
const confettiCanvas = $('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

let confettiParticles = [];
let confettiRAF = null;

const CONFETTI_COLORS = [
    '#E91E63', '#F48FB1', '#F8BBD0', '#FF80AB',
    '#C9847B', '#FCE4EC', '#FF4081', '#FFCDD2'
];

function createConfettiParticle() {
    return {
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height * -0.5,
        r: Math.random() * 6 + 3,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        tilt: Math.random() * 10 - 5,
        tiltSpeed: (Math.random() - 0.5) * 0.15,
        speed: Math.random() * 3 + 2,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
    };
}

function drawConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt * Math.PI / 180);

        if (p.shape === 'rect') {
            ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Update
        p.y += p.speed;
        p.tilt += p.tiltSpeed;
        p.x += Math.sin(p.y * 0.04) * 1.2;
        p.opacity = Math.max(0, p.opacity - 0.003);
    });

    confettiParticles = confettiParticles.filter(p => p.opacity > 0);

    if (confettiParticles.length > 0) {
        confettiRAF = requestAnimationFrame(drawConfetti);
    } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

function launchConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    // Create burst of particles
    for (let i = 0; i < 180; i++) {
        setTimeout(() => {
            confettiParticles.push(createConfettiParticle());
        }, Math.random() * 800);
    }

    if (confettiRAF) cancelAnimationFrame(confettiRAF);
    drawConfetti();
}

/* ──────────────────────────────────────
   3. FLOATING HEARTS (Hero)
────────────────────────────────────── */
function initHeroHearts() {
    const container = $('floating-hearts');
    if (!container) return;

    for (let i = 0; i < 22; i++) {
        const el = document.createElement('span');
        el.classList.add('heart-float');
        el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
        el.style.setProperty('--left', Math.random() * 100 + '%');
        el.style.setProperty('--dur', (7 + Math.random() * 9) + 's');
        el.style.setProperty('--delay', (Math.random() * 10) + 's');
        el.style.fontSize = (0.6 + Math.random() * 1.4) + 'rem';
        container.appendChild(el);
    }
}

/* ──────────────────────────────────────
   4. SCROLL REVEAL
────────────────────────────────────── */
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────
   5. SMOOTH SCROLL (hero CTA button)
────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ──────────────────────────────────────
   6. VIRTUAL HUG — Heart Burst
────────────────────────────────────── */
const hugBtn = $('hug-btn');
const heartBurst = $('heart-burst');

hugBtn.addEventListener('click', () => {
    // Clear previous burst
    heartBurst.innerHTML = '';

    const count = 24;
    const emojis = ['💕', '💗', '❤️', '🌸', '✨', '💍', '🌹'];

    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.classList.add('burst-heart');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const angle = (360 / count) * i + (Math.random() - 0.5) * 20;
        const dist = 80 + Math.random() * 160;
        const rad = angle * Math.PI / 180;
        const bx = Math.cos(rad) * dist + 'px';
        const by = Math.sin(rad) * dist + 'px';

        el.style.setProperty('--bx', bx);
        el.style.setProperty('--by', by);
        el.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';
        el.style.animationDelay = (Math.random() * 0.3) + 's';

        heartBurst.appendChild(el);
    }

    // Animate hug button
    hugBtn.textContent = 'Aapko yeh hug mubarak ho 💗';
    hugBtn.disabled = true;
    setTimeout(() => {
        hugBtn.textContent = 'Ek Virtual Hug 🤗';
        hugBtn.disabled = false;
    }, 2800);
});

/* ──────────────────────────────────────
   7. CSS SHAKE KEYFRAME (injected)
────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
  .shake { animation: shake 0.4s ease; }
`;
document.head.appendChild(style);

/* ──────────────────────────────────────
   8. WINDOW RESIZE — resize confetti canvas
────────────────────────────────────── */
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});