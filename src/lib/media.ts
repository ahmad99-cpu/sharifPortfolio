import type { Project } from '../data/content'

export function youtubeThumb(id: string, quality: 'maxresdefault' | 'hqdefault' = 'maxresdefault') {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`
}

export function youtubeEmbed(id: string) {
  const params = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1' })
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}

/** Muted, chrome-free, endlessly looping embed for use as a background. */
export function youtubeBackgroundEmbed(id: string) {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id, // required for loop to work on a single video
    controls: '0',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

/** 2400000 → "2.4M" */
export function formatViews(views: number) {
  return compact.format(views)
}

export function projectThumbnail(project: Project) {
  if (project.thumbnail) return project.thumbnail
  return project.media.type === 'youtube' ? youtubeThumb(project.media.id) : project.media.poster
}
