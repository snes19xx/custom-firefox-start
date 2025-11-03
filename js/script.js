/* ====== Config ====== */
const SEARCH_ENGINE = "https://www.google.com/search?q=";

const SHORTCUTS = [
  { label: "Quercus",   href: "https://q.utoronto.ca/",         icon: "hat" },
  { label: "Acorn",     href: "https://acorn.utoronto.ca/",     icon: "bar"  },
  { label: "YouTube",   href: "https://youtube.com",            icon: "yt"   },
  { label: "Archwiki",  href: "https://wiki.archlinux.org/",    icon: "term" },
  { label: "Outlook",   href: "https://outlook.office.com",     icon: "mail" },
];

/* ====== Search ====== */
const search = document.getElementById("search");
search.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && search.value.trim()) {
    const q = encodeURIComponent(search.value.trim());
    window.location.href = `${SEARCH_ENGINE}${q}`;
  }
});

/* ====== Shortcuts icons ====== */
const icons = {
  hat: `
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path stroke-width="2" d="M12 3l9 4.5-9 4.5-9-4.5z"/>
    <path stroke-width="2" d="M5 9v6c0 3 7 3 7 3s7 0 7-3V9"/>
    <path stroke-width="2" d="M19 10v4"/>
    <circle cx="19" cy="15" r="1" stroke-width="2"/>
  </svg>
  `,
  bar: `
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-width="2" d="M12 2c-2.5 0-4.5 1.5-5.5 3.5S4 10 4 12c0 3 2.5 5 5 5h6c2.5 0 5-2 5-5 0-2-1.5-4.5-2.5-6.5S14.5 2 12 2z"/>
      <path stroke-width="2" d="M12 17v5"/>
      <path stroke-width="2" d="M9 22h6"/>
    </svg>
  `,
  yt: `
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path stroke-width="2" d="M21.8 8s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.9-.9C16.5 5 12 5 12 5h0s-4.5 0-7.1.2c-.4 0-1.2.1-1.9.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.8 1.6.8 2 .9 1.5.1 7 .2 7 .2s4.5 0 7.1-.2c.4 0 1.2-.1 1.9-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2z"/>
    <path stroke-width="2" d="M10 15l5-3-5-3v6z"/>
  </svg>
  `,
  term: `
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-width="2" d="M8 9l3 3-3 3M13 17h4"/>
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" stroke-width="2"/>
    </svg>
  `,
  mail: `
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke-width="2"/>
      <path stroke-width="2" d="M3 7l9 6 9-6"/>
    </svg>
  `
};

const links = document.getElementById("links");
SHORTCUTS.forEach(({label, href, icon}) => {
  const a = document.createElement("a");
  a.className = "link";
  a.href = href;
  a.innerHTML = `${icons[icon] ?? ""}<span>${label}</span>`;
  links.appendChild(a);
});

/* ====== Weather (DAY + NIGHT icons) ====== */
const wxIcons = {
  day: {
    clear:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke-width="2"/><path stroke-width="2" d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>`,
    partly: `<svg viewBox="0 0 24 24"><circle cx="8" cy="10" r="3.5" stroke-width="2"/><path stroke-width="2" d="M14 16h5a3 3 0 0 0 0-6 4.5 4.5 0 0 0-4.6 3.3"/></svg>`,
    cloud:  `<svg viewBox="0 0 24 24"><path stroke-width="2" d="M7 18h9a4 4 0 1 0 0-8 6 6 0 0 0-11.6 2"/></svg>`
  },
  night: {
    clear:  `<svg viewBox="0 0 24 24"><path stroke-width="2" d="M16.8 15.6A7 7 0 0 1 8.4 7.2 6.5 6.5 0 1 0 16.8 15.6z"/></svg>`,
    partly: `<svg viewBox="0 0 24 24"><path stroke-width="2" d="M16.5 13.5A5.5 5.5 0 0 1 11 8a5 5 0 1 0 5.5 5.5z"/><path stroke-width="2" d="M7 18h9a4 4 0 1 0 0-8 6 6 0 0 0-11.6 2"/></svg>`,
    cloud:  `<svg viewBox="0 0 24 24"><path stroke-width="2" d="M7 18h9a4 4 0 1 0 0-8 6 6 0 0 0-11.6 2"/></svg>`
  }
};
function iconForCode(code, isDay) {
  const set = isDay ? wxIcons.day : wxIcons.night;
  if (code === 0) return set.clear;
  if (code === 1 || code === 2) return set.partly;
  return set.cloud;
}
async function loadWeatherByCoords(lat, lon, label = "Downtown Toronto") {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`;
    const wx = await fetch(url).then(r => r.json());
    const t = Math.round(wx.current.temperature_2m);
    const code = wx.current.weather_code;
    const isDay = wx.current.is_day === 1;

    document.getElementById("wx-city").textContent = label;
    document.getElementById("wx-temp").textContent = ` ${t}°`;
    document.getElementById("wx-emoji").innerHTML = iconForCode(code, isDay);
  } catch {
    document.getElementById("wx-city").textContent = "Weather unavailable";
    document.getElementById("wx-temp").textContent = "";
  }
}
loadWeatherByCoords(43.654, -79.383, "Downtown Toronto");