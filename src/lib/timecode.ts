const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')

/** SMPTE-style timecode: HH:MM:SS:FF */
export function toTimecode(seconds: number, fps = 25) {
  const s = Math.max(0, seconds)
  const frames = Math.floor((s % 1) * fps)
  return `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}:${pad(frames)}`
}
