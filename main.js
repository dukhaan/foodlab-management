/* ============================================
   FoodLab Management — Main JS
   GSAP ScrollTrigger + Lenis + Chart.js
   ============================================ */

import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
gsap.registerPlugin(ScrollTrigger);

/* ============ LENIS SMOOTH SCROLL ============ */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ============ SCROLL PROGRESS BAR ============ */
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${progress}%`;
}, { passive: true });

/* ============ HERO PARTICLES ============ */
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${60 + Math.random() * 40}%`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.animationDuration = `${4 + Math.random() * 4}s`;
    particle.style.width = `${2 + Math.random() * 4}px`;
    particle.style.height = particle.style.width;
    particle.style.background = Math.random() > 0.5 ? 'var(--accent-1)' : 'var(--accent-2)';
    container.appendChild(particle);
  }
}
createParticles();

/* ============ STICKY NAVIGATION ============ */
const nav = document.getElementById('main-nav');

ScrollTrigger.create({
  trigger: '#hero',
  start: 'bottom 80px',
  onEnter: () => nav.classList.add('visible'),
  onLeaveBack: () => nav.classList.remove('visible'),
});

/* ============ NAV ACTIVE TRACKING ============ */
const navLinks = document.querySelectorAll('.nav-link');
const sections = ['hero', 'sprint-1', 'charts', 'sprint-2'];

sections.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;

  ScrollTrigger.create({
    trigger: el,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActiveNav(id),
    onEnterBack: () => setActiveNav(id),
  });
});

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === id);
  });
}

// Smooth scroll on nav click
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(link.dataset.section);
    if (target) {
      lenis.scrollTo(target, { offset: -20, duration: 1.5 });
    }
  });
});

/* ============ HERO PARALLAX ============ */
gsap.to('.hero-bg-img', {
  y: 200,
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  },
});

gsap.to('.hero-content', {
  y: 100,
  opacity: 0,
  scrollTrigger: {
    trigger: '#hero',
    start: 'center center',
    end: 'bottom top',
    scrub: 1,
  },
});

/* ============ REVEAL ANIMATIONS ============ */
function initReveals() {
  // Reveal up elements
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Reveal left elements
  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Reveal right elements
  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}
initReveals();

/* ============ CHART.JS ============ */
const chartColors = {
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#f472b6',
  amber: '#fbbf24',
  green: '#22c55e',
  red: '#ef4444',
};

const chartDefaults = {
  color: 'rgba(240,240,245,0.6)',
  borderColor: 'rgba(255,255,255,0.08)',
  font: { family: "'Inter', sans-serif" },
};

Chart.defaults.color = chartDefaults.color;
Chart.defaults.borderColor = chartDefaults.borderColor;
Chart.defaults.font.family = chartDefaults.font.family;

// Complexity Bar Chart
let complexityChartInstance = null;

function initComplexityChart() {
  const ctx = document.getElementById('complexityChart');
  if (!ctx) return;

  complexityChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Email\nVerification',
        'Forgot\nPassword',
        'Version\nCheck',
        'Request\nLogger',
        'Race\nCondition',
        'Server\nSetup',
      ],
      datasets: [
        {
          label: 'Complexity Score',
          data: [7, 6, 4, 5, 9, 8],
          backgroundColor: [
            `${chartColors.purple}cc`,
            `${chartColors.cyan}cc`,
            `${chartColors.green}cc`,
            `${chartColors.amber}cc`,
            `${chartColors.red}cc`,
            `${chartColors.pink}cc`,
          ],
          borderColor: [
            chartColors.purple,
            chartColors.cyan,
            chartColors.green,
            chartColors.amber,
            chartColors.red,
            chartColors.pink,
          ],
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(14, 14, 26, 0.9)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          titleFont: { weight: '600', size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: (ctx) => `Complexity: ${ctx.raw}/10`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, maxRotation: 0 },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { font: { size: 11 }, stepSize: 2 },
          max: 10,
          beginAtZero: true,
        },
      },
    },
  });
}

// Distribution Doughnut Chart
let distributionChartInstance = null;

function initDistributionChart() {
  const ctx = document.getElementById('distributionChart');
  if (!ctx) return;

  distributionChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Authentication', 'DevOps', 'Error Handling', 'Monitoring', 'Versioning'],
      datasets: [
        {
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            `${chartColors.purple}dd`,
            `${chartColors.pink}dd`,
            `${chartColors.red}dd`,
            `${chartColors.amber}dd`,
            `${chartColors.cyan}dd`,
          ],
          borderColor: 'rgba(7,7,13,0.8)',
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      animation: {
        animateRotate: true,
        duration: 1500,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(14, 14, 26, 0.9)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          titleFont: { weight: '600', size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
          },
        },
      },
    },
  });
}

// Trigger chart init when scrolled into view
let chartsInitialized = false;

ScrollTrigger.create({
  trigger: '#charts',
  start: 'top 75%',
  onEnter: () => {
    if (!chartsInitialized) {
      chartsInitialized = true;
      initComplexityChart();
      initDistributionChart();
    }
  },
});

/* ============ DONE ============ */
console.log('🧪 FoodLab Management — Ready');
