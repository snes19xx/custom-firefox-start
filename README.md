# Firefox Custom New Tab

This started as a random project when I got bored. This is a custom Firefox new tab page with dynamic backgrounds, weather updates, quick shortcuts, and different layouts. 
It turns the blank new tab into something a bit more useful (and nicer to look at).

## Background Credits
Please check [thorium.rocks](https://thorium.rocks)

### External Background Sources

- **[Sechelt VR Experience](https://thorium.rocks/media/sechelt/)**  
  An immersive VR environment by Thorium Rocks.

- **[WebGL Jellyfish](https://thorium.rocks/media/webgl_jellyfish/)**  
  Interactive 3D jellyfish simulation by Thorium Rocks.

- **[Singing Particles](https://thorium.rocks/media/singing_particles/)**  
  Audio-reactive particle system by Thorium Rocks.

- **[WebGL Galaxy](https://thorium.rocks/media/webgl-galaxy/)**  
  3D galaxy simulation by Thorium Rocks.

### Local Background

- **pstep.gif** — Local file (Please replace it with your own gif)  
  `path to file`


## Features

### Clean, minimal search bar  
### Quick Shortcuts
- Shortcuts I use most often, but you can replace them to your needs

### Weather Display
- Real-time weather via **Open-Meteo API**   
- Day/Night appropriate icons  

### Interactive Controls
- Background interaction mode: press `` ` `` or click "Interact"  
- Auto-refresh for Sechelt background  


## File Structure
firefox-newtab/
├── index.html # Main HTML structure
├── css/
│ └── style.css # Styling and layouts
├── js/
│ ├── script.js # Core logic (search, shortcuts, weather)
│ └── background.js # Backgrounds and interactivity
└── README.md # This documentation

## Installation
1. Place the project folder in a permanent location.  
2. Configure Firefox to use the local HTML file as your new tab page.  
3. Note: Some backgrounds require an internet connection.
> Firefox removed the ability to set the new tab page via `about:config` (specifically the `browser.newtab.url` preference) starting with version 41.  
> See [Mozilla Support](https://support.mozilla.org/en-US/questions/1266777) for more details.
> So please look up how to set it up with mozilla.cfg

### Adding Shortcuts

Edit the `SHORTCUTS` array in `js/script.js`:

```javascript
const SHORTCUTS = [
  { label: "Your Site", href: "https://example.com", icon: "mail" },
  // Add more shortcuts here
];
```
Available Icons:
hat (graduation cap), bar (chart bar), yt (YouTube), term (terminal), mail (envelope)

### Adding Backgrounds
Edit the SOURCES array in js/background.js:

### Weather Location
In js/script.js, update:

### Browser Compatibility
Firefox (primary target)
Should work in other modern browsers


> Feel free to fork and modify for personal use.
> Please respect the licenses of external background sources.

