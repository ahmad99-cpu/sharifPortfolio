/**
 * All editable site content lives here.
 *
 * Adding work:
 *  - Self-hosted video: drop the file in /public/videos and use { type: 'video', src: '/videos/name.mp4' }
 *  - YouTube: use { type: 'youtube', id: 'VIDEO_ID' } (the part after `watch?v=` or `/shorts/`)
 *  - `preview` is an optional short, muted clip (3–8s, ~1–3 MB) that plays when a card is hovered.
 *
 * Every URL below marked PLACEHOLDER is demo media — replace it with real work.
 */

export type Media =
  | { type: 'video'; src: string; poster?: string }
  | { type: 'youtube'; id: string }

export type Orientation = 'landscape' | 'portrait'

export const categories = ['Commercial', 'Social', 'YouTube', 'Documentary'] as const
export type Category = (typeof categories)[number]

export interface Project {
  title: string
  client: string
  category: Category
  year: string
  role: string
  duration?: string
  /** Total views as a plain number (e.g. 2400000); shown on the card as "2.4M views". */
  views?: number
  media: Media
  /** Thumbnail image. YouTube projects fall back to the video's own thumbnail. */
  thumbnail?: string
  /** Short muted loop played on hover. */
  preview?: string
  orientation?: Orientation
}

export interface Comparison {
  title: string
  tag: string
  description: string
  kind: 'image' | 'video'
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  /**
   * Demo helper: renders the "before" layer desaturated and flat like ungraded LOG footage.
   * Leave off when you supply a real ungraded source file.
   */
  simulateRaw?: boolean
}

// PLACEHOLDER demo clips (open-licence test footage). Replace with real work.
const clip = (name: string, res: 720 | 1080 = 720) =>
  `https://test-videos.co.uk/vids/${name.toLowerCase().replace(/_/g, '')}/mp4/h264/${res}/${name}_${res}_10s_${res === 1080 ? 5 : 1}MB.mp4`
const JELLYFISH = clip('Jellyfish')
const SINTEL = clip('Sintel')
const BUNNY = clip('Big_Buck_Bunny')
const FLOWER = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const site = {
  name: 'Sharif Vision',
  role: 'Video Editor & Colorist',
  email: 'sharif.videoeditor@gmail.com',
  phone: '(123) 456 7890', // PLACEHOLDER
  location: 'Working worldwide · Remote', // PLACEHOLDER
  availability: 'Booking projects for Q1 2027', // PLACEHOLDER
  portrait: 'https://picsum.photos/id/250/900/1200', // PLACEHOLDER: swap for a real portrait
  socials: [
    { label: 'Instagram', href: '#' }, // PLACEHOLDER
    { label: 'YouTube', href: 'https://www.youtube.com/@Sharif.editss' },
    { label: 'LinkedIn', href: '#' }, // PLACEHOLDER
    { label: 'Vimeo', href: '#' }, // PLACEHOLDER
  ],
}

export const showreel = {
  /** Muted background loop in the hero. Keep it short and light (<8 MB). */
  background: { src: clip('Jellyfish', 1080), poster: undefined as string | undefined },
  /** What plays when someone hits "Watch showreel". */
  full: { type: 'youtube', id: '615cdYG6ES4' } as Media,
}

export const projects: Project[] = [
  {
    title: 'Energyze Comparison',
    client: 'Energyze',
    category: 'Social',
    year: '2026',
    role: 'Edit · Color grade',
    duration: '0:49',
    media: { type: 'youtube', id: '2Mu3VSVpEac' },
    orientation: 'portrait',
  },
  {
    title: 'Ignite the Night',
    client: 'Blaze Energy',
    category: 'Commercial',
    year: '2026',
    role: 'Edit · Color · Sound design',
    duration: '0:10',
    views: 2_400_000, // PLACEHOLDER
    media: { type: 'video', src: SINTEL },
  },
  {
    title: 'Costa Rica in 4K',
    client: 'Travel feature',
    category: 'Documentary',
    year: '2025',
    role: 'Edit · Color',
    views: 18_700_000, // PLACEHOLDER
    media: { type: 'youtube', id: 'LXb3EKWsInQ' },
  },
  {
    title: 'Weekend Escape',
    client: 'Roam Travel Co.',
    category: 'Social',
    year: '2026',
    role: 'Edit · Motion graphics',
    duration: '0:10',
    views: 845_000, // PLACEHOLDER
    media: { type: 'video', src: BUNNY },
  },
  {
    title: 'In Full Bloom',
    client: 'Petal & Co.',
    category: 'Commercial',
    year: '2025',
    role: 'Edit · Sound design',
    duration: '0:05',
    views: 312_000, // PLACEHOLDER
    media: { type: 'video', src: FLOWER },
  },
  {
    title: 'Showreel Portfolio',
    client: 'Sharif Vision',
    category: 'YouTube',
    year: '2025',
    role: 'Edit · Color · Sound design',
    duration: '0:50',
    media: { type: 'youtube', id: '615cdYG6ES4' },
  },
]

export const comparisons: Comparison[] = [
  {
    title: 'Cinematic color grade',
    tag: 'Color',
    description: 'Flat LOG footage graded for a warm, filmic look that holds skin tones and keeps the highlights soft.',
    kind: 'video',
    before: JELLYFISH, // PLACEHOLDER
    after: JELLYFISH, // PLACEHOLDER
    beforeLabel: 'Raw LOG',
    afterLabel: 'Graded',
    simulateRaw: true,
  },
  {
    title: 'Product spot finishing',
    tag: 'Color · Cleanup',
    description: 'Contrast, saturation and exposure balanced shot-to-shot so the product reads the same in every cut.',
    kind: 'video',
    before: SINTEL, // PLACEHOLDER
    after: SINTEL, // PLACEHOLDER
    beforeLabel: 'Camera original',
    afterLabel: 'Final',
    simulateRaw: true,
  },
  {
    title: 'Portrait still grade',
    tag: 'Stills',
    description: 'A thumbnail-ready frame pulled from the edit and graded to stop the scroll.',
    kind: 'image',
    before: 'https://picsum.photos/id/1027/1600/900', // PLACEHOLDER
    after: 'https://picsum.photos/id/1027/1600/900', // PLACEHOLDER
    simulateRaw: true,
  },
]

export const stats = [
  { value: 5, suffix: '+', label: 'Years cutting professionally' },
  { value: 120, suffix: '+', label: 'Projects delivered' }, // PLACEHOLDER
  { value: 40, suffix: 'M+', label: 'Views across client channels' }, // PLACEHOLDER
  { value: 48, suffix: 'h', label: 'Typical first-cut turnaround' }, // PLACEHOLDER
]

export const services = [
  {
    title: 'Commercial & brand films',
    body: 'Launch films, product spots and brand stories cut to a brief, a runtime and a call to action.',
  },
  {
    title: 'Social-first content',
    body: 'Reels, TikToks and Shorts built for the first two seconds: hooks, captions and pacing that hold attention.',
  },
  {
    title: 'YouTube long-form',
    body: 'Story structure, retention pacing, b-roll and sound design for channels that need to grow.',
  },
  {
    title: 'Color grading',
    body: 'From flat LOG to a finished look, with every shot matched so the whole piece feels deliberate.',
  },
  {
    title: 'Motion & sound design',
    body: 'Titles, lower thirds, transitions and a mix that makes the edit feel expensive.',
  },
]

export const process = [
  { step: 'Brief', body: 'We align on goals, audience, references and deadlines in a short call.' },
  { step: 'First cut', body: 'A full rough cut, usually within 48 hours of receiving footage.' },
  { step: 'Refine', body: 'Two focused revision rounds on story, pacing, color and sound.' },
  { step: 'Deliver', body: 'Masters and every platform cut you need, exported and ready to post.' },
]

export const tools = ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'CapCut', 'Photoshop']

export const marquee = ['Commercials', 'Reels & Shorts', 'YouTube', 'Color grading', 'Documentary', 'Motion design']
