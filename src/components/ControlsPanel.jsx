import React, { useState } from 'react';
import { COLOR_MODES, BG_MODES, EFFECTS } from '../utils/effectDefs';
import s from './ControlsPanel.module.css';

function Slider({ label, value, min, max, step=1, unit='', onChange, accent }) {
  const pct = ((value-min)/(max-min))*100;
  return (
    <div className={s.sliderRow}>
      <div className={s.sliderHdr}>
        <span className={s.sliderLbl}>{label}</span>
        <span className={`${s.sliderVal} ${accent?s.accentVal:''}`}>{value}{unit}</span>
      </div>
      <div className={s.trackWrap}>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e=>onChange(Number(e.target.value))}
          style={{'--pct':`${pct}%`}}
        />
      </div>
    </div>
  );
}

function ChipGroup({ options, value, onChange, cols=3 }) {
  return (
    <div className={s.chips} style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
      {options.map(o => (
        <button key={o.id} className={`${s.chip} ${value===o.id?s.chipOn:''}`} onClick={()=>onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children, defaultOpen=true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={s.section}>
      <button className={s.secHdr} onClick={()=>setOpen(!open)}>
        <span>{title}</span>
        <span className={`${s.chevron} ${open?s.chevronOpen:''}`}>›</span>
      </button>
      {open && <div className={s.secBody}>{children}</div>}
    </div>
  );
}

export function ControlsPanel({ effectId, settings, onChange }) {
  const def = EFFECTS.find(e => e.id === effectId);
  const set = (key, val) => onChange({ ...settings, [key]: val });

  const colorGroups = [
    { label: 'Natural',  ids: ['color','mono','sepia','invert'] },
    { label: 'Tinted',   ids: ['duotone','thermal','cyberpunk','vaporwave'] },
    { label: 'Stylized', ids: ['matrix','redblue','gold','xray'] },
  ];

  return (
    <div className={s.panel}>

      <Section title="Adjustments">
        {def?.hasDensity && (
          <Slider label="Density" value={settings.density} min={20} max={180} step={5}
            onChange={v=>set('density',v)} accent />
        )}
        <Slider label="Brightness" value={settings.brightness} min={-100} max={100}
          onChange={v=>set('brightness',v)} />
        <Slider label="Contrast"   value={settings.contrast}   min={-80}  max={80}
          onChange={v=>set('contrast',v)} />
        <Slider label="Saturation" value={settings.saturation} min={-100} max={100}
          onChange={v=>set('saturation',v)} />
        <Slider label="Opacity"    value={settings.opacity}    min={10}   max={100} unit="%"
          onChange={v=>set('opacity',v)} />
      </Section>

      <Section title="Color Mode">
        {colorGroups.map(g => (
          <div key={g.label} className={s.colorGroup}>
            <span className={s.groupLbl}>{g.label}</span>
            <ChipGroup
              options={COLOR_MODES.filter(m => g.ids.includes(m.id))}
              value={settings.colorMode}
              onChange={v=>set('colorMode',v)}
              cols={4}
            />
          </div>
        ))}
      </Section>

      <Section title="Background">
        <ChipGroup options={BG_MODES} value={settings.bgMode} onChange={v=>set('bgMode',v)} cols={4} />
      </Section>

      {def?.hasTextInput && (
        <Section title="Fill Text">
          <input type="text" value={settings.fillText} maxLength={200}
            placeholder="Your text here…"
            onChange={e=>set('fillText',e.target.value)} />
          <p className={s.hint}>Repeats to fill the image silhouette</p>
        </Section>
      )}

      {effectId === 'halftone_dot' && (
        <Section title="Dot Shape">
          <ChipGroup
            options={[{id:'circle',label:'Circle'},{id:'diamond',label:'Diamond'},{id:'star',label:'Star'}]}
            value={settings.dotShape||'circle'} onChange={v=>set('dotShape',v)} cols={3}
          />
        </Section>
      )}

      {effectId === 'glitch' && (
        <Section title="Glitch">
          <Slider label="Intensity" value={settings.glitchAmt||40} min={5} max={100}
            onChange={v=>set('glitchAmt',v)} accent />
        </Section>
      )}

      {effectId === 'scanlines' && (
        <Section title="Scan Lines">
          <Slider label="Gap" value={settings.scanGap||4} min={2} max={12}
            onChange={v=>set('scanGap',v)} accent />
        </Section>
      )}

      {effectId === 'thread' && (
        <Section title="Thread">
          <Slider label="Thread count" value={settings.threadCount||12000} min={2000} max={30000} step={1000}
            onChange={v=>set('threadCount',v)} accent />
        </Section>
      )}

    </div>
  );
}
