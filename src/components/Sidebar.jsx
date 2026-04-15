import React from 'react';
import { UploadZone } from './UploadZone';
import { EffectPicker } from './EffectPicker';
import { ControlsPanel } from './ControlsPanel';
import s from './Sidebar.module.css';

export function Sidebar({ previewUrl, imgInfo, isDragging, uploadError, onFileInput, onDrop, onDragOver, onDragLeave, onReset, effectId, onEffectChange, settings, onSettingsChange, onGenerate, onDownloadPng, onDownloadSvg, isRendering, isDone, hasImage }) {
  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <div className={s.brandMark}>
          <span className={s.brandP}>P</span><span className={s.brandX}>X</span>
        </div>
        <div className={s.brandText}>
          <span className={s.brandName}>PIXELALCHEMY</span>
          <span className={s.brandSub}>Image Art Studio</span>
        </div>
        <span className={s.badge}>v1.0</span>
      </div>

      <div className={s.scroll}>
        <div className={s.sec}>
          <div className={s.secTitle}>
            <span className={s.secNum}>01</span> Source Image
          </div>
          <UploadZone previewUrl={previewUrl} imgInfo={imgInfo} isDragging={isDragging}
            error={uploadError} onFileInput={onFileInput} onDrop={onDrop}
            onDragOver={onDragOver} onDragLeave={onDragLeave} onReset={onReset} />
        </div>

        <div className={s.sec}>
          <div className={s.secTitle}>
            <span className={s.secNum}>02</span> Effect
          </div>
          <EffectPicker selected={effectId} onChange={onEffectChange} />
        </div>

        <div className={s.sec}>
          <div className={s.secTitle}>
            <span className={s.secNum}>03</span> Settings
          </div>
          <ControlsPanel effectId={effectId} settings={settings} onChange={onSettingsChange} />
        </div>
      </div>

      <div className={s.footer}>
        <button
          className={`${s.genBtn} ${isRendering?s.genRunning:''}`}
          onClick={onGenerate}
          disabled={!hasImage || isRendering}
        >
          {isRendering ? (
            <><span className={s.spinner}/><span>Rendering…</span></>
          ) : (
            <><span className={s.genIcon}>▶</span><span>Generate</span></>
          )}
        </button>

        {isDone && (
          <div className={s.dlRow}>
            <button className={s.dlBtn} onClick={onDownloadPng}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M6 12l6 6 6-6M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              PNG
            </button>
            <button className={s.dlBtn} onClick={onDownloadSvg}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M6 12l6 6 6-6M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              SVG
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
