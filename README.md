# Sharif Vision — Portfolio

React + TypeScript + Vite + Tailwind v4, with Lenis for smooth scrolling.

```bash
npm install
npm run dev
```

## Editing content

Everything on the site (copy, contact details, projects, before/after comparisons, stats, services) lives in
[`src/data/content.ts`](src/data/content.ts). Entries marked `PLACEHOLDER` are demo media and numbers to replace.

### Adding a project

```ts
// Self-hosted: put the file in public/videos/
{ title: 'Launch Film', client: 'Acme', category: 'Commercial', year: '2026', role: 'Edit · Color',
  media: { type: 'video', src: '/videos/launch.mp4', poster: '/videos/launch.jpg' } }

// YouTube: just the video id (from watch?v=… or /shorts/…)
{ title: 'Channel Trailer', client: 'Creator', category: 'YouTube', year: '2026', role: 'Edit',
  media: { type: 'youtube', id: 'dQw4w9WgXcQ' } }
```

Optional fields: `thumbnail` (image), `preview` (short muted clip that plays on hover), `duration`, and
`orientation: 'portrait'` for Reels/Shorts so the player opens at 9:16.

### Adding a before / after

```ts
{ title: 'Commercial grade', tag: 'Color', description: '…', kind: 'video',
  before: '/videos/spot-log.mp4', after: '/videos/spot-graded.mp4' }
```

Both files should be the same length and frame-aligned: the two layers play in sync. `kind: 'image'` works for
stills. `simulateRaw: true` fakes a flat LOG look on the "before" layer and is only meant for demos.

### Video tips

- Export web clips as H.264 MP4, 1080p, ~4–8 Mbps; keep hover previews to 3–8 s and under ~3 MB.
- The hero background loop is `showreel.background`; the "Watch showreel" button plays `showreel.full`.
