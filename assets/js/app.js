document.documentElement.classList.add('js');
const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
let storedTheme = null;
try { storedTheme = localStorage.getItem('mc-theme'); } catch (e) {}
const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
root.dataset.theme = storedTheme || (preferredDark ? 'dark' : 'light');

themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('mc-theme', root.dataset.theme); } catch (e) {}
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  revealElements.forEach((element) => observer.observe(element));
  setTimeout(() => revealElements.forEach((element) => element.classList.add('visible')), 1200);
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.project-card')];
const search = document.querySelector('#project-search');
const empty = document.querySelector('#empty-state');
let activeFilter = 'all';

function updateProjects() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach((card) => {
    const kindMatches = activeFilter === 'all' || card.dataset.kind === activeFilter;
    const queryMatches = !query || card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
    const show = kindMatches && queryMatches;
    card.hidden = !show;
    if (show) visible += 1;
  });

  empty.hidden = visible !== 0;
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    updateProjects();
  });
});

search.addEventListener('input', updateProjects);
