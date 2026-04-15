import React, { useState, useRef } from 'react';
import s from './CanvasView.module.css';

export function CanvasView({ canvasRef, isRendering, isDone, progress, statusMsg, hasImage, effectId }) {
  const [zoom, setZoom] = useState(100);
  const areaRef = useRef(null);

  const zoomIn  = () => setZoom(z=>Math.min(z+25,400));
  const zoomOut = () => setZoom(z=>Math.max(z-25,25));
  const zoomFit = () => setZoom(100);

  return (
    <div className={s.root}>
      {/* Progress bar */}
      <div className={s.progressBar}>
        <div className={s.progressFill} style={{width:`${progress}%`,opacity:isRendering?1:0}} />
      </div>

      {/* Canvas area */}
      <div className={s.area} ref={areaRef}>

        {/* Empty state */}
        {!hasImage && !isRendering && (
          <div className={s.empty}>
            <div className={s.emptyGrid}>
              {Array.from({length:120}).map((_,i)=>(
                <span key={i} className={s.dot} style={{animationDelay:`${(i*37%200)/100}s`}} />
              ))}
            </div>
            <div className={s.emptyMsg}>
              <div className={s.emptyTitle}>PIXELIUM</div>
              <div className={s.emptyHint}>Upload an image → select an effect → hit generate</div>
              <div className={s.effectCount}>28 effects · 12 color modes · 7 backgrounds</div>
            </div>
          </div>
        )}

        {/* Rendering overlay */}
        {isRendering && (
          <div className={s.overlay}>
            <div className={s.overlaySpinner} />
            <div className={s.overlayPct}>{Math.round(progress)}%</div>
            <div className={s.overlayMsg}>rendering {effectId}</div>
          </div>
        )}

        {/* Canvas */}
        <div className={s.canvasWrap} style={{transform:`scale(${zoom/100})`, transformOrigin:'center center'}}>
          <canvas
            ref={canvasRef}
            className={`${s.canvas} ${isDone?s.canvasVisible:''}`}
          />
        </div>
      </div>

      {/* Status + zoom toolbar */}
      <div className={s.bar}>
        <div className={s.barLeft}>
          <span className={`${s.statusDot} ${isDone?s.dotDone:''} ${isRendering?s.dotActive:''}`} />
          <span className={s.statusMsg}>{statusMsg}</span>
        </div>
        {isDone && (
          <div className={s.zoomRow}>
            <button className={s.zBtn} onClick={zoomOut} title="Zoom out">−</button>
            <button className={s.zLabel} onClick={zoomFit}>{zoom}%</button>
            <button className={s.zBtn} onClick={zoomIn} title="Zoom in">+</button>
          </div>
        )}
      </div>
    </div>
  );
}
