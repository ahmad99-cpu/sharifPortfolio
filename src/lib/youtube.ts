// Minimal typings for the parts of the YouTube IFrame Player API this site uses.
export interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  getCurrentTime(): number
  getDuration(): number
  mute(): void
  unMute(): void
  destroy(): void
}

interface YTPlayerOptions {
  videoId: string
  host?: string
  width?: string
  height?: string
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: () => void
    onStateChange?: (e: { data: number }) => void
  }
}

interface YTNamespace {
  Player: new (el: HTMLElement, options: YTPlayerOptions) => YTPlayer
  PlayerState: { PLAYING: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let api: Promise<YTNamespace> | null = null

/** Loads https://www.youtube.com/iframe_api once and resolves with the `YT` namespace. */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  api ??= new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT as YTNamespace)
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.appendChild(script)
  })
  return api
}

/** Player settings for a silent, chrome-free, looping clip the page controls itself. */
export function clipPlayerVars(id: string) {
  return {
    autoplay: 0,
    mute: 1,
    controls: 0,
    loop: 1,
    playlist: id, // required for loop to work on a single video
    playsinline: 1,
    rel: 0,
    modestbranding: 1,
    iv_load_policy: 3,
    disablekb: 1,
    fs: 0,
  }
}
