export const luma = (r, g, b) => 0.299*r + 0.587*g + 0.114*b;

export function adjustPixel(r, g, b, brightness=0, contrast=0, saturation=0, sharpness=0) {
  // Contrast
  const f = (259*(contrast+255)) / (255*(259-contrast));
  r = f*(r-128)+128; g = f*(g-128)+128; b = f*(b-128)+128;
  // Brightness
  r+=brightness; g+=brightness; b+=brightness;
  // Saturation
  if (saturation !== 0) {
    const l = luma(r,g,b);
    const sat = 1 + saturation/100;
    r = l + (r-l)*sat; g = l + (g-l)*sat; b = l + (b-l)*sat;
  }
  return [Math.max(0,Math.min(255,r)), Math.max(0,Math.min(255,g)), Math.max(0,Math.min(255,b))];
}

export function applyColorMode(r, g, b, mode) {
  switch(mode) {
    case 'mono':    { const l=luma(r,g,b); return [l,l,l]; }
    case 'sepia':   return [Math.min(255,r*.393+g*.769+b*.189), Math.min(255,r*.349+g*.686+b*.168), Math.min(255,r*.272+g*.534+b*.131)];
    case 'invert':  return [255-r,255-g,255-b];
    case 'duotone': { const l=luma(r,g,b)/255; return [10+l*186, 20+l*220, 40+l*56]; }
    case 'thermal': {
      const l=luma(r,g,b)/255;
      if(l<0.25) return [0, l*4*50, 128+l*4*127];
      if(l<0.5)  return [0, 50+(l-.25)*4*205, 255-(l-.25)*4*255];
      if(l<0.75) return [(l-.5)*4*255, 255, 0];
      return [255, 255-(l-.75)*4*255, 0];
    }
    case 'cyberpunk': {
      const l=luma(r,g,b)/255;
      return [Math.min(255,r*0.5+l*196*0.5), Math.min(255,g*0.3+l*255*0.7), Math.min(255,b*1.4)];
    }
    case 'vaporwave': {
      return [Math.min(255,r*0.8+60), Math.min(255,g*0.4+20), Math.min(255,b*1.2+40)];
    }
    case 'matrix': {
      const l=luma(r,g,b);
      return [0, Math.min(255,l*1.4), Math.min(255,l*0.4)];
    }
    case 'redblue': {
      const l=luma(r,g,b);
      return l>128 ? [Math.min(255,l*1.3), 20, 20] : [20, 20, Math.min(255,(255-l)*1.3)];
    }
    case 'gold': {
      const l=luma(r,g,b)/255;
      return [Math.min(255,200+l*55), Math.min(255,140+l*80), Math.min(255,l*60)];
    }
    case 'xray': {
      const l=255-luma(r,g,b);
      return [Math.min(255,l*0.7+80), Math.min(255,l*0.8+90), Math.min(255,l+20)];
    }
    default: return [r,g,b];
  }
}

export function sampleImage(imgEl, tw, th) {
  const off = document.createElement('canvas');
  off.width=tw; off.height=th;
  const ctx = off.getContext('2d');
  ctx.drawImage(imgEl,0,0,tw,th);
  return { data: ctx.getImageData(0,0,tw,th).data, width:tw, height:th };
}

export function getPixelClamped(data, x, y, w, h) {
  const xi=Math.min(w-1,Math.max(0,x|0)), yi=Math.min(h-1,Math.max(0,y|0));
  const i=(yi*w+xi)*4;
  return [data[i],data[i+1],data[i+2],data[i+3]];
}

export function fillBackground(ctx, w, h, bgMode) {
  ctx.clearRect(0,0,w,h);
  if(bgMode==='dark')        { ctx.fillStyle='#080808'; ctx.fillRect(0,0,w,h); }
  else if(bgMode==='light')  { ctx.fillStyle='#f5f2ee'; ctx.fillRect(0,0,w,h); }
  else if(bgMode==='black')  { ctx.fillStyle='#000000'; ctx.fillRect(0,0,w,h); }
  else if(bgMode==='white')  { ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,w,h); }
  else if(bgMode==='paper')  { ctx.fillStyle='#f0e8d8'; ctx.fillRect(0,0,w,h); }
  else if(bgMode==='grid') {
    ctx.fillStyle='#0e0e0e'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1;
    const gs=20;
    for(let x=0;x<w;x+=gs){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=gs){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  }
}

export function computeDims(imgEl, maxSize=1000) {
  const a=imgEl.width/imgEl.height;
  let cw=maxSize, ch=Math.round(maxSize/a);
  if(ch>maxSize){ch=maxSize;cw=Math.round(maxSize*a);}
  return {width:cw,height:ch,aspect:a};
}

export function roundRectPath(ctx,x,y,w,h,r) {
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

export const yieldFrame = () => new Promise(r=>setTimeout(r,0));
export const rgb  = (r,g,b)   => `rgb(${r|0},${g|0},${b|0})`;
export const rgba = (r,g,b,a) => `rgba(${r|0},${g|0},${b|0},${a})`;
