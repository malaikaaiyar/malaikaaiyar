// Typed-character patterns: every decorative mark on the site is a real character.

export function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** One row of a single character in uneven runs: "++++ ++ +  + ++ +" */
export function weaveRow(seed: string, len = 240, chars = ['0', '+', '|', '-']) {
  const r = rng(seed);
  const c = chars[Math.floor(r() * chars.length)];
  let out = '';
  while (out.length < len) {
    out += c.repeat(1 + Math.floor(r() * 5)) + ' '.repeat(1 + Math.floor(r() * 3));
  }
  return out.slice(0, len);
}

const FONT: Record<string, string[]> = {
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
};

export const BG = ['+', '|', '-'];

/** Big letters made of 0s, sitting in a field of + | - */
export function banner(lines: string[], seed: string, cols = 43) {
  const r = rng(seed);
  const grid: boolean[][] = [];
  const blank = () => Array(cols).fill(false);
  grid.push(blank());
  lines.forEach((word, li) => {
    for (let y = 0; y < 7; y++) {
      const row = blank();
      [...word].forEach((ch, i) => {
        const g = FONT[ch];
        for (let x = 0; x < 5; x++) if (g[y][x] === '1') row[1 + i * 6 + x] = true;
      });
      grid.push(row);
    }
    grid.push(blank());
    if (li < lines.length - 1) grid.push(blank());
  });
  return grid.map((row, y) => {
    const c = BG[y % BG.length];
    return { c, text: row.map(on => (on ? '00' : (r() < 0.14 ? c : ' ') + (r() < 0.14 ? c : ' '))).join('') };
  });
}

export const rowHtml = (s: string) => s.replace(/0+/g, m => `<b>${m}</b>`);
