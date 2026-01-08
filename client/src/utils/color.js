export const rgbStringToHex = (rgb) => {
  if (!rgb || typeof rgb !== 'string') return rgb;
  const m = rgb.match(/rgba?\s*\((\s*\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (!m) return rgb;
  const toHex = (n) => {
    const v = parseInt(n, 10);
    const h = v.toString(16);
    return h.length === 1 ? '0' + h : h;
  };
  return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
};

export const getStoredColor = (key, defaultColor) => {
  try {
    const v = localStorage.getItem(key);
    if (!v) return defaultColor;
    if (v.trim().startsWith('rgb')) return rgbStringToHex(v);
    return v;
  } catch (e) {
    return defaultColor;
  }
};
