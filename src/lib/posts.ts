import { getCollection } from 'astro:content';
import snapshot from '../data/substack.json';

export const SUBSTACK = 'https://malaikaaiyar.substack.com';

export interface Post {
  title: string;
  date: string;        // DD.MM.YYYY
  description: string;
  tags: string[];
  href: string;
  external: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toDots = (d: Date) => `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
const unwrap = (s = '') => s.replace(/^<!\[CDATA\[|\]\]>$/g, '').trim();
const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'");

let substackCache: Post[] | null = null;

/** Fetched at build time; falls back to the committed snapshot when offline. */
export async function getSubstackPosts(): Promise<Post[]> {
  if (substackCache) return substackCache;
  let items: { title: string; url: string; date: string; description: string }[] = snapshot;
  try {
    const res = await fetch(`${SUBSTACK}/feed`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(String(res.status));
    const xml = await res.text();
    const parsed = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
      const tag = (t: string) => decode(unwrap(it.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1]));
      return { title: tag('title'), url: tag('link'), date: toDots(new Date(tag('pubDate'))), description: tag('description') };
    });
    if (parsed.length) items = parsed;
  } catch {
    // offline build: keep snapshot
  }
  substackCache = items.map(i => ({ ...i, href: i.url, tags: [], external: true }));
  return substackCache;
}

export async function getLocalPosts(): Promise<Post[]> {
  const astroFiles = import.meta.glob('../components/posts/*.astro');
  const astroPosts = await Promise.all(
    Object.entries(astroFiles).map(async ([path, resolver]) => {
      const mod = (await resolver()) as any;
      const slug = path.split('/').pop()!.replace('.astro', '').toLowerCase();
      return { title: mod.title ?? '', date: mod.date ?? '', description: mod.description ?? '', tags: mod.tags ?? [], href: `/posts/${slug}`, external: false };
    })
  );
  const md = (await getCollection('posts')).map(e => ({
    title: e.data.title, date: e.data.date, description: e.data.description ?? '', tags: e.data.tags ?? [], href: `/posts/${e.id}`, external: false,
  }));
  return [...astroPosts, ...md];
}

export const parseDate = (s: string) => {
  const [d, m, y] = s.split('.');
  return new Date(`${y}-${m}-${d}`).getTime();
};

export const byNewest = (a: Post, b: Post) => parseDate(b.date) - parseDate(a.date);

export async function getAllPosts(): Promise<Post[]> {
  return [...(await getLocalPosts()), ...(await getSubstackPosts())].sort(byNewest);
}

export function groupByYear(posts: Post[]) {
  const by: Record<string, Post[]> = {};
  for (const p of posts) (by[p.date.split('.')[2]] ??= []).push(p);
  return Object.keys(by).sort((a, b) => +b - +a).map(year => ({ year, posts: by[year] }));
}
