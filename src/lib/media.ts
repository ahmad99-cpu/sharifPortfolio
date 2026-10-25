import type { Project } from '../data/content'

export function youtubeThumb(id: string, quality: 'maxresdefault' | 'hqdefault' = 'maxresdefault') {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`
}

export function youtubeEmbed(id: string) {
  const params = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1' })
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
