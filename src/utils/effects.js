import { luma, adjustPixel, applyColorMode, sampleImage, getPixelClamped, fillBackground, computeDims, roundRectPath, yieldFrame, rgb, rgba } from './imageProcessing';

const ASCII_STD   = '@#S%?*+;:,. ';
const ASCII_DENSE = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>il;:,^`. ';
const BLOCKS      = '█▓▒░▌▐▄▀■□▪▫';
const BRAILLE     = ['⣿','⣷','⣯','⣟','⡿','⢿','⣻','⣽','⣾','⠿','⠻','⠽','⠾','⠷','⠯','⠟','⠛','⠙','⠚','⠘','⠐','⠀'];
const MORSE       = ['●','—','·','–','•','−',' '];
const KEY_LABELS  = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','Esc','Tab','Ctrl','Alt','Fn','⇧','⌫','↵','F1','F2','F3','F4','→','←','↑','↓'];

function px(r,g,b,opts) {
  let [ar,ag,ab] = adjustPixel(r,g,b,opts.brightness,opts.contrast,opts.saturation);
  [ar,ag,ab] = applyColorMode(ar,ag,ab,opts.colorMode);
  return [ar|0,ag|0,ab|0];
}

function setup(canvas, imgEl, opts) {
  const {width:cw,height:ch,aspect} = computeDims(imgEl);
  canvas.width=cw; canvas.height=ch;
  fillBackground(canvas.getContext('2d'),cw,ch,opts.bgMode);
  return {ctx:canvas.getContext('2d'),cw,ch,aspect};
}

// ── ASCII ────────────────────────────────────────────────────
export async function renderAscii(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const chars = opts._denseAscii ? ASCII_DENSE : ASCII_STD;
  const cols=Math.floor(opts.density*1.9), rows=Math.floor(cols/aspect/2.1);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols,cH=ch/rows, fs=Math.max(4,cH*.98);
  ctx.font=`${fs}px 'Space Mono',monospace`; ctx.textBaseline='top';
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b);
      const ci=Math.floor((1-l/255)*(chars.length-1));
      ctx.fillStyle=rgb(r,g,b);
      ctx.fillText(chars[ci],x*cW,y*cH);
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

export async function renderDenseAscii(canvas,imgEl,opts,onP) {
  return renderAscii(canvas,imgEl,{...opts,_denseAscii:true},onP);
}

// ── TEXT FILL ────────────────────────────────────────────────
export async function renderTextFill(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const chars=(opts.fillText||'MOSAICRA').toUpperCase().replace(/\s+/g,' ');
  const cols=Math.floor(opts.density*1.6), rows=Math.floor(cols/aspect/2.1);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols,cH=ch/rows, fs=Math.max(4,cH*.98);
  ctx.font=`bold ${fs}px 'Space Mono',monospace`; ctx.textBaseline='top';
  let ci=0;
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      if(data[i+3]<20) continue;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      if(luma(r,g,b)>245) continue;
      ctx.fillStyle=rgb(r,g,b);
      ctx.fillText(chars[ci++%chars.length],x*cW,y*cH);
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── BRAILLE ──────────────────────────────────────────────────
export async function renderBraille(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.floor(opts.density*1.8), rows=Math.floor(cols/aspect/2.0);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols,cH=ch/rows, fs=Math.max(5,cH);
  ctx.font=`${fs}px monospace`; ctx.textBaseline='top';
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b);
      const ci=Math.floor((1-l/255)*(BRAILLE.length-1));
      ctx.fillStyle=rgb(r,g,b);
      ctx.fillText(BRAILLE[ci],x*cW,y*cH);
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── BLOCKS ───────────────────────────────────────────────────
export async function renderBlocks(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.floor(opts.density*1.4), rows=Math.floor(cols/aspect/1.9);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols,cH=ch/rows, fs=Math.max(5,cH);
  ctx.font=`${fs}px 'Space Mono',monospace`; ctx.textBaseline='top';
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b)/255;
      ctx.fillStyle=rgb(r,g,b);
      ctx.fillText(BLOCKS[Math.floor(l*(BLOCKS.length-1))],x*cW,y*cH);
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── MORSE ────────────────────────────────────────────────────
export async function renderMorse(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.floor(opts.density*2.2), rows=Math.floor(cols/aspect/2.2);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols,cH=ch/rows, fs=Math.max(4,cH*.9);
  ctx.font=`${fs}px 'Space Mono',monospace`; ctx.textBaseline='middle';
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b)/255;
      const ci=Math.floor((1-l)*(MORSE.length-1));
      ctx.fillStyle=rgb(r,g,b);
      ctx.fillText(MORSE[ci],x*cW+cW/2,y*cH+cH/2);
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── HALFTONE DOT ─────────────────────────────────────────────
export async function renderHalftoneDot(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=opts.density, rows=Math.floor(opts.density/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols,cH=ch/rows;
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b);
      const rad=(1-l/255)*cW*.54;
      if(rad<0.3) continue;
      ctx.fillStyle=rgb(r,g,b);
      if(opts.dotShape==='diamond'){
        ctx.save(); ctx.translate(x*cW+cW/2,y*cH+cH/2); ctx.rotate(Math.PI/4);
        ctx.fillRect(-rad,-rad,rad*2,rad*2); ctx.restore();
      } else if(opts.dotShape==='star'){
        drawStar(ctx,x*cW+cW/2,y*cH+cH/2,rad,5);
        ctx.fillStyle=rgb(r,g,b); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(x*cW+cW/2,y*cH+cH/2,rad,0,Math.PI*2); ctx.fill();
      }
    }
    if(y%10===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

function drawStar(ctx,cx,cy,r,n){
  ctx.beginPath();
  for(let i=0;i<n*2;i++){
    const angle=i*Math.PI/n - Math.PI/2;
    const radius=i%2===0?r:r*0.4;
    i===0?ctx.moveTo(cx+radius*Math.cos(angle),cy+radius*Math.sin(angle)):ctx.lineTo(cx+radius*Math.cos(angle),cy+radius*Math.sin(angle));
  }
  ctx.closePath();
}

// ── HALFTONE SQUARE ───────────────────────────────────────────
export async function renderHalftoneSquare(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=opts.density, rows=Math.floor(opts.density/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols,cH=ch/rows;
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b);
      const sz=(1-l/255)*cW*.94;
      if(sz<0.3) continue;
      ctx.fillStyle=rgb(r,g,b);
      ctx.fillRect(x*cW+(cW-sz)/2,y*cH+(cH-sz)/2,sz,sz);
    }
    if(y%10===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── HEX GRID ─────────────────────────────────────────────────
export async function renderHexGrid(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=opts.density, rows=Math.floor(opts.density/aspect*.6);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols, cH=ch/rows;
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b);
      const hexR=(1-l/255)*cW*.55;
      if(hexR<0.4) continue;
      const cx=x*cW+cW/2+(y%2?cW/2:0), cy=y*cH+cH/2;
      ctx.beginPath();
      for(let k=0;k<6;k++){
        const a=k*Math.PI/3-Math.PI/6;
        k===0?ctx.moveTo(cx+hexR*Math.cos(a),cy+hexR*Math.sin(a)):ctx.lineTo(cx+hexR*Math.cos(a),cy+hexR*Math.sin(a));
      }
      ctx.closePath();
      ctx.fillStyle=rgb(r,g,b); ctx.fill();
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── RINGS ─────────────────────────────────────────────────────
export async function renderRings(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.floor(opts.density*.6), rows=Math.floor(cols/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols,cH=ch/rows;
  ctx.lineWidth=0.8;
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b)/255;
      const maxR=Math.min(cW,cH)*.48;
      const rings=Math.max(1,Math.floor((1-l)*4));
      for(let rr=1;rr<=rings;rr++){
        const rad=(rr/rings)*maxR*(1-l*.5);
        ctx.beginPath();
        ctx.arc(x*cW+cW/2,y*cH+cH/2,rad,0,Math.PI*2);
        ctx.strokeStyle=rgba(r,g,b,0.8);
        ctx.stroke();
      }
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── STIPPLE ───────────────────────────────────────────────────
export async function renderStipple(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(opts.density*2,400), sH=Math.round(sW/aspect);
  const {data}=sampleImage(imgEl,sW,sH);
  const scX=cw/sW, scY=ch/sH;
  for(let y=0;y<sH;y++){
    for(let x=0;x<sW;x++){
      const i=(y*sW+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b)/255;
      const n=Math.floor((1-l)*7);
      ctx.fillStyle=rgb(r,g,b);
      for(let d=0;d<n;d++){
        ctx.beginPath();
        ctx.arc(x*scX+Math.random()*scX,y*scY+Math.random()*scY,0.4+Math.random()*.8,0,Math.PI*2);
        ctx.fill();
      }
    }
    if(y%12===0){onP(Math.round(y/sH*95));await yieldFrame();}
  }
  onP(100);
}

// ── CROSSHATCH ───────────────────────────────────────────────
export async function renderCrosshatch(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(opts.density*2,300), sH=Math.round(sW/aspect);
  const {data}=sampleImage(imgEl,sW,sH);
  const scX=cw/sW, scY=ch/sH;
  ctx.lineCap='round';
  const cs=Math.max(2,cw/sW);
  for(let y=0;y<sH;y++){
    for(let x=0;x<sW;x++){
      const i=(y*sW+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const l=luma(r,g,b)/255;
      const cx=x*scX+scX/2, cy=y*scY+scY/2, h=cs*.52;
      ctx.strokeStyle=rgba(r,g,b,0.85); ctx.lineWidth=Math.max(.4,cs*.12);
      if(l<.88){ctx.beginPath();ctx.moveTo(cx-h,cy);ctx.lineTo(cx+h,cy);ctx.stroke();}
      if(l<.66){ctx.beginPath();ctx.moveTo(cx,cy-h);ctx.lineTo(cx,cy+h);ctx.stroke();}
      if(l<.44){ctx.beginPath();ctx.moveTo(cx-h,cy+h);ctx.lineTo(cx+h,cy-h);ctx.stroke();}
      if(l<.22){ctx.beginPath();ctx.moveTo(cx-h,cy-h);ctx.lineTo(cx+h,cy+h);ctx.stroke();}
    }
    if(y%10===0){onP(Math.round(y/sH*95));await yieldFrame();}
  }
  onP(100);
}

// ── PIXEL MOSAIC ─────────────────────────────────────────────
export async function renderPixel(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.min(opts.density,130), rows=Math.floor(cols/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols, cH=ch/rows;
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      ctx.fillStyle=rgb(r,g,b);
      ctx.fillRect(x*cW+.5,y*cH+.5,cW-1,cH-1);
    }
    if(y%10===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── LEGO ─────────────────────────────────────────────────────
export async function renderLego(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.min(Math.floor(opts.density*.65),90), rows=Math.floor(cols/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols, cH=ch/rows;
  ctx.fillStyle=opts.bgMode==='light'?'#bbb':'#1a1a1a';
  ctx.fillRect(0,0,cw,ch);
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const x0=x*cW+1.5,y0=y*cH+1.5,w=cW-3,h=cH-3;
      ctx.fillStyle=rgb(r,g,b); roundRectPath(ctx,x0,y0,w,h,2.5); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.13)'; roundRectPath(ctx,x0,y0,w,h*.42,2.5); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.18)'; roundRectPath(ctx,x0,y0+h*.6,w,h*.38,2.5); ctx.fill();
      const sR=Math.min(w,h)*.28;
      ctx.beginPath(); ctx.arc(x0+w/2,y0+h/2,sR,0,Math.PI*2);
      ctx.fillStyle=rgb(Math.min(255,r*1.3|0),Math.min(255,g*1.3|0),Math.min(255,b*1.3|0)); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=.5; ctx.stroke();
    }
    if(y%6===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── KEYBOARD ─────────────────────────────────────────────────
export async function renderKeyboard(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.min(Math.floor(opts.density*.55),60), rows=Math.floor(cols/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols, cH=ch/rows;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const x0=x*cW+1.5,y0=y*cH+1.5,w=cW-3,h=cH-3;
      ctx.fillStyle=rgb(r,g,b); roundRectPath(ctx,x0,y0,w,h,Math.min(3,w*.18)); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.12)'; roundRectPath(ctx,x0,y0,w,h*.38,Math.min(3,w*.18)); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.09)'; ctx.lineWidth=.5;
      roundRectPath(ctx,x0+.5,y0+.5,w-1,h-1,Math.min(2.5,w*.16)); ctx.stroke();
      const l=luma(r,g,b);
      ctx.fillStyle=l>130?'rgba(0,0,0,0.38)':'rgba(255,255,255,0.36)';
      ctx.font=`500 ${Math.max(5,h*.36)}px 'Space Mono',monospace`;
      ctx.fillText(KEY_LABELS[(x+y*cols)%KEY_LABELS.length],x0+w/2,y0+h/2+.5);
    }
    if(y%4===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  ctx.textAlign='left'; onP(100);
}

// ── MINECRAFT ────────────────────────────────────────────────
export async function renderMinecraft(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.min(Math.floor(opts.density*.5),64), rows=Math.floor(cols/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols, cH=ch/rows;
  ctx.fillStyle=opts.bgMode==='light'?'#b0b0b0':'#181818'; ctx.fillRect(0,0,cw,ch);
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const x0=x*cW,y0=y*cH;
      ctx.fillStyle=rgb(r,g,b); ctx.fillRect(x0+1,y0+1,cW-2,cH-2);
      const lr=Math.min(255,r*1.35|0),lg=Math.min(255,g*1.35|0),lb=Math.min(255,b*1.35|0);
      ctx.fillStyle=rgb(lr,lg,lb);
      ctx.fillRect(x0+1,y0+1,cW-2,Math.max(1,cH*.13));
      ctx.fillRect(x0+1,y0+1,Math.max(1,cW*.13),cH-2);
      const dr=r*.5|0,dg=g*.5|0,db=b*.5|0;
      ctx.fillStyle=rgb(dr,dg,db);
      ctx.fillRect(x0+1,y0+cH-1-Math.max(1,cH*.13),cW-2,Math.max(1,cH*.13));
      ctx.fillRect(x0+cW-1-Math.max(1,cW*.13),y0+1,Math.max(1,cW*.13),cH-2);
    }
    if(y%5===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── CERAMIC TILES ────────────────────────────────────────────
export async function renderTiles(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=Math.min(opts.density,100), rows=Math.floor(cols/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols, cH=ch/rows;
  ctx.fillStyle=opts.bgMode==='light'?'#ccc':'#222'; ctx.fillRect(0,0,cw,ch);
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const x0=x*cW+1,y0=y*cH+1,w=cW-2,h=cH-2;
      ctx.fillStyle=rgb(r,g,b); roundRectPath(ctx,x0,y0,w,h,1.5); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=.5;
      roundRectPath(ctx,x0,y0,w,h*.3,1.5); ctx.stroke();
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── CIRCLE MOSAIC ────────────────────────────────────────────
export async function renderCircles(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const cols=opts.density, rows=Math.floor(opts.density/aspect);
  const {data}=sampleImage(imgEl,cols,rows);
  const cW=cw/cols, cH=ch/rows;
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      ctx.beginPath();
      ctx.arc(x*cW+cW/2,y*cH+cH/2,Math.min(cW,cH)*.46,0,Math.PI*2);
      ctx.fillStyle=rgb(r,g,b); ctx.fill();
    }
    if(y%8===0){onP(Math.round(y/rows*95));await yieldFrame();}
  }
  onP(100);
}

// ── POINTILLISM ───────────────────────────────────────────────
export async function renderPointillism(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(350,imgEl.width), sH=Math.round(sW/aspect);
  const {data}=sampleImage(imgEl,sW,sH);
  const scX=cw/sW, scY=ch/sH, N=28000;
  for(let i=0;i<N;i++){
    const px2=Math.random()*sW, py2=Math.random()*sH;
    const di=(Math.min(sH-1,py2|0)*sW+Math.min(sW-1,px2|0))*4;
    const [r,g,b]=px(data[di],data[di+1],data[di+2],opts);
    const l=luma(r,g,b);
    ctx.beginPath();
    ctx.arc(px2*scX+(Math.random()-.5)*3,py2*scY+(Math.random()-.5)*3,(1-l/255)*5+.4,0,Math.PI*2);
    ctx.fillStyle=rgba(r,g,b,.82); ctx.fill();
    if(i%1200===0){onP(Math.round(i/N*95));await yieldFrame();}
  }
  onP(100);
}

// ── OIL PAINT ────────────────────────────────────────────────
export async function renderOil(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(opts.density*3,500), sH=Math.round(sW/aspect);
  const {data}=sampleImage(imgEl,sW,sH);
  const scX=cw/sW, scY=ch/sH, N=16000;
  for(let s=0;s<N;s++){
    const px2=Math.random()*sW, py2=Math.random()*sH;
    const di=(Math.min(sH-1,py2|0)*sW+Math.min(sW-1,px2|0))*4;
    const [r,g,b]=px(data[di],data[di+1],data[di+2],opts);
    const l=luma(r,g,b)/255;
    const size=(.6+(1-l)*2.4)*scX*1.2;
    const angle=Math.random()*Math.PI;
    const elong=1.6+Math.random()*2;
    ctx.save(); ctx.translate(px2*scX,py2*scY); ctx.rotate(angle); ctx.scale(elong,1);
    ctx.beginPath(); ctx.ellipse(0,0,size,size/2,0,0,Math.PI*2);
    ctx.fillStyle=rgba(r,g,b,.55+Math.random()*.3); ctx.fill(); ctx.restore();
    if(s%1000===0){onP(Math.round(s/N*95));await yieldFrame();}
  }
  onP(100);
}

// ── WATERCOLOR ───────────────────────────────────────────────
export async function renderWatercolor(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(opts.density*2,400), sH=Math.round(sW/aspect);
  const {data}=sampleImage(imgEl,sW,sH);
  const scX=cw/sW, scY=ch/sH, N=20000;
  // Multiple translucent passes
  for(let pass=0;pass<3;pass++){
    for(let s=0;s<N/3;s++){
      const px2=Math.random()*sW, py2=Math.random()*sH;
      const di=(Math.min(sH-1,py2|0)*sW+Math.min(sW-1,px2|0))*4;
      const [r,g,b]=px(data[di],data[di+1],data[di+2],opts);
      const spread=4+Math.random()*12;
      const grad=ctx.createRadialGradient(px2*scX,py2*scY,0,px2*scX,py2*scY,spread*scX);
      grad.addColorStop(0,rgba(r,g,b,.18+pass*.06));
      grad.addColorStop(1,rgba(r,g,b,0));
      ctx.beginPath();
      ctx.arc(px2*scX+(Math.random()-.5)*6,py2*scY+(Math.random()-.5)*6,spread*scX,0,Math.PI*2);
      ctx.fillStyle=grad; ctx.fill();
    }
    onP(20+pass*25); await yieldFrame();
  }
  onP(100);
}

// ── LOW POLY ─────────────────────────────────────────────────
export async function renderTriangles(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(opts.density,200), sH=Math.round(sW/aspect);
  const {data}=sampleImage(imgEl,sW,sH);
  const cW=cw/sW, cH=ch/sH;
  const sample=(sx,sy)=>{
    const xi=Math.min(sW-1,Math.max(0,sx)), yi=Math.min(sH-1,Math.max(0,sy));
    const i=(yi*sW+xi)*4;
    const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
    return [r,g,b];
  };
  for(let y=0;y<sH-1;y++){
    for(let x=0;x<sW-1;x++){
      const jx=Math.random()*.5,jy=Math.random()*.5;
      const ax=(x+jx)*cW,ay=(y+jy)*cH;
      const bx=(x+1)*cW,by=y*cH;
      const cx2=(x+1)*cW,cy2=(y+1)*cH;
      const dx=x*cW,dy=(y+1)*cH;
      const [r1,g1,b1]=sample(x,y);
      ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.lineTo(dx,dy); ctx.closePath();
      ctx.fillStyle=rgb(r1,g1,b1); ctx.fill();
      ctx.strokeStyle=rgba(r1,g1,b1,.4); ctx.lineWidth=.3; ctx.stroke();
      const [r2,g2,b2]=sample(x+1,y+1);
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(cx2,cy2); ctx.lineTo(dx,dy); ctx.closePath();
      ctx.fillStyle=rgb(r2,g2,b2); ctx.fill();
      ctx.strokeStyle=rgba(r2,g2,b2,.4); ctx.stroke();
    }
    if(y%10===0){onP(Math.round(y/sH*95));await yieldFrame();}
  }
  onP(100);
}

// ── VORONOI ───────────────────────────────────────────────────
export async function renderVoronoi(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(300,imgEl.width), sH=Math.round(sW/aspect);
  const {data}=sampleImage(imgEl,sW,sH);
  const N=Math.floor(opts.density*4.5);
  const pts=Array.from({length:N},()=>({x:Math.random()*cw,y:Math.random()*ch}));
  const STEP=4;
  for(let cy2=0;cy2<ch;cy2+=STEP){
    for(let cx2=0;cx2<cw;cx2+=STEP){
      let ni=0,nd=Infinity;
      for(let k=0;k<N;k++){const dx=pts[k].x-cx2,dy=pts[k].y-cy2,d=dx*dx+dy*dy;if(d<nd){nd=d;ni=k;}}
      const sx=Math.min(sW-1,Math.floor((pts[ni].x/cw)*sW));
      const sy=Math.min(sH-1,Math.floor((pts[ni].y/ch)*sH));
      const i=(sy*sW+sx)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      ctx.fillStyle=rgb(r,g,b); ctx.fillRect(cx2,cy2,STEP,STEP);
    }
    if(cy2%40===0){onP(Math.round(cy2/ch*95));await yieldFrame();}
  }
  onP(100);
}

// ── NEON EDGES ────────────────────────────────────────────────
export async function renderNeon(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(600,imgEl.width), sH=Math.round(sW/aspect);
  const {data,width:w,height:h}=sampleImage(imgEl,sW,sH);
  const scX=cw/w, scY=ch/h;
  ctx.fillStyle='#000'; ctx.fillRect(0,0,cw,ch);
  onP(15); await yieldFrame();
  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const idx=(r,c)=>(r*w+c)*4;
      const gl=(r,c)=>luma(data[idx(r,c)],data[idx(r,c)+1],data[idx(r,c)+2]);
      const gx=-gl(y-1,x-1)+gl(y-1,x+1)-2*gl(y,x-1)+2*gl(y,x+1)-gl(y+1,x-1)+gl(y+1,x+1);
      const gy=-gl(y-1,x-1)-2*gl(y-1,x)-gl(y-1,x+1)+gl(y+1,x-1)+2*gl(y+1,x)+gl(y+1,x+1);
      const mag=Math.min(255,Math.sqrt(gx*gx+gy*gy));
      if(mag<16) continue;
      const i=(y*w+x)*4;
      const [r,g,b]=px(data[i],data[i+1],data[i+2],opts);
      const al=Math.min(1,mag/100);
      const px2=x*scX, py2=y*scY;
      ctx.beginPath(); ctx.arc(px2,py2,scX*1.9,0,Math.PI*2);
      ctx.fillStyle=rgba(r,g,b,al*.16); ctx.fill();
      ctx.beginPath(); ctx.arc(px2,py2,scX*.85,0,Math.PI*2);
      ctx.fillStyle=rgba(r,g,b,al*.55); ctx.fill();
      ctx.beginPath(); ctx.arc(px2,py2,scX*.22,0,Math.PI*2);
      ctx.fillStyle=rgba(Math.min(255,r+80)|0,Math.min(255,g+80)|0,Math.min(255,b+80)|0,al); ctx.fill();
    }
    if(y%20===0){onP(15+Math.round(y/h*80));await yieldFrame();}
  }
  onP(100);
}

// ── THREAD ART ───────────────────────────────────────────────
export async function renderThread(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  const sW=Math.min(500,imgEl.width), sH=Math.round(sW/aspect);
  const {data}=sampleImage(imgEl,sW,sH);
  const scX=cw/sW, scY=ch/sH;
  const N=opts.threadCount||12000;
  const sp=(x,y)=>{
    const [r,g,b]=getPixelClamped(data,x,y,sW,sH);
    const [ar,ag,ab]=adjustPixel(r,g,b,opts.brightness,opts.contrast);
    return {r:ar,g:ag,b:ab,l:luma(ar,ag,ab)};
  };
  for(let p=0;p<N;p++){
    let px2=Math.random()*sW, py2=Math.random()*sH;
    const pix=sp(px2,py2);
    if(pix.l>228) continue;
    const [cr,cg,cb]=applyColorMode(pix.r,pix.g,pix.b,opts.colorMode);
    ctx.beginPath(); ctx.moveTo(px2*scX,py2*scY);
    ctx.strokeStyle=rgba(cr|0,cg|0,cb|0,Math.max(.04,(1-pix.l/255)*.7));
    ctx.lineWidth=.5+Math.random()*.5;
    const steps=6+(Math.random()*16|0);
    for(let s=0;s<steps;s++){
      const nx=px2+(Math.random()-.5)*8,ny=py2+(Math.random()-.5)*8;
      const np=sp(nx,ny);
      if(np.l<pix.l+50){px2=nx;py2=ny;ctx.lineTo(px2*scX,py2*scY);}
    }
    ctx.stroke();
    if(p%600===0){onP(Math.round(p/N*95));await yieldFrame();}
  }
  onP(100);
}

// ── GLITCH ───────────────────────────────────────────────────
export async function renderGlitch(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch}=setup(canvas,imgEl,opts);
  ctx.drawImage(imgEl,0,0,cw,ch);
  onP(20); await yieldFrame();
  const amount=(opts.glitchAmt||40)/100;
  const slices=Math.floor(20+amount*60);
  for(let i=0;i<slices;i++){
    const y=Math.random()*ch;
    const h2=Math.random()*ch*.08+2;
    const shift=(Math.random()-.5)*cw*amount*.3;
    const imgData=ctx.getImageData(0,y,cw,h2);
    // RGB channel offset
    const d=imgData.data;
    const offset=Math.floor(Math.random()*20*amount);
    for(let p=0;p<d.length;p+=4){
      if(Math.random()<.5){d[p]=d[Math.min(d.length-4,p+offset*4)]||d[p];}
      else {d[p+2]=d[Math.max(0,p-offset*4)+2]||d[p+2];}
    }
    ctx.putImageData(imgData,shift,y);
    if(i%5===0){onP(20+Math.round(i/slices*70));await yieldFrame();}
  }
  // scanlines overlay
  ctx.fillStyle='rgba(0,0,0,0.06)';
  for(let y=0;y<ch;y+=2){ctx.fillRect(0,y,cw,1);}
  // color fringe
  ctx.globalCompositeOperation='screen';
  ctx.fillStyle=`rgba(255,0,100,0.08)`;
  ctx.fillRect(Math.random()*20-10,0,cw,ch);
  ctx.fillStyle=`rgba(0,255,200,0.08)`;
  ctx.fillRect(Math.random()*20-10,0,cw,ch);
  ctx.globalCompositeOperation='source-over';
  onP(100);
}

// ── SCAN LINES ───────────────────────────────────────────────
export async function renderScanlines(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch}=setup(canvas,imgEl,opts);
  ctx.drawImage(imgEl,0,0,cw,ch);
  onP(40); await yieldFrame();
  const gap=Math.max(2,opts.scanGap||4);
  // Apply color mode tint
  if(opts.colorMode!=='color'){
    const id=ctx.getImageData(0,0,cw,ch);
    for(let i=0;i<id.data.length;i+=4){
      let [r,g,b]=applyColorMode(id.data[i],id.data[i+1],id.data[i+2],opts.colorMode);
      id.data[i]=r; id.data[i+1]=g; id.data[i+2]=b;
    }
    ctx.putImageData(id,0,0);
  }
  ctx.fillStyle='rgba(0,0,0,0.45)';
  for(let y=0;y<ch;y+=gap){ctx.fillRect(0,y,cw,Math.ceil(gap*.5));}
  // vignette
  const vg=ctx.createRadialGradient(cw/2,ch/2,ch*.2,cw/2,ch/2,ch*.85);
  vg.addColorStop(0,'transparent'); vg.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=vg; ctx.fillRect(0,0,cw,ch);
  onP(100);
}

// ── BLUEPRINT ────────────────────────────────────────────────
export async function renderBlueprint(canvas,imgEl,opts,onP) {
  const {ctx,cw,ch,aspect}=setup(canvas,imgEl,opts);
  // Blueprint blue background
  ctx.fillStyle='#0a1628'; ctx.fillRect(0,0,cw,ch);
  // Grid
  ctx.strokeStyle='rgba(100,180,255,0.12)'; ctx.lineWidth=.5;
  const gs=20;
  for(let x=0;x<cw;x+=gs){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,ch);ctx.stroke();}
  for(let y=0;y<ch;y+=gs){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(cw,y);ctx.stroke();}
  onP(10); await yieldFrame();

  const sW=Math.min(opts.density*2,400), sH=Math.round(sW/aspect);
  const {data,width:w,height:h}=sampleImage(imgEl,sW,sH);
  const scX=cw/w, scY=ch/h;
  // Sobel edges only, render as blueprint lines
  ctx.strokeStyle='rgba(140,210,255,0.9)'; ctx.lineWidth=.6;
  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const idx=(r,c)=>(r*w+c)*4;
      const gl=(r,c)=>luma(data[idx(r,c)],data[idx(r,c)+1],data[idx(r,c)+2]);
      const gx=-gl(y-1,x-1)+gl(y-1,x+1)-2*gl(y,x-1)+2*gl(y,x+1)-gl(y+1,x-1)+gl(y+1,x+1);
      const gy=-gl(y-1,x-1)-2*gl(y-1,x)-gl(y-1,x+1)+gl(y+1,x-1)+2*gl(y+1,x)+gl(y+1,x+1);
      const mag=Math.min(255,Math.sqrt(gx*gx+gy*gy));
      if(mag<20) continue;
      const al=Math.min(1,mag/90);
      ctx.strokeStyle=rgba(140,210,255,al*.9);
      ctx.beginPath();
      ctx.arc(x*scX,y*scY,scX*.35,0,Math.PI*2);
      ctx.stroke();
    }
    if(y%20===0){onP(10+Math.round(y/h*85));await yieldFrame();}
  }
  // Dimension marks
  ctx.strokeStyle='rgba(100,200,255,0.3)'; ctx.lineWidth=.5;
  for(let i=0;i<6;i++){
    const rx=Math.random()*cw*.8+cw*.1, ry=Math.random()*ch*.8+ch*.1, rw=Math.random()*80+30;
    ctx.beginPath(); ctx.moveTo(rx-rw/2,ry); ctx.lineTo(rx+rw/2,ry);
    ctx.moveTo(rx-rw/2,ry-4); ctx.lineTo(rx-rw/2,ry+4);
    ctx.moveTo(rx+rw/2,ry-4); ctx.lineTo(rx+rw/2,ry+4); ctx.stroke();
  }
  onP(100);
}

// ── REGISTRY ─────────────────────────────────────────────────
export const RENDERERS = {
  ascii:        renderAscii,
  ascii_dense:  renderDenseAscii,
  textfill:     renderTextFill,
  braille:      renderBraille,
  blocks:       renderBlocks,
  morse:        renderMorse,
  halftone_dot: renderHalftoneDot,
  halftone_sq:  renderHalftoneSquare,
  halftone_hex: renderHexGrid,
  halftone_ring:renderRings,
  stipple:      renderStipple,
  crosshatch:   renderCrosshatch,
  pixel:        renderPixel,
  lego:         renderLego,
  keyboard:     renderKeyboard,
  minecraft:    renderMinecraft,
  tiles:        renderTiles,
  circles:      renderCircles,
  pointillism:  renderPointillism,
  oil:          renderOil,
  watercolor:   renderWatercolor,
  triangles:    renderTriangles,
  voronoi:      renderVoronoi,
  neon:         renderNeon,
  thread:       renderThread,
  glitch:       renderGlitch,
  scanlines:    renderScanlines,
  blueprint:    renderBlueprint,
};
