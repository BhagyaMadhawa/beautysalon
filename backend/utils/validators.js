// utils/validators.js
export const toStr = (v) => (v == null ? null : String(v).trim() || null);
export const toInt = (v) => (v == null || v === '' ? null : Number.parseInt(v, 10));
export const toMoney = (v) => (v == null || v === '' ? null : Number.parseFloat(v));

export function minutesFromLabel(label) {
  // "30 min" -> 30
  const m = /^(\d+)\s*min$/i.exec(label?.trim() || '');
  return m ? Number.parseInt(m[1], 10) : null;
}
