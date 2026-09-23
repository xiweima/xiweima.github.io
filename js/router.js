// Simple hash-based router for Xiwei Ma artist website

import { content } from './content.js';

let currentLang = localStorage.getItem('lang') || 'en';

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  render();
}

export function t() {
  return content[currentLang];
}

export function getProjects() {
  return t().projects;
}

export function getProjectById(id) {
  return t().projects.find(p => p.id === id);
}

export function navigate(path) {
  window.location.hash = path;
}

function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

export function render() {
  const route = getRoute();
  const app = document.getElementById('app');
  const c = t();

  // Parse route
  const parts = route.split('/').filter(Boolean);

  let pageHTML;
  if (parts.length === 0) {
    pageHTML = renderHome(c);
  } else if (parts[0] === 'work' && parts.length === 1) {
    pageHTML = renderWork(c);
  } else if (parts[0] === 'work' && parts.length === 2) {
    pageHTML = renderProjectDetail(c, parts[1]);
  } else if (parts[0] === 'acting' && parts.length === 1) {
    pageHTML = renderActing(c);
  } else if (parts[0] === 'practice' && parts.length === 1) {
    pageHTML = renderPractice(c);
  } else if (parts[0] === 'facilitation' && parts.length === 1) {
    pageHTML = renderFacilitation(c);
  } else if (parts[0] === 'about' && parts.length === 1) {
    pageHTML = renderAbout(c);
  } else {
    pageHTML = renderHome(c);
  }

  app.innerHTML = pageHTML;
  bindEvents();
  observeFadeIns();
  window.scrollTo(0, 0);
}

function navHTML(c) {
  const lang = getLang();
  return `
    <nav class="nav" id="nav">
      <div class="nav-inner">
        <div class="nav-logo" data-nav="/">XIWEI MA</div>
        <ul class="nav-links" id="navLinks">
          <li><span class="nav-link" data-nav="/work">${c.nav.work}</span></li>
          <li><span class="nav-link" data-nav="/acting">${c.nav.acting}</span></li>
          <li><span class="nav-link" data-nav="/practice">${c.nav.practice}</span></li>
          <li><span class="nav-link" data-nav="/facilitation">${c.nav.facilitation}</span></li>
          <li><span class="nav-link" data-nav="/about">${c.nav.about}</span></li>
        </ul>
        <div class="nav-right">
          <div class="lang-switch">
            <span class="${lang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
            <span>/</span>
            <span class="${lang === 'zh' ? 'active' : ''}" data-lang="zh">繁體中文</span>
          </div>
          <button class="nav-toggle" id="navToggle">&#9776;</button>
        </div>
      </div>
    </nav>
  `;
}

function footerHTML(c) {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-col">
            <h4>${c.footer.name}</h4>
            <p>${c.footer.role}</p>
            <p style="font-style:italic;color:var(--text-light);margin-top:8px;font-size:0.8rem;">${c.footer.placeholderNote}</p>
          </div>
          <div class="footer-col">
            <h4>${c.footer.nav}</h4>
            <a data-nav="/work">${c.nav.work}</a>
            <a data-nav="/acting">${c.nav.acting}</a>
            <a data-nav="/practice">${c.nav.practice}</a>
            <a data-nav="/facilitation">${c.nav.facilitation}</a>
            <a data-nav="/about">${c.nav.about}</a>
          </div>
          <div class="footer-col">
            <h4>${c.footer.contact}</h4>
            <a href="mailto:${c.about.contact.email}">${c.about.contact.email}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${c.footer.name}</span>
          <span>${c.footer.rights}</span>
        </div>
      </div>
    </footer>
  `;
}

function renderHome(c) {
  const projects = c.projects.map((p, i) => `
    <div class="project-item fade-in" data-nav="/work/${p.id}">
      <div class="project-image">
        <img src="https://images.pexels.com/photos/${getProjectImage(p.id)}?auto=compress&cs=tinysrgb&w=900" alt="${p.title}" loading="lazy" />
      </div>
      <div class="project-info">
        <div class="project-year">${p.year}</div>
        <h3 class="project-title" style="--hover-color:${p.accent}">${p.title}</h3>
        <div class="project-role">${p.role}</div>
        <p class="project-desc">${p.desc}</p>
      </div>
    </div>
  `).join('');

  const themes = c.themes.map(theme => `
    <div class="theme-card fade-in">
      <h3 class="theme-name">${theme.name}</h3>
      <p class="theme-desc">${theme.desc}</p>
    </div>
  `).join('');

  return `
    ${navHTML(c)}
    <section class="hero">
      <img class="hero-image" src="https://images.pexels.com/photos/1620464/pexels-photo-1620464.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Xiwei Ma" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">${c.hero.name}</h1>
        <div class="hero-subtitle">${c.hero.subtitle}</div>
      </div>
    </section>

    <section class="section container">
      <div class="section-header fade-in">
        <div class="section-label">${c.home.selectedWork}</div>
        <h2 class="section-title">${c.nav.work}</h2>
      </div>
      <div class="project-list">
        ${projects}
      </div>
    </section>

    <section class="section container" style="background:var(--bg-alt);">
      <div class="section-header fade-in" style="padding-left:calc(var(--space)*6);padding-right:calc(var(--space)*6);">
        <div class="section-label">${c.home.practiceLabel}</div>
        <h2 class="section-title">${c.home.practiceTitle}</h2>
      </div>
      <div class="practice-grid" style="padding:0 calc(var(--space)*6);">
        ${themes}
      </div>
    </section>

    <section class="section container">
      <div class="about-preview fade-in">
        <div>
          <img src="https://images.pexels.com/photos/3752834/pexels-photo-3752834.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Xiwei Ma" style="border-radius:2px;" />
        </div>
        <div class="about-text">
          <span class="label">${c.home.aboutLabel}</span>
          <h2 style="font-size:clamp(1.8rem,3vw,2.5rem);font-weight:300;margin-bottom:calc(var(--space)*4);">${c.home.aboutTitle}</h2>
          <p>${c.home.aboutText}</p>
          <span class="nav-link" data-nav="/about" style="display:inline-block;margin-top:calc(var(--space)*2);">${c.home.viewMore} &rarr;</span>
        </div>
      </div>
    </section>

    ${footerHTML(c)}
  `;
}

function renderWork(c) {
  const projects = c.projects.map(p => `
    <div class="project-item fade-in" data-nav="/work/${p.id}">
      <div class="project-image">
        <img src="https://images.pexels.com/photos/${getProjectImage(p.id)}?auto=compress&cs=tinysrgb&w=900" alt="${p.title}" loading="lazy" />
      </div>
      <div class="project-info">
        <div class="project-year">${p.year}</div>
        <h3 class="project-title">${p.title}</h3>
        <div class="project-role">${p.role}</div>
        <p class="project-desc">${p.desc}</p>
      </div>
    </div>
  `).join('');

  return `
    ${navHTML(c)}
    <div class="container">
      <div class="page-header fade-in">
        <span class="label">${c.nav.work}</span>
        <h1>${c.nav.work}</h1>
      </div>
      <section class="section" style="padding-top:0;">
        <div class="project-list">
          ${projects}
        </div>
      </section>
    </div>
    ${footerHTML(c)}
  `;
}

function renderProjectDetail(c, id) {
  const p = c.projects.find(x => x.id === id);
  if (!p) return renderWork(c);

  const otherLang = getLang() === 'en' ? 'zh' : 'en';
  const backLabel = c.common.backToWork;

  return `
    ${navHTML(c)}
    <div class="container project-detail">
      <span class="back-link" data-nav="/work">&larr; ${backLabel}</span>
      <div class="project-detail-header fade-in">
        <div class="project-year" style="margin-bottom:calc(var(--space)*3);color:${p.accent};">${p.year}</div>
        <h1 class="project-detail-title">${p.title}</h1>
        <div class="project-detail-meta">
          <div class="meta-item">
            <span class="label">${getLang() === 'en' ? 'Role' : '角色'}</span>
            <span class="value">${p.role}</span>
          </div>
        </div>
      </div>
      <div class="project-detail-body fade-in">
        <div>
          <span class="label" style="margin-bottom:calc(var(--space)*3);display:block;">${getLang() === 'en' ? 'About' : '關於'}</span>
          ${p.venues ? `<div style="margin-bottom:calc(var(--space)*4);"><span class="label" style="display:block;margin-bottom:calc(var(--space)*2);">${getLang() === 'en' ? 'Venues' : '演出場地'}</span><ul style="list-style:none;padding:0;">${p.venues.map(v => `<li style="font-size:0.9rem;color:var(--text-muted);padding:4px 0;">${v}</li>`).join('')}</ul></div>` : ''}
        </div>
        <div>
          <p>${p.desc}</p>
          <div class="placeholder mt-8">${c.common.infoPending}</div>
        </div>
      </div>
      <div class="project-detail-images fade-in">
        <img src="https://images.pexels.com/photos/${getProjectImage(p.id)}?auto=compress&cs=tinysrgb&w=1400" alt="${p.title}" />
      </div>
    </div>
    ${footerHTML(c)}
  `;
}

function renderActing(c) {
  const items = c.acting.map(item => `
    <div class="acting-card fade-in" data-nav="/work/${item.id}">
      <div class="project-image">
        <img src="https://images.pexels.com/photos/${getProjectImage(item.id)}?auto=compress&cs=tinysrgb&w=700" alt="${item.title}" loading="lazy" />
      </div>
      <div class="project-year">${item.year}</div>
      <h3 class="project-title" style="margin-top:calc(var(--space)*2);">${item.title}</h3>
      <div class="project-role">${item.role}</div>
      <p class="project-desc">${item.desc}</p>
    </div>
  `).join('');

  return `
    ${navHTML(c)}
    <div class="container">
      <div class="page-header fade-in">
        <span class="label">${c.nav.acting}</span>
        <h1>${c.nav.acting}</h1>
      </div>
      <section class="section" style="padding-top:0;">
        <div class="acting-list">
          ${items}
        </div>
      </section>
    </div>
    ${footerHTML(c)}
  `;
}

function renderPractice(c) {
  const themes = c.themes.map(theme => `
    <div class="theme-card fade-in">
      <h3 class="theme-name">${theme.name}</h3>
      <p class="theme-desc">${theme.desc}</p>
    </div>
  `).join('');

  const statementLabel = getLang() === 'en' ? 'Artist Statement' : '藝術家自述';

  return `
    ${navHTML(c)}
    <div class="container">
      <div class="page-header fade-in">
        <span class="label">${c.nav.practice}</span>
        <h1>${c.nav.practice}</h1>
      </div>
      <section class="section" style="padding-top:0;">
        <div style="max-width:620px;margin:0 auto calc(var(--space)*12);text-align:center;" class="fade-in">
          <span class="label" style="display:block;margin-bottom:calc(var(--space)*4);">${statementLabel}</span>
          <p style="font-family:var(--serif);font-size:1.4rem;line-height:1.6;font-weight:300;">${c.about.statement.split('\n\n')[0]}</p>
        </div>
        <div class="practice-grid">
          ${themes}
        </div>
      </section>
    </div>
    ${footerHTML(c)}
  `;
}

function renderFacilitation(c) {
  const items = c.facilitation.map(item => `
    <div class="facil-item fade-in">
      <div class="facil-year">${item.year}</div>
      <div>
        <h3 class="facil-title">${item.title}</h3>
        <p class="facil-desc">${item.desc}</p>
      </div>
    </div>
  `).join('');

  return `
    ${navHTML(c)}
    <div class="container">
      <div class="page-header fade-in">
        <span class="label">${c.nav.facilitation}</span>
        <h1>${c.nav.facilitation}</h1>
      </div>
      <section class="section" style="padding-top:0;">
        ${items}
      </section>
    </div>
    ${footerHTML(c)}
  `;
}

function renderAbout(c) {
  const statementParas = c.about.statement.split('\n\n').map(p => `<p>${p}</p>`).join('');

  return `
    ${navHTML(c)}
    <div class="container" style="padding-top:calc(var(--space)*20);">
      <div class="about-page">
        <div class="about-page-sticky fade-in">
          <img src="https://images.pexels.com/photos/3752834/pexels-photo-3752834.jpeg?auto=compress&cs=tinysrgb&w=500" alt="Xiwei Ma" />
          <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:calc(var(--space)*3);">${c.about.bio}</p>
          <div>
            <span class="label" style="display:block;margin-bottom:calc(var(--space)*2);">${c.about.sections.contact}</span>
            <a href="mailto:${c.about.contact.email}" style="font-size:0.9rem;">${c.about.contact.email}</a>
          </div>
        </div>
        <div class="about-content fade-in">
          <h2>${c.about.sections.background}</h2>
          <p>${c.about.bio}</p>
          <h2>${getLang() === 'en' ? 'Artist Statement' : '藝術家自述'}</h2>
          ${statementParas}
          <h2>${c.about.sections.cv}</h2>
          <ul class="cv-list">
            ${c.about.cv.map(item => `<li><span class="cv-year">${item.year}</span><span>${item.text}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
    ${footerHTML(c)}
  `;
}

function getProjectImage(id) {
  const images = {
    'heart-orchestra': '1620464/pexels-photo-1620464.jpeg',
    'mister-black': '2167673/pexels-photo-2167673.jpeg'
  };
  return images[id] || '1620464/pexels-photo-1620464.jpeg';
}

function bindEvents() {
  // Navigation clicks
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const path = el.getAttribute('data-nav');
      if (path) navigate(path);
    });
  });

  // Language switch
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.addEventListener('click', () => {
      setLang(el.getAttribute('data-lang'));
    });
  });

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Nav scroll effect
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Set active nav link
  const route = getRoute();
  const routeBase = route.split('/')[1] || '';
  document.querySelectorAll('.nav-link').forEach(link => {
    const navPath = link.getAttribute('data-nav');
    if (navPath && navPath === '/' + routeBase) {
      link.classList.add('active');
    }
  });
}

function observeFadeIns() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
