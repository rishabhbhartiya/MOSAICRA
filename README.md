MOSAICRA

# Image Art Studio

Transform any photo into stunning artistic styles: ASCII art, halftone, pointillism, thread art, LEGO mosaics, keyboard mosaics, text fill, pixel art, and Voronoi/crystal effects.

## Features

- **10 artistic effects** — ASCII, Text Fill, Halftone Dots, Halftone Squares, LEGO Mosaic, Keyboard Keys, Thread Art, Pointillism, Pixel Mosaic, Crystal/Voronoi
- **Color modes** — Color, Mono, Sepia, Invert, Duotone, Thermal
- **Background modes** — Dark, Light, Transparent
- **Adjustable controls** — Resolution, Brightness, Contrast
- **Custom text fill** — use any phrase to fill the image silhouette
- **Export** — download as PNG or SVG

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Install & Run

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

Output goes to the `build/` folder.

## Project Structure

```
src/
├── App.jsx                     # Root component
├── App.module.css
├── index.js                    # Entry point
│
├── components/
│   ├── UploadZone.jsx          # Drag-and-drop image uploader
│   ├── UploadZone.module.css
│   ├── EffectPicker.jsx        # Effect selection grid with category tabs
│   ├── EffectPicker.module.css
│   ├── ControlsPanel.jsx       # Sliders, chips, text input
│   ├── ControlsPanel.module.css
│   ├── Sidebar.jsx             # Left panel assembling all controls
│   ├── Sidebar.module.css
│   ├── CanvasView.jsx          # Right canvas preview + status bar
│   └── CanvasView.module.css
│
├── hooks/
│   ├── useImageLoader.js       # File input, drag-drop, object URL lifecycle
│   └── useArtRenderer.js       # Render orchestration, progress, downloads
│
├── utils/
│   ├── effectDefs.js           # Static metadata for all 10 effects
│   ├── effects.js              # All canvas rendering functions
│   └── imageProcessing.js      # Color math, pixel utilities, canvas helpers
│
└── styles/
    └── globals.css             # CSS variables, resets, global typography
```

## Effect Details

| Effect | Description | Best background |
|---|---|---|
| ASCII Art | Maps characters to pixel brightness | Dark |
| Text Fill | Repeating custom text fills the silhouette | Dark |
| Halftone Dots | Dot radius encodes darkness | Light |
| Halftone Squares | Square size encodes darkness | Light |
| LEGO Mosaic | Brick tiles with raised studs | Dark |
| Keyboard Keys | Key-shaped tiles with letter labels | Dark |
| Thread Art | Particle threads trace image contours | Dark |
| Pointillism | Scattered dots of varying size | Light |
| Pixel Mosaic | Classic pixelated block art | Dark |
| Crystal / Voronoi | Stained-glass polygon regions | Dark |

## Tech Stack

- React 18
- CSS Modules
- HTML5 Canvas API (all rendering is pure canvas — no external image libraries)
- Google Fonts: Syne (display) + DM Mono (mono)

## Tips

- **Resolution slider** controls grid density. Lower = chunkier. Higher = finer detail. Not available for Thread Art, Pointillism (they use fixed particle counts).
- **Thread Art** and **Pointillism** are the slowest effects (~2–4s). The render is async and yields frames so the UI stays responsive.
- **Transparent background** exports with a transparent PNG — useful for compositing.
- For **Text Fill**, shorter repeated words (like `LOVE HATE` or `◈`) create interesting rhythm patterns.
