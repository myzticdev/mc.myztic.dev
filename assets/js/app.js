const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme;
try { savedTheme = localStorage.getItem('mc-theme'); } catch {}

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#191b18' : '#f3f1e9');
}

applyTheme(['dark', 'light'].includes(savedTheme) ? savedTheme : (systemTheme.matches ? 'dark' : 'light'));
if (themeToggle) themeToggle.hidden = false;
themeToggle?.addEventListener('click', () => {
  savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(savedTheme);
  try { localStorage.setItem('mc-theme', savedTheme); } catch {}
});
systemTheme.addEventListener('change', event => {
  if (!['dark', 'light'].includes(savedTheme)) applyTheme(event.matches ? 'dark' : 'light');
});
