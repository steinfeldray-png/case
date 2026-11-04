// Publishes cases/<slug>/case.json to the backend: uploads local images, then creates or updates the project.
// Usage: node scripts/publish-case.mjs <slug>...  (needs VITE_API_URL and ADMIN_KEY)
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const api = process.env.VITE_API_URL;
const adminKey = process.env.ADMIN_KEY;
const headers = { 'x-admin-key': adminKey };

async function request(path, options) {
  const res = await fetch(`${api}${path}`, { ...options, signal: AbortSignal.timeout(120000) });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(`${path}: ${result.error ?? res.status}`);
  return result.data;
}

async function resolveImage(slug, image) {
  if (!image || /^https?:\/\//.test(image)) return image;
  const form = new FormData();
  const type = image.endsWith('.jpg') || image.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  form.append('file', new Blob([await readFile(join('cases', slug, image))], { type }), basename(image));
  const { url } = await request('/api/upload', { method: 'POST', headers, body: form });
  return url;
}

async function publish(slug) {
  const project = JSON.parse(await readFile(join('cases', slug, 'case.json'), 'utf8'));
  if (project.slug !== slug) throw new Error(`${slug}: slug in case.json does not match its folder`);

  project.imageUrl = await resolveImage(slug, project.imageUrl);
  project.caseImages = await Promise.all((project.caseImages ?? []).map((image) => resolveImage(slug, image)));

  const existing = (await request('/api/projects')).find((p) => p.slug === slug);
  await request(existing ? `/api/projects/${existing.id}` : '/api/projects', {
    method: existing ? 'PUT' : 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  console.log(`${existing ? 'updated' : 'created'} ${slug}`);
}

const slugs = process.argv.slice(2);
if (!slugs.length) console.log('no cases to publish');
if (slugs.length && !adminKey) throw new Error('ADMIN_KEY is not set');
for (const slug of slugs) await publish(slug);
