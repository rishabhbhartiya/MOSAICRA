import React, { useState } from 'react';
import { EFFECTS, CATEGORIES } from '../utils/effectDefs';
import s from './EffectPicker.module.css';

export function EffectPicker({ selected, onChange }) {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');

  const visible = EFFECTS.filter(e =>
    (cat === 'all' || e.category === cat) &&
    (!query || e.label.toLowerCase().includes(query.toLowerCase()) || e.desc.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className={s.root}>
      <div className={s.search}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={s.searchIcon}>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="m21 21-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="search effects…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={s.searchInput}
        />
        {query && <button className={s.clearSearch} onClick={() => setQuery('')}>×</button>}
      </div>

      <div className={s.cats}>
        {CATEGORIES.map(c => {
          const count = c.id === 'all' ? EFFECTS.length : EFFECTS.filter(e => e.category === c.id).length;
          return (
            <button key={c.id} className={`${s.cat} ${cat===c.id?s.catActive:''}`} onClick={() => setCat(c.id)}>
              {c.label}
              <span className={s.catCount}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className={s.grid}>
        {visible.length === 0 && <p className={s.empty}>No effects match "{query}"</p>}
        {visible.map(e => (
          <button
            key={e.id}
            className={`${s.card} ${selected===e.id?s.active:''}`}
            onClick={() => onChange(e.id)}
            title={e.desc}
          >
            <span className={s.icon}>{e.icon}</span>
            <span className={s.name}>{e.label}</span>
            <span className={s.catTag}>{e.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
