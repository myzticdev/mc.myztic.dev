import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../assets/js/releases.js', import.meta.url), 'utf8');
const { releaseModel, refreshDownloads } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const base = 'https://github.com/myzticdev/flesh2leather/releases';
const asset = (name, url = `${base}/download/v2.0.0/${name}`) => ({name, browser_download_url:url, size:1024, state:'uploaded'});
const release = {
  tag_name:'v2.0.0', published_at:'2026-09-22T02:45:05Z', html_url:`${base}/tag/v2.0.0`,
  assets:[asset('Flesh2Leather-1.9.x.zip'),asset('Flesh2Leather-1.20.2-26.3.zip'),asset('Flesh2Leather-1.13.x.zip'),asset('Flesh2Leather-myzticdev-All-Versions.zip'),asset('SHA256SUMS.txt')],
};

test('separates pack version, game versions, bundle and checksums; sorts numerically', () => {
  const model=releaseModel(release);
  assert.equal(model.tag,'v2.0.0');
  assert.deepEqual(model.builds.map(b=>b.version),['1.20.2–26.3','1.13.x','1.9.x']);
  assert.equal(model.builds[0].size,'1.0 KiB');
  assert.equal(model.date,'2026-09-22');
  assert.match(model.bundle,/All-Versions.zip$/);
  assert.match(model.checksums,/SHA256SUMS.txt$/);
});

test('rejects drafts, previews, malformed releases and foreign download URLs', () => {
  for (const override of [{draft:true},{prerelease:true},{assets:[]},{published_at:'invalid'},{html_url:'https://example.com'},{assets:[asset('Flesh2Leather-1.13.x.zip','https://example.com/file.zip')]}]) {
    assert.throws(()=>releaseModel({...release,...override}));
  }
});

test('missing optional bundle and checksums are allowed', () => {
  const model=releaseModel({...release,assets:[release.assets[0]]});
  assert.equal(model.bundle,undefined);
  assert.equal(model.checksums,undefined);
});

test('HTTP, network and invalid-data failures preserve saved downloads', async () => {
  for (const fetcher of [async()=>({ok:false}),async()=>{throw Error('offline');},async()=>({ok:true,json:async()=>({})})]) {
    const status={textContent:''};
    const container={querySelector(selector){ assert.equal(selector,'[data-release-status]'); return status; }};
    await refreshDownloads(container,fetcher);
    assert.match(status.textContent,/Saved release downloads/);
  }
});

test('successful refresh replaces rows and hides missing optional assets', async () => {
  class Element {
    constructor(){this.children=[];this.attributes={};}
    append(...children){this.children.push(...children);}
    replaceChildren(...children){this.children=children;}
    setAttribute(name,value){this.attributes[name]=value;}
    removeAttribute(name){delete this[name];}
  }
  const nodes=new Map();
  const container={querySelector(selector){if(!nodes.has(selector))nodes.set(selector,new Element());return nodes.get(selector);}};
  globalThis.document={createElement:()=>new Element()};
  try {
    await refreshDownloads(container,async()=>({ok:true,json:async()=>({...release,assets:release.assets.slice(0,3)})}));
    assert.equal(nodes.get('[data-release-tag]').textContent,'v2.0.0');
    const rows=nodes.get('[data-download-rows]').children;
    assert.equal(rows.length,3);
    assert.equal(rows[0].children[0].textContent,'1.20.2–26.3');
    assert.equal(rows[0].children[2].children[0].href,release.assets[1].browser_download_url);
    assert.match(rows[0].children[2].children[0].attributes['aria-label'],/v2.0.0/);
    assert.equal(nodes.get('[data-release-bundle]').hidden,true);
    assert.equal(nodes.get('[data-bundle-note]').hidden,true);
    assert.equal(nodes.get('[data-release-checksums]').hidden,true);
    assert.match(nodes.get('[data-release-status]').textContent,/Latest stable/);
  } finally { delete globalThis.document; }
});
