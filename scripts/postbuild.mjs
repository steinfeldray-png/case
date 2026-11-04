// GitHub Pages answers 404 for SPA routes, so each case gets its own index.html.
// Generates those pages and sitemap.xml from the API; skipped if the API is unavailable.
import { copyFile, mkdir, writeFile } from 'node:fs/promises';

const SITE = 'https://saneuuu.ru';
const api = process.env.VITE_API_URL;

async function fetchProjects() {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(`${api}/api/projects`, { signal: AbortSignal.timeout(60000) });
      const result = await res.json();
      if (result.success) return result.data;
    } catch (error) {
      console.warn(`postbuild: attempt ${attempt + 1} failed: ${error.message}`);
    }
  }
  return null;
}

const projects = api ? await fetchProjects() : null;

if (!projects) {
  console.warn('postbuild: no project data, skipping case pages and sitemap');
} else {
  const slugs = projects.map((p) => p.slug).filter(Boolean);
  for (const slug of slugs) {
    await mkdir(`dist/case/${slug}`, { recursive: true });
    await copyFile('dist/index.html', `dist/case/${slug}/index.html`);
  }
  const urls = ['/', ...slugs.map((slug) => `/case/${slug}`)]
    .map((path) => `  <url><loc>${SITE}${path}</loc></url>`)
    .join('\n');
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
}
