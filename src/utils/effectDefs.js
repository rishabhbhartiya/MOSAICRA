export const EFFECTS = [
  // ── TEXT ──
  { id:'ascii',        label:'ASCII',           category:'text',      icon:'A',  desc:'Classic character brightness mapping',       hasDensity:true  },
  { id:'ascii_dense',  label:'Dense ASCII',     category:'text',      icon:'Ä',  desc:'Ultra-fine character grid',                  hasDensity:true  },
  { id:'textfill',     label:'Text Fill',       category:'text',      icon:'T',  desc:'Your phrase fills the silhouette',           hasDensity:true,  hasTextInput:true },
  { id:'braille',      label:'Braille',         category:'text',      icon:'⣿',  desc:'Braille dot patterns',                       hasDensity:true  },
  { id:'blocks',       label:'Block Chars',     category:'text',      icon:'█',  desc:'Unicode block characters ▓▒░',               hasDensity:true  },
  { id:'morse',        label:'Morse Code',      category:'text',      icon:'—',  desc:'Dots and dashes trace the image',            hasDensity:true  },

  // ── HALFTONE ──
  { id:'halftone_dot', label:'Halftone Dots',   category:'halftone',  icon:'●',  desc:'Classic dot radius halftone',                hasDensity:true  },
  { id:'halftone_sq',  label:'Halftone Squares',category:'halftone',  icon:'■',  desc:'Square size encodes darkness',               hasDensity:true  },
  { id:'halftone_hex', label:'Hex Grid',        category:'halftone',  icon:'⬡',  desc:'Hexagonal halftone cells',                   hasDensity:true  },
  { id:'halftone_ring',label:'Rings',           category:'halftone',  icon:'◎',  desc:'Concentric ring density',                    hasDensity:true  },
  { id:'stipple',      label:'Stipple',         category:'halftone',  icon:'∶',  desc:'Fine engraving dot stipple',                 hasDensity:true  },
  { id:'crosshatch',   label:'Crosshatch',      category:'halftone',  icon:'╳',  desc:'Multi-layer ink hatching',                   hasDensity:true  },

  // ── MOSAIC ──
  { id:'pixel',        label:'Pixel Mosaic',    category:'mosaic',    icon:'▦',  desc:'Classic pixelated blocks',                   hasDensity:true  },
  { id:'lego',         label:'LEGO',            category:'mosaic',    icon:'⬤',  desc:'Brick tiles with raised studs',              hasDensity:true  },
  { id:'keyboard',     label:'Keyboard',        category:'mosaic',    icon:'⌨',  desc:'Key-shaped tiles with labels',               hasDensity:true  },
  { id:'minecraft',    label:'Minecraft',       category:'mosaic',    icon:'⬛',  desc:'Chunky blocks with bevel lighting',          hasDensity:true  },
  { id:'tiles',        label:'Ceramic Tiles',   category:'mosaic',    icon:'◻',  desc:'Square tiles with grout lines',              hasDensity:true  },
  { id:'circles',      label:'Circle Mosaic',   category:'mosaic',    icon:'○',  desc:'Circular tiles on a grid',                   hasDensity:true  },

  // ── PAINTERLY ──
  { id:'pointillism',  label:'Pointillism',     category:'painterly', icon:'·',  desc:'Scattered dots of varying size',             hasDensity:false },
  { id:'oil',          label:'Oil Paint',       category:'painterly', icon:'🖌',  desc:'Rotated brushstroke ellipses',               hasDensity:true  },
  { id:'watercolor',   label:'Watercolor',      category:'painterly', icon:'💧',  desc:'Soft layered wash effect',                   hasDensity:true  },
  { id:'triangles',    label:'Low Poly',        category:'painterly', icon:'△',  desc:'Triangle tessellation',                      hasDensity:true  },
  { id:'voronoi',      label:'Crystal',         category:'painterly', icon:'◈',  desc:'Stained-glass Voronoi regions',              hasDensity:true  },

  // ── GLITCH / FX ──
  { id:'neon',         label:'Neon Edges',      category:'glitch',    icon:'⚡',  desc:'Sobel edge glow on black',                   hasDensity:false },
  { id:'thread',       label:'Thread Art',      category:'glitch',    icon:'∿',  desc:'Particle threads trace contours',            hasDensity:false },
  { id:'glitch',       label:'Glitch',          category:'glitch',    icon:'Ɋ',  desc:'RGB channel shift & scan lines',             hasDensity:true  },
  { id:'scanlines',    label:'Scan Lines',      category:'glitch',    icon:'≡',  desc:'CRT monitor scan line overlay',              hasDensity:true  },
  { id:'blueprint',    label:'Blueprint',       category:'glitch',    icon:'⊞',  desc:'Technical drawing on cyan grid',             hasDensity:true  },
];

export const CATEGORIES = [
  { id:'all',       label:'All',       count: null },
  { id:'text',      label:'Text',      count: null },
  { id:'halftone',  label:'Halftone',  count: null },
  { id:'mosaic',    label:'Mosaic',    count: null },
  { id:'painterly', label:'Painterly', count: null },
  { id:'glitch',    label:'Glitch',    count: null },
];

export const COLOR_MODES = [
  { id:'color',     label:'Color',      group:'natural'  },
  { id:'mono',      label:'Mono',       group:'natural'  },
  { id:'sepia',     label:'Sepia',      group:'natural'  },
  { id:'invert',    label:'Invert',     group:'natural'  },
  { id:'duotone',   label:'Duotone',    group:'tinted'   },
  { id:'thermal',   label:'Thermal',    group:'tinted'   },
  { id:'cyberpunk', label:'Cyberpunk',  group:'tinted'   },
  { id:'vaporwave', label:'Vaporwave',  group:'tinted'   },
  { id:'matrix',    label:'Matrix',     group:'tinted'   },
  { id:'redblue',   label:'Red/Blue',   group:'tinted'   },
  { id:'gold',      label:'Gold',       group:'tinted'   },
  { id:'xray',      label:'X-Ray',      group:'tinted'   },
];

export const BG_MODES = [
  { id:'dark',        label:'Dark'        },
  { id:'black',       label:'Black'       },
  { id:'light',       label:'Light'       },
  { id:'white',       label:'White'       },
  { id:'paper',       label:'Paper'       },
  { id:'grid',        label:'Grid'        },
  { id:'transparent', label:'Alpha'       },
];

export const DEFAULT_SETTINGS = {
  density:    80,
  brightness: 0,
  contrast:   0,
  saturation: 0,
  opacity:    100,
  scale:      100,
  colorMode:  'color',
  bgMode:     'dark',
  fillText:   'PIXELIUM ART STUDIO CREATE',
  // per-effect extras
  dotShape:   'circle',   // circle | diamond | star
  glitchAmt:  40,
  scanGap:    4,
  threadCount:10000,
};
