const repository = 'https://github.com/myzticdev/flesh2leather';
const versionPattern = /^Flesh2Leather-(\d+(?:\.(?:\d+|x))*(?:-\d+(?:\.(?:\d+|x))*)?)\.zip$/i;

export function releaseModel(release) {
  if (!release || release.draft || release.prerelease || !release.tag_name || !Array.isArray(release.assets)) throw new Error('Invalid release');
  if (!release.html_url?.startsWith(`${repository}/releases/tag/`)) throw new Error('Invalid release URL');
  const files = release.assets.filter(asset => asset.state === 'uploaded' && asset.browser_download_url?.startsWith(`${repository}/releases/download/`));
  const builds = files.filter(asset => versionPattern.test(asset.name)).map(asset => ({
    name: asset.name,
    version: asset.name.match(versionPattern)[1].replaceAll('-', '–'),
    url: asset.browser_download_url,
    size: `${(asset.size / 1024).toFixed(1)} KiB`,
  })).sort((a, b) => b.version.localeCompare(a.version, 'en', { numeric: true }));
  if (!builds.length) throw new Error('No versioned downloads');
  const date = new Date(release.published_at);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid release date');
  return {
    tag: release.tag_name,
    date: date.toISOString().slice(0, 10),
    dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    url: release.html_url,
    builds,
    bundle: files.find(asset => /-All-Versions\.zip$/i.test(asset.name))?.browser_download_url,
    checksums: files.find(asset => asset.name === 'SHA256SUMS.txt')?.browser_download_url,
  };
}

function renderRelease(container, release) {
  const model = releaseModel(release);
  const rows = model.builds.map(build => {
    const row = document.createElement('tr');
    const version = document.createElement('th');
    version.scope = 'row';
    version.textContent = build.version;
    const size = document.createElement('td');
    size.className = 'download-size';
    size.textContent = build.size;
    const action = document.createElement('td');
    const link = document.createElement('a');
    link.className = 'download-link';
    link.href = build.url;
    link.textContent = 'Download ZIP ↓';
    link.setAttribute('aria-label', `Download Flesh2Leather ${model.tag} for Minecraft ${build.version}`);
    action.append(link);
    row.append(version, size, action);
    return row;
  });
  container.querySelector('[data-release-tag]').textContent = model.tag;
  const date = container.querySelector('[data-release-date]');
  date.dateTime = model.date;
  date.textContent = model.dateLabel;
  container.querySelector('[data-release-notes]').href = model.url;
  container.querySelector('[data-download-rows]').replaceChildren(...rows);
  for (const [selector, url] of [['[data-release-bundle]', model.bundle], ['[data-release-checksums]', model.checksums]]) {
    const link = container.querySelector(selector);
    link.hidden = !url;
    if (url) link.href = url;
    else link.removeAttribute('href');
  }
  container.querySelector('[data-bundle-note]').hidden = !model.bundle;
}

export async function refreshDownloads(container, fetchRelease = fetch) {
  const status = container.querySelector('[data-release-status]');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetchRelease('https://api.github.com/repos/myzticdev/flesh2leather/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal,
    });
    if (!response.ok) throw new Error('Release unavailable');
    renderRelease(container, await response.json());
    status.textContent = 'Latest stable release on GitHub.';
  } catch {
    status.textContent = 'Could not check for updates. Saved release downloads are shown below; check GitHub for newer releases.';
  } finally {
    clearTimeout(timeout);
  }
}

if (typeof document !== 'undefined') {
  const downloads = document.querySelector('[data-release-downloads]');
  if (downloads) refreshDownloads(downloads);
}
