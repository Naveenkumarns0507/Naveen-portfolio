/* ──────── CANVAS PARTICLES ──────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const NUM = window.innerWidth < 600 ? 40 : 80;
  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.05,
      color: ['#4f9eff', '#a78bfa', '#34d399', '#f472b6'][Math.floor(Math.random() * 4)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    // Draw faint connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.06;
          ctx.strokeStyle = '#4f9eff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ──────── TYPING ANIMATION ──────── */
(function () {
  const words = ['Java Full Stack Developer', 'Web Developer', 'Problem Solver', 'Firebase Developer'];
  let wi = 0, ci = 0, deleting = false;
  const el = document.getElementById('typed-text');
  function tick() {
    const word = words[wi];
    if (deleting) {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 45);
    } else {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 2000); return; }
      setTimeout(tick, 80);
    }
  }
  setTimeout(tick, 600);
})();

/* ──────── PRELOADER ──────── */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  const bar = preloader.querySelector('.loader-bar span');
  const percentEl = preloader.querySelector('.loader-percent');
  const ring = preloader.querySelector('.ring circle.fill');
  const subEl = preloader.querySelector('.loader-sub');

  document.body.classList.add('preloader-active');

  const statusMsgs = [
    { p: 18, text: 'Initializing JVM context...' },
    { p: 38, text: 'Loading MySQL DB driver...' },
    { p: 62, text: 'Establishing Firebase sync...' },
    { p: 85, text: 'Compiling front-end assets...' },
    { p: 96, text: 'Resolving DOM elements...' },
    { p: 100, text: 'System ready.' }
  ];

  function getStatusMessage(p) {
    for (const msg of statusMsgs) {
      if (p <= msg.p) return msg.text;
    }
    return 'Loading...';
  }

  let progress = 6;
  function updateUI(p) {
    const rounded = Math.floor(p);
    if (bar) bar.style.width = rounded + '%';
    if (percentEl) percentEl.textContent = rounded + '%';
    if (ring) ring.style.strokeDashoffset = 226 - (226 * (rounded / 100));
    if (subEl) subEl.textContent = getStatusMessage(rounded);
  }

  function simulate() {
    const inc = Math.random() * 10 + 3;
    progress = Math.min(100, progress + inc);
    updateUI(progress);
    if (progress < 100) {
      setTimeout(simulate, 100 + Math.random() * 150);
    } else {
      finish();
    }
  }

  function finish() {
    setTimeout(() => {
      preloader.classList.add('hidden');
      preloader.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('preloader-active');
    }, 1500);
  }

  // Initialize ring stroke (circumference ~ 2πr where r=36 -> ~226)
  if (ring) {
    ring.style.transition = 'stroke-dashoffset 220ms ease-out';
    ring.style.strokeDasharray = '226';
    ring.style.strokeDashoffset = '226';
  }
  updateUI(progress);

  // Start simulated progress; also ensure immediate completion on load
  setTimeout(simulate, 200);
  window.addEventListener('load', () => { progress = 100; updateUI(100); finish(); });
})();

/* ──────── NAV TOGGLE ──────── */
document.getElementById('nav-toggle').addEventListener('click', function () {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

/* ──────── SCROLL REVEAL ──────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .stagger');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ──────── BACK TO TOP ──────── */
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  btt.classList.toggle('show', window.scrollY > 400);
});

/* ──────── FORM SUBMIT (UI only) ──────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fa fa-circle-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#34d399,#4f9eff)';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 3000);
}