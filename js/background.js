/* ====== Background chooser ====== */
const SOURCES = [
  { key: 'sechelt',    type: 'site',  url: 'https://thorium.rocks/media/sechelt/' },
  { key: 'pstep',      type: 'image', url: 'C:\\Users\\snes\\Pictures\\Wallpapers\\firefox\\pstep.gif' },
  { key: 'jellyfish',  type: 'site',  url: 'https://thorium.rocks/media/webgl_jellyfish/jellyfish.html' },
  { key: 'particles',  type: 'site',  url: 'https://thorium.rocks/media/singing_particles/singing-particles.html' },
  { key: 'galaxy',     type: 'site',  url: 'https://thorium.rocks/media/webgl-galaxy/' }
];

function toFileUrlMaybe(path){
  if (/^[a-zA-Z]:\\/.test(path)) return 'file:///' + path.replace(/\\/g,'/');
  return path;
}
function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

let currentBgKey = null;
let refreshTimer = null;

function scheduleSecheltRefresh(){
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    if (!document.body.classList.contains('bg-interact')) {
      window.location.reload();
    } else {
      scheduleSecheltRefresh();
    }
  }, 44000);
}

const bgImage = document.getElementById('bgImage');

/* ===== particles side-link helpers ===== */
let sideLeft = null, sideRight = null;
const linkMap = {};
function cacheLinks() {
  [...document.querySelectorAll('#links .link')].forEach(a => {
    linkMap[a.textContent.trim()] = a;
  });
}
cacheLinks();

function ensureSideContainers(){
  if (!sideLeft){
    sideLeft = document.createElement('div');
    sideLeft.id = 'leftLinks'; sideLeft.className = 'side-links left';
    document.body.appendChild(sideLeft);
  }
  if (!sideRight){
    sideRight = document.createElement('div');
    sideRight.id = 'rightLinks'; sideRight.className = 'side-links right';
    document.body.appendChild(sideRight);
  }
}

/* ===== GALAXY: orbit layer helpers ===== */
let orbitLayer = null;
function ensureOrbitLayer(){
  if (!orbitLayer){
    orbitLayer = document.createElement('div');
    orbitLayer.className = 'gx-orbits';
    document.body.appendChild(orbitLayer);
  }
}
function clearOrbitLayer(){
  if (orbitLayer){ orbitLayer.replaceChildren(); }
}

/* ===== Layout toggles ===== */
function enterParticlesLayout(){
  document.body.classList.add('layout-particles','theme-piplup');
  const sWrap = document.querySelector('.searchWrap');
  if (sWrap) sWrap.style.display = 'none';
  ensureSideContainers();

  // Move links: left = Acorn, Quercus. right = Outlook, Archwiki. Hide YouTube.
  const acorn   = linkMap['Acorn'];
  const quercus = linkMap['Quercus'];
  const outlook = linkMap['Outlook'];
  const arch    = linkMap['Archwiki'];
  const yt      = linkMap['YouTube'];

  sideLeft.replaceChildren();
  sideRight.replaceChildren();

  if (acorn)   sideLeft.appendChild(acorn);
  if (quercus) sideLeft.appendChild(quercus);
  if (outlook) sideRight.appendChild(outlook);
  if (arch)    sideRight.appendChild(arch);
  if (yt) yt.style.display = 'none';

  const linksBar = document.getElementById('links');
  if (linksBar) linksBar.style.display = 'none';
}

function exitParticlesLayout(){
  document.body.classList.remove('layout-particles');
  const linksBar = document.getElementById('links');
  if (linksBar){
    ['Quercus','Acorn','YouTube','Archwiki','Outlook'].forEach(name => {
      const el = linkMap[name];
      if (el) { linksBar.appendChild(el); el.style.display = ''; }
    });
    linksBar.style.display = '';
  }
  if (sideLeft){ sideLeft.remove(); sideLeft = null; }
  if (sideRight){ sideRight.remove(); sideRight = null; }
}

/* === GALAXY layout (floating/orbiting links) === */
function enterGalaxyLayout(){
  document.body.classList.add('layout-galaxy','theme-piplup');
  const sWrap = document.querySelector('.searchWrap');
  if (sWrap) sWrap.style.display = 'none';

  ensureOrbitLayer();
  clearOrbitLayer();

  // Hide the normal row
  const linksBar = document.getElementById('links');
  if (linksBar) linksBar.style.display = 'none';

  // Orbit ALL five links (YouTube included)
  const order     = ['Acorn','Quercus','YouTube','Outlook','Archwiki'];
  const radii     = ['160px','210px','260px','310px','360px'];
  const durations = ['30s','36s','42s','48s','54s'];
  const starts    = ['10deg','120deg','200deg','280deg','330deg'];

  order.forEach((name, i) => {
    const el = linkMap[name];
    if (!el) return;
    orbitLayer.appendChild(el);
    el.style.setProperty('--r',   radii[i]);
    el.style.setProperty('--dur', durations[i]);
    el.style.setProperty('--start', starts[i]);
    el.style.display = ''; // ensure visible
  });
}

function exitGalaxyLayout(){
  document.body.classList.remove('layout-galaxy');
  const linksBar = document.getElementById('links');
  if (linksBar){
    ['Quercus','Acorn','YouTube','Archwiki','Outlook'].forEach(name => {
      const el = linkMap[name];
      if (el) { linksBar.appendChild(el); el.style.display = ''; el.style.removeProperty('--r'); el.style.removeProperty('--dur'); el.style.removeProperty('--start'); }
    });
    linksBar.style.display = '';
  }
  if (orbitLayer){ orbitLayer.remove(); orbitLayer = null; }
}

/* ===== applyBackground ===== */
function applyBackground(src){
  const bgSite  = document.getElementById('bgSite');
  const wrap    = document.getElementById('bgWrap');
  const cover   = document.querySelector('.bg-cover');
  const enter   = document.getElementById('bg-enter');
  const exit    = document.getElementById('bg-exit');
  const sWrap   = document.querySelector('.searchWrap');

  currentBgKey = src.key;
  clearTimeout(refreshTimer);

  // reset visual modes
  document.body.classList.remove('bg-interact');
  document.body.classList.remove('theme-piplup');
  exit.style.display = 'none';
  exitParticlesLayout(); // if leaving particles
  exitGalaxyLayout();    // if leaving galaxy

  // defaults
  cover.style.display = 'none';
  enter.style.display = 'none';
  enter.classList.remove('right');
  if (sWrap) sWrap.style.display = '';  // show search by default

  // clear layers
  bgImage.style.backgroundImage = 'none';
  bgImage.style.filter = '';
  wrap.style.backgroundImage = 'none';
  bgSite.style.display = 'block';
  bgSite.removeAttribute('src');

  if (src.type === 'image') {
    // pstep.gif (Piplup) -> image layer with reduced luminosity
    const url = toFileUrlMaybe(src.url);
    bgSite.style.display = 'none';
    bgImage.style.backgroundImage = `url("${url}")`;
    bgImage.style.filter = 'brightness(0.75)';   // ~20% dimmer
    document.body.classList.add('theme-piplup');
    return;
  }

  // site in iframe
  bgSite.src = src.url;

  if (src.key === 'jellyfish') {
    enter.classList.add('right');
    enter.style.display = 'inline-block';
    return;
  }

  if (src.key === 'particles') {
    enter.classList.add('right');
    enter.style.display = 'inline-block';
    enterParticlesLayout();       // particles-only layout
    return;
  }

  if (src.key === 'galaxy') {
    // No interact button; galaxy layout + theme
    enterGalaxyLayout();
    return;
  }

  if (src.key === 'sechelt') {
    cover.style.display = 'block';
    enter.style.display = 'inline-block';
    scheduleSecheltRefresh();
  }
}

// Pick and apply one on load
applyBackground(pickRandom(SOURCES));

/* ====== Background Interaction Toggle ====== */
const enterBtn = document.getElementById('bg-enter');
const exitBtn  = document.getElementById('bg-exit');

function enterBackgroundMode() {
  document.body.classList.add('bg-interact');
  enterBtn.style.display = 'none';
  exitBtn.style.display  = 'inline-block';
  if (currentBgKey === 'sechelt') clearTimeout(refreshTimer);
}
function exitBackgroundMode() {
  document.body.classList.remove('bg-interact');
  exitBtn.style.display  = 'none';
  if (currentBgKey === 'jellyfish' || currentBgKey === 'particles') {
    enterBtn.classList.add('right');
    enterBtn.style.display = 'inline-block';
  } else if (currentBgKey === 'sechelt') {
    enterBtn.classList.remove('right');
    enterBtn.style.display = 'inline-block';
    scheduleSecheltRefresh();
  }
}

enterBtn.addEventListener('click', enterBackgroundMode);
exitBtn.addEventListener('click', exitBackgroundMode);

// Keyboard shortcuts: ` toggles, Esc exits
document.addEventListener('keydown', (e) => {
  if (e.key === '`') {
    if (document.body.classList.contains('bg-interact')) {
      exitBackgroundMode();
    } else if (enterBtn.style.display !== 'none') {
      enterBackgroundMode();
    }
  }
  if (e.key === 'Escape') exitBackgroundMode();
});