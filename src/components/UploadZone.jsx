import React, { useRef } from 'react';
import s from './UploadZone.module.css';

export function UploadZone({ previewUrl, imgInfo, isDragging, error, onFileInput, onDrop, onDragOver, onDragLeave, onReset }) {
  const inputRef = useRef(null);
  const trigger = () => { if(inputRef.current){inputRef.current.value='';inputRef.current.click();} };

  return (
    <div className={s.root}>
      <input ref={inputRef} type="file" accept="image/*" className={s.input} onChange={onFileInput} />

      {previewUrl ? (
        <div className={s.preview}>
          <img src={previewUrl} alt="" className={s.thumb} />
          <div className={s.info}>
            <span className={s.fname} title={imgInfo?.name}>{imgInfo?.name}</span>
            <span className={s.dims}>{imgInfo?.w}×{imgInfo?.h} · {imgInfo?.size}</span>
          </div>
          <div className={s.actions}>
            <button className={s.act} onClick={trigger}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 15V5m0 0L8 9m4-4 4 4M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Replace
            </button>
            <button className={`${s.act} ${s.actDanger}`} onClick={onReset}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${s.zone} ${isDragging?s.drag:''} ${error?s.err:''}`}
          onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
        >
          <div className={s.icon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 15V5m0 0L8 9m4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
            </svg>
          </div>
          {error
            ? <p className={s.errTxt}>{error}</p>
            : <p className={s.label}>{isDragging ? '— drop it —' : 'drag image here'}</p>
          }
          <button className={s.browse} onClick={trigger} type="button">Browse files</button>
          <p className={s.fmts}>JPG · PNG · WebP · GIF · BMP · SVG · AVIF</p>
        </div>
      )}
    </div>
  );
}
