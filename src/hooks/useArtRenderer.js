import { useState, useRef, useCallback } from 'react';
import { RENDERERS } from '../utils/effects';

export function useArtRenderer() {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress]       = useState(0);
  const [statusMsg, setStatusMsg]     = useState('Upload an image to begin');
  const [isDone, setIsDone]           = useState(false);
  const canvasRef = useRef(null);
  const cancelRef = useRef(false);

  const render = useCallback(async (imgEl, effectId, options) => {
    if (!imgEl || !canvasRef.current) return;
    const fn = RENDERERS[effectId];
    if (!fn) return;
    cancelRef.current = false;
    setIsRendering(true); setIsDone(false); setProgress(0);
    setStatusMsg(`Rendering ${effectId}…`);
    const t0 = performance.now();
    try {
      await fn(canvasRef.current, imgEl, options, (p) => { if(!cancelRef.current) setProgress(p); });
      if (!cancelRef.current) {
        const ms = performance.now()-t0;
        const {width:w,height:h} = canvasRef.current;
        setStatusMsg(`${w}×${h}  ·  ${(ms/1000).toFixed(1)}s  ·  ${effectId}`);
        setIsDone(true); setProgress(100);
      }
    } catch(e) {
      setStatusMsg(`Error: ${e.message}`);
    } finally {
      setIsRendering(false);
    }
  }, []);

  const cancel = useCallback(() => { cancelRef.current=true; setIsRendering(false); setStatusMsg('Cancelled'); }, []);

  const downloadPng = useCallback((name) => {
    if (!canvasRef.current||!isDone) return;
    const a=document.createElement('a'); a.href=canvasRef.current.toDataURL('image/png');
    a.download=`MOSAICRA-${name}.png`; a.click();
  }, [isDone]);

  const downloadSvg = useCallback((name) => {
    if (!canvasRef.current||!isDone) return;
    const {width:w,height:h}=canvasRef.current;
    const data=canvasRef.current.toDataURL('image/png');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><image href="${data}" width="${w}" height="${h}"/></svg>`;
    const blob=new Blob([svg],{type:'image/svg+xml'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download=`MOSAICRA-${name}.svg`; a.click(); URL.revokeObjectURL(a.href);
  }, [isDone]);

  return { canvasRef, isRendering, progress, statusMsg, isDone, render, cancel, downloadPng, downloadSvg };
}
