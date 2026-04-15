import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { CanvasView } from './components/CanvasView';
import { useImageLoader } from './hooks/useImageLoader';
import { useArtRenderer } from './hooks/useArtRenderer';
import { DEFAULT_SETTINGS } from './utils/effectDefs';
import './styles/globals.css';
import s from './App.module.css';

export default function App() {
  const [effectId, setEffectId] = useState('ascii');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const {
    imgEl, previewUrl, imgInfo, isDragging, error: uploadError,
    handleFileInput, handleDrop, handleDragOver, handleDragLeave, reset,
  } = useImageLoader();

  const {
    canvasRef, isRendering, progress, statusMsg, isDone,
    render, downloadPng, downloadSvg,
  } = useArtRenderer();

  const handleGenerate = useCallback(() => {
    if (!imgEl || isRendering) return;
    render(imgEl, effectId, settings);
  }, [imgEl, effectId, settings, isRendering, render]);

  return (
    <div className={s.app}>
      <Sidebar
        previewUrl={previewUrl}
        imgInfo={imgInfo}
        isDragging={isDragging}
        uploadError={uploadError}
        onFileInput={handleFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onReset={reset}
        effectId={effectId}
        onEffectChange={setEffectId}
        settings={settings}
        onSettingsChange={setSettings}
        onGenerate={handleGenerate}
        onDownloadPng={() => downloadPng(effectId)}
        onDownloadSvg={() => downloadSvg(effectId)}
        isRendering={isRendering}
        isDone={isDone}
        hasImage={!!imgEl}
      />
      <CanvasView
        canvasRef={canvasRef}
        isRendering={isRendering}
        isDone={isDone}
        progress={progress}
        statusMsg={statusMsg}
        hasImage={!!imgEl}
        effectId={effectId}
      />
    </div>
  );
}
