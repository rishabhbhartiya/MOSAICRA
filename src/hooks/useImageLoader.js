import { useState, useRef, useCallback, useEffect } from 'react';

export function useImageLoader() {
  const [imgEl, setImgEl]           = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imgInfo, setImgInfo]       = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError]           = useState(null);
  const prevUrlRef = useRef(null);

  useEffect(() => () => { if(prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current); }, []);

  const loadFile = useCallback((file) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/') ||
      /\.(jpe?g|png|gif|webp|bmp|svg|avif|heic|tiff?)$/i.test(file.name);
    if (!isImage) { setError(`"${file.name}" is not a supported image.`); return; }
    setError(null);
    if (prevUrlRef.current) { URL.revokeObjectURL(prevUrlRef.current); prevUrlRef.current=null; }
    const url = URL.createObjectURL(file);
    prevUrlRef.current = url;
    const img = new Image();
    img.onload = () => {
      setImgEl(img); setPreviewUrl(url);
      setImgInfo({ name:file.name, w:img.naturalWidth, h:img.naturalHeight,
        size: file.size<1024*1024 ? `${(file.size/1024).toFixed(0)}KB` : `${(file.size/1048576).toFixed(1)}MB` });
    };
    img.onerror = () => { URL.revokeObjectURL(url); setError(`Failed to decode "${file.name}".`); };
    img.src = url;
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  }, [loadFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0]; if (file) loadFile(file);
  }, [loadFile]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const reset = useCallback(() => {
    if (prevUrlRef.current) { URL.revokeObjectURL(prevUrlRef.current); prevUrlRef.current=null; }
    setImgEl(null); setPreviewUrl(null); setImgInfo(null); setError(null);
  }, []);

  return { imgEl, previewUrl, imgInfo, isDragging, error, handleFileInput, handleDrop, handleDragOver, handleDragLeave, reset };
}
