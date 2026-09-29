const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
let savedTheme;
try { savedTheme = localStorage.getItem('mc-theme'); } catch {}

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101112' : '#f5f5f3');
}

applyTheme(['dark', 'light'].includes(savedTheme) ? savedTheme : 'dark');
if (themeToggle) themeToggle.hidden = false;
themeToggle?.addEventListener('click', () => {
  savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(savedTheme);
  try { localStorage.setItem('mc-theme', savedTheme); } catch {}
});


const catalog = document.querySelector('.catalog-section');
if (catalog) {
  document.querySelectorAll('[data-catalog-control]').forEach(control => { control.hidden = false; });
  const search = document.querySelector('#project-search');
  const sort = document.querySelector('#project-sort');
  const grid = document.querySelector('.project-grid');
  const cards = [...grid.querySelectorAll('.project-entry')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const names = { all: 'All projects', datapacks: 'Datapacks', plugins: 'Plugins', mods: 'Mods', 'resource-packs': 'Resource packs' };
  let category = 'all';
  const initialQuery = new URLSearchParams(window.location.search).get('q');
  if (initialQuery) search.value = initialQuery;
  filters.forEach(button => {
    const count = cards.filter(card => button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter).length;
    button.querySelector('.count').textContent = count;
  });
  function updateCatalog() {
    const query = search.value.trim().toLowerCase();
    const ordered = [...cards].sort((a, b) => sort.value === 'name'
      ? a.dataset.name.localeCompare(b.dataset.name)
      : b.dataset.date.localeCompare(a.dataset.date));
    let count = 0;
    ordered.forEach(card => {
      card.hidden = !((category === 'all' || card.dataset.category === category) && card.textContent.toLowerCase().includes(query));
      if (!card.hidden) count++;
      grid.append(card);
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    document.querySelector('#category-title').textContent = names[category];
    document.querySelector('#result-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
    document.querySelector('#empty-state').hidden = count !== 0;
    document.querySelector('#empty-message').textContent = !query && !cards.some(card => card.dataset.category === category)
      ? `No ${names[category].toLowerCase()} released yet. Check back as the collection grows.`
      : 'Try another search or project type.';
  }
  search.addEventListener('input', updateCatalog);
  sort.addEventListener('change', updateCatalog);
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; updateCatalog(); }));
  document.querySelector('#reset-filters').addEventListener('click', () => { category = 'all'; search.value = ''; updateCatalog(); search.focus(); });
  document.querySelector('.search').addEventListener('submit', event => { event.preventDefault(); catalog.scrollIntoView(); });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) && !event.target.isContentEditable) {
      event.preventDefault(); search.focus();
    }
  });
  updateCatalog();
}
