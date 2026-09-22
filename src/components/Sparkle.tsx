export default function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 0C12.8 6.2 13.8 10.2 24 12C13.8 13.8 12.8 17.8 12 24C11.2 17.8 10.2 13.8 0 12C10.2 10.2 11.2 6.2 12 0Z"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  )
}
